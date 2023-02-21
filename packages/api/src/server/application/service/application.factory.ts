import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { EPHEMERAL_ENV } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import {
  ApplicationConfigDTO,
  ApplicationResponse,
  CreateApplicationDto,
  SSRDeploymentRequest,
  SSRDeploymentResponse
} from 'src/server/application/application.dto';
import { Application } from 'src/server/application/application.entity';
import { AuthFactory } from 'src/server/auth/auth.factory';
import { Cluster, Environment } from 'src/server/environment/environment.entity';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { v4 as uuidv4 } from 'uuid';
import { zip } from 'zip-a-folder';

@Injectable()
export class ApplicationFactory {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly exceptionService: ExceptionsService
  ) {}

  /* @internal
   * Create the spaship config (.spaship) from the application
   * Check the distribution folder from the archive
   * Write the .spaship file in the distribution folder
   * Zip the distribution folder
   */
  async createTemplateAndZip(
    appPath: string,
    ref: string,
    name: string,
    tmpDir: string,
    propertyIdentifier: string,
    env: string,
    namespace: string
  ): Promise<string> {
    const fileExists = async (filePath) => !!(await fs.promises.stat(filePath).catch(() => false));
    const rootspa = 'ROOTSPA';
    if (appPath.charAt(0) === '/' && appPath.length === 1) appPath = rootspa;
    else if (appPath.charAt(0) === '/') appPath = appPath.substr(1);
    const tmpWebsiteVersion = ref || 'v1';
    const websiteVersion = this.getIdentifier(tmpWebsiteVersion);
    const spashipFile = {
      websiteVersion: this.trimWebsiteVersion(websiteVersion),
      websiteName: propertyIdentifier,
      name,
      mapping: appPath,
      environments: [{ name: env, updateRestriction: false, exclude: false, ns: namespace }]
    };
    this.logger.log('SpashipFile', JSON.stringify(spashipFile));
    let zipPath;
    try {
      if (await fileExists(path.join(tmpDir, 'dist'))) {
        await fs.writeFileSync(path.join(tmpDir, 'dist/.spaship'), JSON.stringify(spashipFile, null, '\t'));
        zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
        await zip(path.join(tmpDir, 'dist'), zipPath);
      } else if (await fileExists(path.join(tmpDir, 'build'))) {
        await fs.writeFileSync(path.join(tmpDir, 'build/.spaship'), JSON.stringify(spashipFile, null, '\t'));
        zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
        await zip(path.join(tmpDir, 'build'), zipPath);
      } else if (await fileExists(path.join(tmpDir, 'package'))) {
        // @internal npm pack support added
        await fs.writeFileSync(path.join(tmpDir, 'package/.spaship'), JSON.stringify(spashipFile, null, '\t'));
        zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
        await zip(path.join(tmpDir, 'package'), zipPath);
      } else {
        await fs.writeFileSync(path.join(tmpDir, '.spaship'), JSON.stringify(spashipFile, null, '\t'));
        zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
        await zip(tmpDir, zipPath);
      }
      this.logger.log('ZipPath', zipPath);
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return zipPath;
  }

  // @internal Upload the distribution folder to the deployment engine
  async deploymentRequest(formData: FormData, deploymentBaseURL: string): Promise<AxiosResponse<any, any>> {
    const headers = { Authorization: await AuthFactory.getAccessToken(), ...formData.getHeaders() };
    return this.httpService.axiosRef.post(`${deploymentBaseURL}/api/upload`, formData, {
      maxBodyLength: Infinity,
      headers
    });
  }

  createNewApplication(createApplicationDto: CreateApplicationDto): Application {
    const newApplication = new Application();
    newApplication.name = createApplicationDto.name;
    newApplication.path = createApplicationDto.path;
    return newApplication;
  }

  createApplicationRequest(
    propertyIdentifier: string,
    applicationRequest: CreateApplicationDto,
    identifier: string,
    env: string,
    createdBy: string
  ): Application {
    const saveApplication = new Application();
    saveApplication.propertyIdentifier = propertyIdentifier;
    saveApplication.name = applicationRequest.name;
    saveApplication.path = applicationRequest.path;
    saveApplication.identifier = identifier;
    saveApplication.nextRef = this.getNextRef(applicationRequest.ref) || 'NA';
    saveApplication.env = env;
    saveApplication.propertyIdentifier = propertyIdentifier;
    saveApplication.ref = 'NA';
    saveApplication.accessUrl = 'NA';
    saveApplication.isSSR = false;
    saveApplication.createdBy = createdBy;
    saveApplication.updatedBy = createdBy;
    saveApplication.version = 1;
    return saveApplication;
  }

  getNextRef(ref: string): string {
    if (ref === 'undefined') return 'NA';
    return ref;
  }

  // TODO : Add the deployed-by post RBAC Implementation
  createApplicationResponse(application: Application, baseUrl: string): ApplicationResponse {
    const applicationResponse = new ApplicationResponse();
    applicationResponse.name = application.name;
    applicationResponse.path = application.path;
    applicationResponse.env = application.env;
    applicationResponse.ref = this.getRef(application.nextRef);
    applicationResponse.accessUrl = this.getAccessUrl(application, baseUrl);
    return applicationResponse;
  }

  private getRef(nextRef: string): string {
    if (nextRef === 'NA') return 'Ref is not present for this Deployment.';
    return nextRef;
  }

  private getAccessUrl(application: Application, baseUrl: string): string {
    let generatedAccessURL = application.accessUrl;
    if (generatedAccessURL === 'NA') {
      const protocol = 'http';
      const { hostname } = new URL(baseUrl);
      const appPrefix = hostname.split('.')[4];
      const domain = hostname.split('.').slice(1).join('.');
      generatedAccessURL = `${protocol}://${appPrefix}.spaship--${application.propertyIdentifier}.${application.propertyIdentifier}.${
        application.env
      }.${domain}${this.getGeneratedPath(application.path)}`;
    }
    return generatedAccessURL;
  }

  private getGeneratedPath(reqPath: string) {
    const basePath = '/ROOTSPA';
    if (reqPath === '/') return basePath;
    const finalPath = `/${reqPath.split('/').slice(1).join('_')}`;
    return finalPath;
  }

  isEphemeral(applicationRequest: CreateApplicationDto) {
    return applicationRequest.ephemeral === 'true';
  }

  createEphemeralPreview(propertyIdentifier: string, actionEnabled: boolean, actionId: string, createdBy: string): Environment {
    const ephEnvironment = new Environment();
    ephEnvironment.propertyIdentifier = propertyIdentifier;
    ephEnvironment.env = `ephemeral-${uuidv4().substring(0, 4)}`;
    ephEnvironment.url = 'NA';
    ephEnvironment.cluster = Cluster.PREPROD;
    ephEnvironment.isEph = true;
    ephEnvironment.actionEnabled = actionEnabled;
    ephEnvironment.actionId = actionId;
    ephEnvironment.expiresIn = EPHEMERAL_ENV.expiresIn.toString();
    ephEnvironment.createdBy = createdBy;
    return ephEnvironment;
  }

  // @internal generate the application identifier
  getIdentifier(identifier): string {
    return (
      encodeURIComponent(identifier)
        .toLowerCase()
        /* Replace the encoded hexadecimal code with `-` */
        .replace(/%[0-9a-zA-Z]{2}/g, '-')
        /* Replace any special characters with `-` */
        .replace(/[\ \-\/\:\@\[\]\`\{\~\.]+/g, '-')
        /* Special characters are replaced by an underscore */
        .replace(/[\|!@#$%^&*;"<>\(\)\+,]/g, '_')
        /* Remove any starting or ending `-` */
        .replace(/^-+|-+$/g, '')
        /* Removing multiple consecutive `-`s */
        .replace(/--+/g, '-')
    );
  }

  // @internal max length in openshfit to deploy
  trimWebsiteVersion(version): string {
    const maxLength = 60;
    if (version.length > maxLength) return version.substr(0, maxLength);
    return version;
  }

  // @internal generate the application identifier
  getPath(requestPath: string): string {
    const appPath = requestPath.replace(/^\/+/g, '').replace(/\/+$/, '');
    return `/${appPath}`;
  }

  // @internal Start the SSR deployment to the operator
  async ssrDeploymentRequest(request?: SSRDeploymentRequest, deploymentBaseURL?: string): Promise<SSRDeploymentResponse> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    const ssrResponse = new SSRDeploymentResponse();
    try {
      const response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/deployment/v1/create`, request, {
        maxBodyLength: Infinity,
        headers
      });
      ssrResponse.accessUrl = response.data.accessUrl;
    } catch (err) {
      this.logger.error('SSROperatorDeployment', err);
    }
    return ssrResponse;
  }

  // @internal Update the configuration for a SSR enabled application
  async ssrConfigUpdate(request?: SSRDeploymentRequest, deploymentBaseURL?: string) {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    this.logger.log('SSROperatorConfigRequest', JSON.stringify(request));
    try {
      const response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/deployment/v1/config`, request, {
        maxBodyLength: Infinity,
        headers
      });
      this.logger.log('SSROperatorConfigResponse', JSON.stringify(response.data));
    } catch (err) {
      this.logger.error('SSROperatorConfig', err);
    }
  }

  // @internal Create the Application request for the SSE enabled deployment
  createSSRApplicationRequest(
    propertyIdentifier: string,
    applicationRequest: CreateApplicationDto,
    identifier: string,
    env: string,
    createdBy: string
  ): Application {
    const ssrApplicationRequest = this.createApplicationRequest(propertyIdentifier, applicationRequest, identifier, env, createdBy);
    ssrApplicationRequest.isSSR = true;
    ssrApplicationRequest.imageUrl = applicationRequest.imageUrl;
    ssrApplicationRequest.healthCheckPath = applicationRequest.healthCheckPath;
    ssrApplicationRequest.config = applicationRequest.config;
    return ssrApplicationRequest;
  }

  // @internal Create the Deployment Request to the Operator for the SSE deployment
  createSSROperatorRequest(
    applicationRequest: CreateApplicationDto,
    propertyIdentifier: string,
    identifier: string,
    env: string,
    namespace: string
  ): SSRDeploymentRequest {
    const ssrRequest = new SSRDeploymentRequest();
    ssrRequest.imageUrl = applicationRequest.imageUrl;
    ssrRequest.app = identifier;
    ssrRequest.contextPath = applicationRequest.path;
    ssrRequest.website = propertyIdentifier;
    ssrRequest.nameSpace = namespace;
    ssrRequest.environment = env;
    ssrRequest.configMap = applicationRequest.config;
    ssrRequest.healthCheckPath = applicationRequest.healthCheckPath;
    return ssrRequest;
  }

  // @internal Increment the version of a specific application
  incrementVersion(version: number): number {
    return version ? version + 1 : 1;
  }

  // @internal Create the Deployment Request to the Operator for the SSE deployment
  createSSROperatorConfigRequest(configRequest: ApplicationConfigDTO, namespace: string): SSRDeploymentRequest {
    const ssrRequest = new SSRDeploymentRequest();
    ssrRequest.app = configRequest.identifier;
    ssrRequest.website = configRequest.propertyIdentifier;
    ssrRequest.nameSpace = namespace;
    ssrRequest.environment = configRequest.env;
    ssrRequest.configMap = configRequest.config;
    return ssrRequest;
  }
}
