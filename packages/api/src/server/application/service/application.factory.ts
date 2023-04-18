import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { EPHEMERAL_ENV, SSR_DETAILS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import {
  ApplicationConfigDTO,
  ApplicationResponse,
  CreateApplicationDto,
  GitValidateResponse,
  GitValidationRequestDTO,
  SSRDeploymentRequest,
  SSRDeploymentResponse,
  SSREnabledGitDeploymentRequest
} from 'src/server/application/application.dto';
import { Application } from 'src/server/application/application.entity';
import { AuthFactory } from 'src/server/auth/auth.factory';
import { Cluster, Environment } from 'src/server/environment/environment.entity';
import { EventTimeTrace } from 'src/server/event/event-time-trace.entity';
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

  private static readonly hexadecimalCode: RegExp = /%[0-9a-zA-Z]{2}/g;

  private static readonly specialChar1: RegExp = /[\ \-\/\:\@\[\]\`\{\~\.]+/g;

  private static readonly specialChar2: RegExp = /[\|!@#$%^&*;_"<>\(\)\+,]/g;

  private static readonly startEndChar: RegExp = /^-+|-+$/g;

  private static readonly consecutiveChar: RegExp = /--+/g;

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
    saveApplication.isGit = false;
    saveApplication.createdBy = createdBy;
    saveApplication.updatedBy = createdBy;
    saveApplication.version = 1;
    return saveApplication;
  }

  getNextRef(ref: string): string {
    if (ref === 'undefined') return 'NA';
    return ref;
  }

  createApplicationResponse(application: Application, baseUrl: string, applicationExists: string): ApplicationResponse {
    const applicationResponse = new ApplicationResponse();
    applicationResponse.name = application.name;
    applicationResponse.path = application.path;
    applicationResponse.env = application.env;
    applicationResponse.ref = this.getRef(application.nextRef);
    applicationResponse.accessUrl = application.isSSR ? this.getSSRAccessUrl(application, baseUrl) : this.getAccessUrl(application, baseUrl);
    if (applicationExists)
      applicationResponse.warning = `SPA(s) - ${applicationExists} already exist(s) on the context path ${applicationResponse.path}. Overriding existing deployment.`;
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

  // @internal generate the repository url
  getRepoUrl(repoUrl: string): string {
    return repoUrl.replace(/^\/+/g, '').replace(/\/+$/, '');
  }

  // @internal Start the SSR deployment to the operator
  async ssrDeploymentRequest(request?: SSRDeploymentRequest, deploymentBaseURL?: string): Promise<SSRDeploymentResponse> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    const ssrResponse = new SSRDeploymentResponse();
    try {
      await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/deployment/v1/create`, request, {
        maxBodyLength: Infinity,
        headers
      });
    } catch (err) {
      this.logger.error('SSROperatorDeployment', err);
    }
    return ssrResponse;
  }

  // @internal Start the SSR Enabled Git deployment to the operator
  // @internal TODO : To be changed after the operator integration
  async ssrEnabledGitDeploymentRequest(request?: SSREnabledGitDeploymentRequest, deploymentBaseURL?: string): Promise<SSRDeploymentResponse> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    const ssrResponse = new SSRDeploymentResponse();
    try {
      await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/deployment/v1/create`, request, {
        maxBodyLength: Infinity,
        headers
      });
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

  // @internal Create the Application request for the SSR enabled deployment
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
    ssrApplicationRequest.healthCheckPath = applicationRequest.healthCheckPath || applicationRequest.path;
    ssrApplicationRequest.config = applicationRequest.config;
    ssrApplicationRequest.port = applicationRequest.port || SSR_DETAILS.port;
    return ssrApplicationRequest;
  }

  // @internal Create the Application request for the SSR enabled  Git deployment
  createSSREnabledGitApplicationRequest(
    propertyIdentifier: string,
    applicationRequest: CreateApplicationDto,
    identifier: string,
    env: string,
    createdBy: string
  ): Application {
    const ssrEnabledGitApplicationRequest = this.createSSRApplicationRequest(propertyIdentifier, applicationRequest, identifier, env, createdBy);
    ssrEnabledGitApplicationRequest.isGit = true;
    ssrEnabledGitApplicationRequest.repoUrl = applicationRequest.repoUrl;
    ssrEnabledGitApplicationRequest.gitRef = applicationRequest.gitRef;
    ssrEnabledGitApplicationRequest.contextDir = applicationRequest.contextDir;
    ssrEnabledGitApplicationRequest.buildArgs = applicationRequest.buildArgs;
    ssrEnabledGitApplicationRequest.commitId = applicationRequest.commitId || 'NA';
    ssrEnabledGitApplicationRequest.mergeId = applicationRequest.mergeId || 'NA';
    return ssrEnabledGitApplicationRequest;
  }

  // @internal Create the Deployment Request to the Operator for the SSR deployment
  createSSROperatorRequest(
    applicationRequest: CreateApplicationDto,
    propertyIdentifier: string,
    identifier: string,
    env: string,
    applicationDetails: Application,
    namespace?: string
  ): SSRDeploymentRequest {
    const ssrRequest = new SSRDeploymentRequest();
    ssrRequest.imageUrl = applicationDetails.imageUrl;
    ssrRequest.app = identifier;
    ssrRequest.contextPath = applicationDetails.path;
    ssrRequest.website = propertyIdentifier;
    ssrRequest.nameSpace = namespace;
    ssrRequest.environment = env;
    ssrRequest.configMap = applicationDetails.config;
    ssrRequest.healthCheckPath = applicationDetails.healthCheckPath;
    ssrRequest.port = applicationDetails.port || 3000;
    return ssrRequest;
  }

  // @internal Create the Deployment Request to the Operator for the SSR-Git deployment
  createSSREnabledGitOperatorRequest(
    applicationRequest: CreateApplicationDto,
    propertyIdentifier: string,
    identifier: string,
    env: string,
    namespace: string,
    applicationDetails: Application
  ): SSREnabledGitDeploymentRequest {
    const deploymentDetails = this.createSSROperatorRequest(applicationRequest, propertyIdentifier, identifier, env, applicationDetails);
    const ssrEnabledGitDeploymentRequest = new SSREnabledGitDeploymentRequest();
    ssrEnabledGitDeploymentRequest.namespace = namespace;
    ssrEnabledGitDeploymentRequest.deploymentDetails = deploymentDetails;
    ssrEnabledGitDeploymentRequest.repoUrl = applicationRequest.repoUrl;
    ssrEnabledGitDeploymentRequest.gitRef = applicationRequest.gitRef;
    ssrEnabledGitDeploymentRequest.contextDir = applicationRequest.contextDir;
    ssrEnabledGitDeploymentRequest.buildArgs = applicationRequest.buildArgs;
    return ssrEnabledGitDeploymentRequest;
  }

  // @internal Increment the version of a specific application
  incrementVersion(version: number): number {
    return version ? version + 1 : 1;
  }

  // @internal It'll create the object request for SSR configuration
  createSSROperatorConfigRequest(configRequest: ApplicationConfigDTO, namespace: string): SSRDeploymentRequest {
    const ssrRequest = new SSRDeploymentRequest();
    ssrRequest.app = configRequest.identifier;
    ssrRequest.website = configRequest.propertyIdentifier;
    ssrRequest.nameSpace = namespace;
    ssrRequest.environment = configRequest.env;
    ssrRequest.configMap = configRequest.config;
    return ssrRequest;
  }

  // @internal Process the Deployment time for the analytics
  processDeploymentTime(application: Application, consumedTime: string): EventTimeTrace {
    const eventTimeTrace = new EventTimeTrace();
    eventTimeTrace.traceId = 'SSR';
    eventTimeTrace.propertyIdentifier = application.propertyIdentifier;
    eventTimeTrace.env = application.env;
    eventTimeTrace.applicationIdentifier = application.identifier;
    eventTimeTrace.consumedTime = consumedTime;
    return eventTimeTrace;
  }

  // @internal It'll check that image exists on the source or not
  async validateImageSource(imageUrl: string) {
    const hasProtocol = imageUrl.includes('https') || imageUrl.includes('http');
    if (!hasProtocol) imageUrl = `https://${imageUrl}`;
    try {
      const response = await this.httpService.axiosRef.head(imageUrl);
      if (response.status === 200) return true;
    } catch (error) {
      this.logger.error('ImageRegistry', error);
    }
    return false;
  }

  // @internal It'll check that the repository exists or not
  async validateGitProps(repoUrl: string, gitRef: string, contextDir: string) {
    const gitUrl = this.generateGitUrl(repoUrl, gitRef, contextDir);
    if (gitUrl.startsWith('https://gitlab')) {
      try {
        const response = await this.httpService.axiosRef.get(gitUrl);
        // @internal for the valid repository Gitlab sends the list of valid urls
        const regex = /\bhttps?:\/\/[^\s,"}]+\b/g;
        const gitlabSource = response.data.match(regex).includes(gitUrl.replace(/\/$/, ''));
        if (gitlabSource && response.status === 200) return true;
      } catch (error) {
        this.logger.error('GitlabSource', error);
      }
    } else {
      try {
        const githubSource = await this.httpService.axiosRef.head(gitUrl);
        if (githubSource.status === 200) return true;
      } catch (error) {
        this.logger.error('GithubSource', error);
      }
    }
    return false;
  }

  // @internal It'll generate the url for github and gitlab
  private generateGitUrl(repoUrl: string, gitRef: string, contextDir: string) {
    let gitUrl;
    repoUrl = this.getRepoUrl(repoUrl);
    contextDir = this.getPath(contextDir);
    if (repoUrl.startsWith('https://github.com')) gitUrl = `${repoUrl}/tree/${gitRef}${contextDir}`;
    if (repoUrl.startsWith('https://gitlab')) gitUrl = `${repoUrl}/-/tree/${gitRef}${contextDir}`;
    return gitUrl;
  }

  private getSSRAccessUrl(application: Application, baseUrl: string): string {
    const protocol = 'https';
    const { hostname } = new URL(baseUrl);
    const domain = hostname.split('.').slice(1).join('.');
    const generatedAccessURL = `${protocol}://${application.propertyIdentifier}-${application.env}.${domain}${application.path}`;
    return generatedAccessURL;
  }

  // @internal get the existing applications with the same path for a specific property
  getExistingApplicationsByPath(applications: Application[], identifier: string): string {
    const filteredApplications = applications.filter((i) => i.identifier !== identifier);
    const existingApplications = filteredApplications.map((j) => j.name).join(', ');
    return existingApplications;
  }

  // @internal generate the SSR application identifier for
  getSSRIdentifier(identifier): string {
    return (
      encodeURIComponent(identifier)
        .toLowerCase()
        /* Replace the encoded hexadecimal code with `-` */
        .replace(ApplicationFactory.hexadecimalCode, '-')
        /* Replace any special characters with `-` */
        .replace(ApplicationFactory.specialChar1, '-')
        /* Special characters are replaced by an underscore */
        .replace(ApplicationFactory.specialChar2, '-')
        /* Remove any starting or ending `-` */
        .replace(ApplicationFactory.startEndChar, '')
        /* Removing multiple consecutive `-`s */
        .replace(ApplicationFactory.consecutiveChar, '-')
    );
  }

  // @internal generate ApplicationRequest from the Git payload
  generateGitApplicationRequest(checkGitRegistry: Application[], tmp: Environment): CreateApplicationDto {
    const applicationRequest = new CreateApplicationDto();
    const existingDeployment = checkGitRegistry.find((i) => i.env === tmp.env);
    applicationRequest.name = existingDeployment?.name || checkGitRegistry[0].name;
    applicationRequest.path = existingDeployment?.path || checkGitRegistry[0].path;
    applicationRequest.ref = existingDeployment?.ref || checkGitRegistry[0].ref;
    applicationRequest.repoUrl = existingDeployment?.repoUrl || checkGitRegistry[0].repoUrl;
    applicationRequest.gitRef = existingDeployment?.gitRef || checkGitRegistry[0].gitRef;
    applicationRequest.contextDir = existingDeployment?.contextDir || checkGitRegistry[0].contextDir;
    applicationRequest.commitId = existingDeployment?.commitId || checkGitRegistry[0].commitId;
    applicationRequest.mergeId = existingDeployment?.mergeId || checkGitRegistry[0].mergeId;
    applicationRequest.createdBy = existingDeployment?.createdBy || checkGitRegistry[0].createdBy;
    this.logger.log('ApplicationRequest', JSON.stringify(applicationRequest));
    return applicationRequest;
  }

  // @internal extract Port from the DockerFile
  async extractDockerProps(gitRequestDTO: GitValidationRequestDTO) {
    const gitUrl = this.generateGitUrl(gitRequestDTO.repoUrl, gitRequestDTO.gitRef, gitRequestDTO.contextDir);
    const rawDockerFile = `${gitUrl.replace('/tree/', '/raw/')}/Dockerfile`;
    this.logger.log('DockerFileUrl', rawDockerFile);
    const gitResponse = new GitValidateResponse();
    let response;
    let port;
    try {
      response = await this.httpService.axiosRef.get(`${rawDockerFile}`);
    } catch (err) {
      this.logger.error('SSROperatorDeployment', err);
      gitResponse.warning = 'No DockerFile found in this Repository';
      return gitResponse;
    }
    const regex = /^EXPOSE\s+([\d\s]+)$/im;
    const checkDocker = response.data.match(regex);
    if (checkDocker) {
      const ports = checkDocker[1].trim().split(/\s+/);
      port = ports.map((tmp) => parseInt(tmp, 10));
      port = port.filter((tmp) => tmp !== 8443);
      if (port.length === 0) {
        gitResponse.warning = 'No Port found in this DockerFile';
        return gitResponse;
      }
    }
    [gitResponse.port] = port;
    return gitResponse;
  }
}
