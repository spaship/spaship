import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { AxiosResponse } from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { EPHEMERAL_ENV, CONTAINERIZED_DEPLOYMENT_DETAILS, DEPLOYMENT_DETAILS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import {
  ApplicationConfigDTO,
  ApplicationResponse,
  CreateApplicationDto,
  GitValidateResponse,
  GitValidationRequestDTO,
  ContainerizedDeploymentRequest,
  ContainerizedDeploymentResponse,
  ContainerizedGitDeploymentRequest,
  GitDeploymentRequestDTO,
  GitApplicationStatusRequest,
  ContainerizedGitDeploymentResponse,
  GitApplicationStatusResponse
} from 'src/server/application/application.dto';
import { Application } from 'src/server/application/application.entity';
import { AuthFactory } from 'src/server/auth/auth.factory';
import { Cluster, Environment } from 'src/server/environment/environment.entity';
import { EventTimeTrace } from 'src/server/event/event-time-trace.entity';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { Source } from 'src/server/property/property.entity';
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
    saveApplication.isContainerized = false;
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
    applicationResponse.accessUrl = application.isContainerized
      ? this.getContainerizedAccessUrl(application, baseUrl)
      : this.getAccessUrl(application, baseUrl);
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
      generatedAccessURL = `${protocol}://${appPrefix}.${DEPLOYMENT_DETAILS.namespace}--${application.propertyIdentifier}.${
        application.propertyIdentifier
      }.${application.env}.${domain}${this.getGeneratedPath(application.path)}`;
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

  // @internal Generate the application identifier
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

  // @internal Max length in openshfit to deploy
  trimWebsiteVersion(version): string {
    const maxLength = 60;
    if (version.length > maxLength) return version.substr(0, maxLength);
    return version;
  }

  // @internal Generate the application identifier
  getPath(requestPath: string): string {
    const appPath = requestPath.replace(/^\/+/g, '').replace(/\/+$/, '');
    return `/${appPath}`;
  }

  // @internal Generate the repository url
  getRepoUrl(repoUrl: string): string {
    // @internal it will replace the heading & trailing slash frm the repoUrl
    return repoUrl.replace(/^\/+/g, '').replace(/\/+$/, '').replace('.git', '');
  }

  // @internal Start the Containerized deployment to the operator
  async containerizedDeploymentRequest(
    request?: ContainerizedDeploymentRequest,
    deploymentBaseURL?: string
  ): Promise<ContainerizedDeploymentResponse> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    const containerizedDeploymentResponse = new ContainerizedDeploymentResponse();
    try {
      const response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/deployment/v1/create`, request, {
        maxBodyLength: Infinity,
        headers
      });
      containerizedDeploymentResponse.accessUrl = response.data.accessUrl;
    } catch (err) {
      this.logger.error('ContainerizedDeploymentForOperator', err);
    }
    return containerizedDeploymentResponse;
  }

  // @internal Start the Containerized Git deployment to the operator
  async containerizedEnabledGitDeploymentRequest(
    request?: ContainerizedGitDeploymentRequest,
    deploymentBaseURL?: string
  ): Promise<ContainerizedGitDeploymentResponse> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    let response;
    try {
      response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/gf/v1/init`, request, {
        maxBodyLength: Infinity,
        headers
      });
    } catch (err) {
      this.logger.error('containerizedEnabledGitDeploymentForOperator', err);
    }
    return response?.data;
  }

  // @internal Get the Build Logs from the Operator
  async buildLogRequest(logRequest: GitApplicationStatusRequest, deploymentBaseURL?: string): Promise<String> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    let response;
    try {
      response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/gf/v1/build-log`, logRequest, {
        maxBodyLength: Infinity,
        headers
      });
    } catch (err) {
      this.logger.error('buildLogRequestForOperator', err);
      this.exceptionService.badRequestException({ message: `No Build log found for ${logRequest.objectName}.` });
    }
    return response.data;
  }

  // @internal Get the Deployment Logs from the Operator
  async deploymentLogRequest(logRequest: GitApplicationStatusRequest, deploymentBaseURL?: string): Promise<String> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    let response;
    try {
      response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/gf/v1/deployment-log`, logRequest, {
        maxBodyLength: Infinity,
        headers
      });
    } catch (err) {
      this.logger.error('DeploymentLogRequestForOperator', err);
      this.exceptionService.badRequestException({ message: `No Deployment log found for ${logRequest.objectName}.` });
    }
    return response?.data;
  }

  // @internal Get the Pod Logs from the Operator
  async podLogRequest(logRequest: GitApplicationStatusRequest, deploymentBaseURL?: string): Promise<String> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    let response;
    try {
      response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/gf/v1/pod-log`, logRequest, {
        maxBodyLength: Infinity,
        headers
      });
    } catch (err) {
      this.logger.error('DeploymentLogRequestForOperator', err);
      this.exceptionService.badRequestException({ message: `No Pod log found for ${logRequest.objectName}.` });
    }
    return response?.data;
  }

  // @internal Get the Build Status from the Operator
  async buildStatusRequest(logRequest: GitApplicationStatusRequest, deploymentBaseURL?: string): Promise<GitApplicationStatusResponse> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    let response;
    try {
      response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/gf/v1/build-status`, logRequest, {
        maxBodyLength: Infinity,
        headers
      });
    } catch (err) {
      this.logger.error('BuildLogRequestForOperator', err);
    }
    return response.data;
  }

  // @internal Get the Deployment Status from the Operator
  async deploymentStatusRequest(logRequest: GitApplicationStatusRequest, deploymentBaseURL?: string): Promise<GitApplicationStatusResponse> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    let response;
    try {
      response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/gf/v1/deployment-status`, logRequest, {
        maxBodyLength: Infinity,
        headers
      });
    } catch (err) {
      this.logger.error('DeploymentLogRequestForOperator', err);
    }
    return response.data;
  }

  // @internal Update the configuration for a Containerized application
  async containerizedConfigUpdate(request?: ContainerizedDeploymentRequest, deploymentBaseURL?: string) {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    this.logger.log('ContainerizedContainerizedConfigRequest', JSON.stringify(request));
    try {
      const response = await this.httpService.axiosRef.post(`${deploymentBaseURL}/api/deployment/v1/config`, request, {
        maxBodyLength: Infinity,
        headers
      });
      this.logger.log('ContainerizedDeploymentConfigResponse', JSON.stringify(response.data));
    } catch (err) {
      this.logger.error('ContainerizedDeploymentConfig', err);
    }
  }

  // @internal Get the List of the Pods from the Operator
  async getListOfPods(deploymentName: string, namespace: string, deploymentBaseURL?: string): Promise<String[]> {
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    let response;
    try {
      response = await this.httpService.axiosRef.get(
        `${deploymentBaseURL}/api/gf/v1/pods-by-deployment?deploymentName=${deploymentName}&ns=${namespace}`,
        {
          headers
        }
      );
    } catch (err) {
      this.logger.error('buildLogRequestForOperator', err);
      this.exceptionService.badRequestException({ message: `No Pods found for ${deploymentName}.` });
    }
    return response.data.data || [];
  }

  // @internal Create the Application request for the Containerized deployment
  createContainerizedApplicationRequest(
    propertyIdentifier: string,
    applicationRequest: CreateApplicationDto,
    identifier: string,
    env: string,
    createdBy: string
  ): Application {
    const containerizedApplicationRequest = this.createApplicationRequest(propertyIdentifier, applicationRequest, identifier, env, createdBy);
    containerizedApplicationRequest.isContainerized = true;
    containerizedApplicationRequest.imageUrl = applicationRequest.imageUrl;
    containerizedApplicationRequest.healthCheckPath = applicationRequest.healthCheckPath || applicationRequest.path;
    containerizedApplicationRequest.config = applicationRequest.config;
    containerizedApplicationRequest.port = applicationRequest.port || CONTAINERIZED_DEPLOYMENT_DETAILS.port;
    return containerizedApplicationRequest;
  }

  // @internal Create the Application request for the Containerized  Git deployment
  createContainerizedGitApplicationRequest(
    propertyIdentifier: string,
    applicationRequest: CreateApplicationDto,
    identifier: string,
    env: string,
    createdBy: string
  ): Application {
    const containerizedEnabledGitApplicationRequest = this.createContainerizedApplicationRequest(
      propertyIdentifier,
      applicationRequest,
      identifier,
      env,
      createdBy
    );
    containerizedEnabledGitApplicationRequest.isGit = true;
    containerizedEnabledGitApplicationRequest.repoUrl = applicationRequest.repoUrl;
    containerizedEnabledGitApplicationRequest.gitRef = applicationRequest.gitRef;
    containerizedEnabledGitApplicationRequest.contextDir = applicationRequest.contextDir;
    containerizedEnabledGitApplicationRequest.buildArgs = applicationRequest.buildArgs;
    containerizedEnabledGitApplicationRequest.dockerFileName = applicationRequest.dockerFileName || 'Dockerfile';
    containerizedEnabledGitApplicationRequest.commitId = applicationRequest.commitId || 'NA';
    containerizedEnabledGitApplicationRequest.mergeId = applicationRequest.mergeId || 'NA';
    return containerizedEnabledGitApplicationRequest;
  }

  // @internal Create the Deployment Request to the Operator for the Containerized deployment
  createContainerizedDeploymentRequestForOperator(
    propertyIdentifier: string,
    identifier: string,
    env: string,
    applicationDetails: Application,
    namespace?: string
  ): ContainerizedDeploymentRequest {
    const containerizedRequest = new ContainerizedDeploymentRequest();
    containerizedRequest.imageUrl = applicationDetails.imageUrl;
    containerizedRequest.app = identifier;
    containerizedRequest.contextPath = applicationDetails.path;
    containerizedRequest.website = propertyIdentifier;
    containerizedRequest.nameSpace = namespace;
    containerizedRequest.environment = env;
    containerizedRequest.configMap = applicationDetails.config;
    containerizedRequest.healthCheckPath = applicationDetails.healthCheckPath;
    containerizedRequest.port = applicationDetails.port || 3000;
    return containerizedRequest;
  }

  // @internal Create the Deployment Request to the Operator for the isContainerized-Git deployment
  createContainerizedGitOperatorRequest(
    applicationRequest: CreateApplicationDto,
    propertyIdentifier: string,
    identifier: string,
    env: string,
    namespace: string,
    applicationDetails: Application
  ): ContainerizedGitDeploymentRequest {
    const deploymentDetails = this.createContainerizedDeploymentRequestForOperator(propertyIdentifier, identifier, env, applicationDetails);
    const containerizedEnabledGitDeploymentRequest = new ContainerizedGitDeploymentRequest();
    containerizedEnabledGitDeploymentRequest.nameSpace = namespace;
    containerizedEnabledGitDeploymentRequest.deploymentDetails = deploymentDetails;
    containerizedEnabledGitDeploymentRequest.repoUrl = this.configureGitSuffix(applicationRequest.repoUrl);
    containerizedEnabledGitDeploymentRequest.gitRef = applicationRequest.gitRef;
    containerizedEnabledGitDeploymentRequest.contextDir = applicationRequest.contextDir;
    containerizedEnabledGitDeploymentRequest.buildArgs = applicationRequest.buildArgs || [];
    containerizedEnabledGitDeploymentRequest.reDeployment = applicationRequest.reDeployment || false;
    return containerizedEnabledGitDeploymentRequest;
  }

  // @internal append .git to the repo url suffix
  private configureGitSuffix(repoUrl: string): string {
    if (!repoUrl.endsWith('.git')) return `${repoUrl}.git`;
    return repoUrl;
  }

  // @internal Increment the version of a specific application
  incrementVersion(version: number): number {
    return version ? version + 1 : 1;
  }

  // @internal It'll create the object request for Containerized Deployment configuration
  createContainerizedOperatorConfigRequest(configRequest: ApplicationConfigDTO, namespace: string): ContainerizedDeploymentRequest {
    const containerizedRequest = new ContainerizedDeploymentRequest();
    containerizedRequest.app = configRequest.identifier;
    containerizedRequest.website = configRequest.propertyIdentifier;
    containerizedRequest.nameSpace = namespace;
    containerizedRequest.environment = configRequest.env;
    containerizedRequest.configMap = configRequest.config;
    return containerizedRequest;
  }

  // @internal Process the Deployment time for the analytics
  processDeploymentTime(application: Application, consumedTime: string): EventTimeTrace {
    const eventTimeTrace = new EventTimeTrace();
    eventTimeTrace.traceId = 'Containerized';
    eventTimeTrace.propertyIdentifier = application.propertyIdentifier;
    eventTimeTrace.env = application.env;
    eventTimeTrace.applicationIdentifier = application.identifier;
    eventTimeTrace.consumedTime = consumedTime;
    return eventTimeTrace;
  }

  // @internal Create the deployment / build log request
  createLogRequest(propertyIdentifier: string, env: string, identifier: string, namespace: string, lines?: string): GitApplicationStatusRequest {
    const logRequest = new GitApplicationStatusRequest();
    logRequest.objectName = `${propertyIdentifier}-${identifier}-${env}`;
    logRequest.ns = namespace;
    logRequest.upto = lines || '100';
    return logRequest;
  }

  // @internal It'll check that image exists on the source or not
  async validateImageSource(imageUrl: string): Promise<Boolean> {
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
  async validateGitProps(repoUrl: string, gitRef: string, contextDir: string): Promise<Boolean> {
    const gitUrl = this.generateRepoUrl(repoUrl, gitRef, contextDir);
    if (gitUrl.startsWith(Source.GITLAB)) {
      try {
        const response = await this.httpService.axiosRef.get(gitUrl);
        // @internal It'll validate & extract the urls from the gitlab gitResponse
        // TODO : To be improvised further
        const validUrlPattern = /\bhttps?:\/\/[^\s,"}]+\b/g;
        const removeTrailingSlashPattern = /\/$/;
        const gitlabSource = response.data.match(validUrlPattern).includes(gitUrl.replace(removeTrailingSlashPattern, ''));
        if (gitlabSource && response.status === 200) return true;
      } catch (error) {
        this.logger.error('GitlabSource', error);
      }
    } else if (await this.checkUrlSource(gitUrl)) return true;
    return false;
  }

  // @internal It'll generate the url for github and gitlab
  private generateRepoUrl(repoUrl: string, gitRef: string, contextDir: string): string {
    let gitUrl;
    repoUrl = this.getRepoUrl(repoUrl);
    contextDir = this.getPath(contextDir);
    if (repoUrl.startsWith(Source.GITHUB)) gitUrl = `${repoUrl}/tree/${gitRef}${contextDir}`;
    if (repoUrl.startsWith(Source.GITLAB)) gitUrl = `${repoUrl}/-/tree/${gitRef}${contextDir}`;
    return gitUrl;
  }

  private getContainerizedAccessUrl(application: Application, baseUrl: string): string {
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

  // @internal generate the Containerized application identifier for
  getContainerizedApplicationIdentifier(identifier): string {
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

  // @internal Generate ApplicationRequest from the GitRequest
  generateApplicationRequestFromGit(checkGitRegistry: Application[], tmp: Environment, gitRequestDTO: GitDeploymentRequestDTO): CreateApplicationDto {
    const applicationRequest = new CreateApplicationDto();
    const existingDeployment = checkGitRegistry.find((i) => i.env === tmp.env);
    applicationRequest.name = existingDeployment?.name || checkGitRegistry[0].name;
    applicationRequest.path = existingDeployment?.path || checkGitRegistry[0].path;
    applicationRequest.ref = existingDeployment?.ref || checkGitRegistry[0].ref;
    applicationRequest.repoUrl = existingDeployment?.repoUrl || checkGitRegistry[0].repoUrl;
    applicationRequest.gitRef = existingDeployment?.gitRef || checkGitRegistry[0].gitRef;
    applicationRequest.contextDir = existingDeployment?.contextDir || checkGitRegistry[0].contextDir;
    applicationRequest.commitId = gitRequestDTO?.commitId || checkGitRegistry[0].commitId;
    applicationRequest.mergeId = gitRequestDTO?.mergeId || checkGitRegistry[0].mergeId;
    applicationRequest.createdBy = existingDeployment?.createdBy || checkGitRegistry[0].createdBy;
    this.logger.log('ApplicationRequest', JSON.stringify(applicationRequest));
    return applicationRequest;
  }

  // @internal extract Port from the DockerFile
  async extractDockerProps(gitRequestDTO: GitValidationRequestDTO): Promise<GitValidateResponse> {
    const gitUrl = this.generateRepoUrl(gitRequestDTO.repoUrl, gitRequestDTO.gitRef, gitRequestDTO.contextDir);
    const rawDockerFile = `${gitUrl.replace('/tree/', '/raw/')}/${gitRequestDTO.dockerFileName || 'Dockerfile'}`;
    this.logger.log('DockerFileUrl', rawDockerFile);
    const gitResponse = new GitValidateResponse();
    let response;
    let port;
    try {
      response = await this.httpService.axiosRef.get(`${rawDockerFile}`);
    } catch (err) {
      this.logger.error('DockerError', err);
      gitResponse.warning = 'No DockerFile found in this Repository';
      return gitResponse;
    }
    const regex = /^EXPOSE\s+([\d\s]+)$/im;
    const checkDocker = response.data.match(regex);
    if (checkDocker) {
      const ports = checkDocker[1].trim().split(/\s+/);
      port = ports.map((tmp) => parseInt(tmp, 10));
      port = port.filter((tmp) => tmp !== 8443);
      [gitResponse.port] = port;
    }
    if (!checkDocker || port?.length === 0) {
      gitResponse.warning = 'No Port found in this DockerFile';
      return gitResponse;
    }
    return gitResponse;
  }

  // @internal Check the source for a particular url
  async checkUrlSource(url: string) {
    try {
      const response = await this.httpService.axiosRef.head(url);
      if (response.status === 200) return true;
    } catch (error) {
      this.logger.error('Source', error);
    }
    return false;
  }

  // @internal Compare the application and application details changes
  async compareApplicationConfiguration(applicationDetails: Application, applicationRequest: CreateApplicationDto): Promise<Boolean> {
    if (
      applicationDetails.ref === applicationRequest.ref &&
      applicationDetails.path === applicationRequest.path &&
      applicationDetails.port === applicationRequest.port &&
      applicationDetails.gitRef === applicationRequest.gitRef &&
      applicationDetails.repoUrl === applicationRequest.repoUrl &&
      applicationDetails.contextDir === applicationRequest.contextDir &&
      applicationDetails.dockerFileName === applicationRequest.dockerFileName &&
      applicationDetails.healthCheckPath === applicationRequest.healthCheckPath &&
      JSON.stringify(applicationDetails.buildArgs) === JSON.stringify(applicationRequest.buildArgs)
    ) {
      this.logger.log(
        'ApplicationCheck',
        `No Changes found in the Existing Application details for ${applicationDetails.identifier}-${applicationDetails.env}`
      );
      if (JSON.stringify(applicationDetails.config) !== JSON.stringify(applicationRequest.config)) {
        this.logger.log(
          'ConfigurationCheck',
          `Changes found in Application Configuration for ${applicationDetails.identifier}-${applicationDetails.env}`
        );
        return true;
      }
      this.logger.log(
        'ConfigurationCheck',
        `No Changes found in Application Configuration for ${applicationDetails.identifier}-${applicationDetails.env}`
      );
      return false;
    }
    this.logger.log(
      'ApplicationCheck',
      `Changes found in the Existing Application details for ${applicationDetails.identifier}-${applicationDetails.env}`
    );
    return false;
  }
}
