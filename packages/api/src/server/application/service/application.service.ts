import { Injectable } from '@nestjs/common';
import * as decompress from 'decompress';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { DIRECTORY_CONFIGURATION, EPHEMERAL_ENV, JOB, SSR_DETAILS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { AgendaService } from 'src/server/agenda/agenda.service';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { Application } from 'src/server/application/application.entity';
import { Cluster } from 'src/server/environment/environment.entity';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { Source } from 'src/server/property/property.entity';
import { ApplicationConfigDTO, ApplicationResponse, CreateApplicationDto, GitDeploymentRequestDTO, SSRDeploymentRequest } from '../application.dto';
import { ApplicationFactory } from './application.factory';

@Injectable()
export class ApplicationService {
  private static readonly defaultSkip: number = 0;

  private static readonly defaultLimit: number = 500;

  constructor(
    private readonly dataServices: IDataServices,
    private readonly logger: LoggerService,
    private readonly applicationFactory: ApplicationFactory,
    private readonly exceptionService: ExceptionsService,
    private readonly analyticsService: AnalyticsService,
    private readonly agendaService: AgendaService
  ) {}

  getAllApplications(): Promise<Application[]> {
    return this.dataServices.application.getAll();
  }

  getApplicationsByProperty(
    propertyIdentifier: string,
    identifier: string,
    env: string,
    isSSR: boolean,
    skip: number = ApplicationService.defaultSkip,
    limit: number = ApplicationService.defaultLimit
  ): Promise<Application[]> {
    let keys = { propertyIdentifier, identifier, isSSR };
    if (env) keys = { ...keys, ...{ env: { $in: env.split(',') } } };
    Object.keys(keys).forEach((key) => keys[key] === undefined && delete keys[key]);
    return this.dataServices.application.getByOptions(keys, { identifier: 1, updatedAt: -1 }, skip, limit);
  }

  /* @internal
   * Initiate the application deployment process
   * Check & process ephemeral preview enabled deployment
   * Execute deployment related Jobs (zipping, '.spaship' file creation, upload etc.)
   * Save the details related to deployment (application details & activity stream)
   * Schedule agenda jobs if deployment related to ephemeral preview
   */
  async saveApplication(
    applicationRequest: CreateApplicationDto,
    applicationPath: string,
    propertyIdentifier: string,
    env: string,
    createdBy: string
  ): Promise<ApplicationResponse> {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (!environment) this.exceptionService.badRequestException({ message: 'Invalid Property & Environment. Please check the Deployment URL.' });
    applicationRequest.path = this.applicationFactory.getPath(applicationRequest.path);
    const identifier = this.applicationFactory.getIdentifier(applicationRequest.name);
    if (this.applicationFactory.isEphemeral(applicationRequest)) {
      const actionEnabled = !!applicationRequest.actionId;
      const { actionId } = applicationRequest;
      const ephemeral = (await this.dataServices.environment.getByAny({ propertyIdentifier, actionEnabled: true, actionId, isActive: true }))[0];
      if (ephemeral) {
        env = ephemeral.env;
        this.logger.log('Ephemeral', JSON.stringify(ephemeral));
      } else {
        const tmpEph = this.applicationFactory.createEphemeralPreview(propertyIdentifier, actionEnabled, actionId, 'NA');
        await this.dataServices.environment.create(tmpEph);
        this.logger.log('NewEphemeral', JSON.stringify(tmpEph));
        env = tmpEph.env;
      }
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.ENV_CREATED,
        env,
        'NA',
        `${env} created for ${propertyIdentifier}.`,
        createdBy,
        Source.CLI,
        JSON.stringify(environment)
      );
    }
    try {
      await this.deployApplication(applicationRequest, applicationPath, propertyIdentifier, env);
    } catch (err) {
      this.exceptionService.internalServerErrorException(err.message);
    }
    const applicationDetails = (await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isSSR: false, isGit: false }))[0];
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === environment.cluster);
    const deploymentConnection = (await this.dataServices.deploymentConnection.getByAny({ name: deploymentRecord.name }))[0];
    const searchedApplicationsByPath = await this.dataServices.application.getByOptions(
      {
        propertyIdentifier,
        env,
        path: applicationRequest.path,
        isSSR: false,
        isGit: false
      },
      { updatedAt: -1 },
      ApplicationService.defaultSkip,
      ApplicationService.defaultLimit
    );
    const applicationExists = this.applicationFactory.getExistingApplicationsByPath(searchedApplicationsByPath, identifier);

    await this.analyticsService.createActivityStream(
      propertyIdentifier,
      Action.APPLICATION_DEPLOYMENT_STARTED,
      env,
      identifier,
      `Deployment started for ${applicationRequest.name} at ${env}`,
      createdBy,
      Source.CLI,
      JSON.stringify(applicationRequest)
    );
    if (this.applicationFactory.isEphemeral(applicationRequest)) {
      const expiresIn = Number(EPHEMERAL_ENV.expiresIn);
      const scheduledDate = new Date();
      scheduledDate.setSeconds(scheduledDate.getSeconds() + expiresIn);
      const agendaResponse = await this.agendaService.agenda.schedule(scheduledDate, JOB.DELETE_EPH_ENV, {
        propertyIdentifier,
        env
      });
      this.logger.log('Agenda', JSON.stringify(agendaResponse));
    }
    if (!applicationDetails) {
      const saveApplication = await this.applicationFactory.createApplicationRequest(
        propertyIdentifier,
        applicationRequest,
        identifier,
        env,
        createdBy
      );
      this.logger.log('NewApplicationDetails', JSON.stringify(saveApplication));
      this.dataServices.application.create(saveApplication);
      return this.applicationFactory.createApplicationResponse(saveApplication, deploymentConnection.baseurl, applicationExists);
    }
    applicationDetails.nextRef = this.applicationFactory.getNextRef(applicationRequest.ref) || 'NA';
    applicationDetails.version = this.applicationFactory.incrementVersion(applicationDetails.version);
    applicationDetails.name = applicationRequest.name;
    applicationDetails.updatedBy = createdBy;
    this.logger.log('UpdatedApplicationDetails', JSON.stringify(applicationDetails));
    await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isSSR: false, isGit: false }, applicationDetails);
    return this.applicationFactory.createApplicationResponse(applicationDetails, deploymentConnection.baseurl, applicationExists);
  }

  /* @internal
   * Check the property & environment is valid or not
   * Find the mapped deployment connection for the particular cluster
   * Extract & process the uploaded distribution file, add spaship config (.spaship)
   * Zip the folder and upload it to the deployment engine
   */
  async deployApplication(applicationRequest: CreateApplicationDto, applicationPath: string, propertyIdentifier: string, env: string): Promise<any> {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    const identifier = this.applicationFactory.getIdentifier(applicationRequest.name);
    if (!environment) this.exceptionService.badRequestException({ message: 'Invalid Property & Environment. Please check the Deployment URL.' });
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    this.logger.log('Property', JSON.stringify(property));
    const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === environment.cluster);
    const deploymentConnection = (await this.dataServices.deploymentConnection.getByAny({ name: deploymentRecord.name }))[0];
    this.logger.log('DeploymentConnection', JSON.stringify(deploymentConnection));
    const { ref } = applicationRequest;
    const appPath = applicationRequest.path;
    this.logger.log('ApplicationRequest', JSON.stringify(applicationRequest));
    const { baseDir } = DIRECTORY_CONFIGURATION;
    const tmpDir = `${baseDir}/${identifier.split('.')[0]}-${Date.now()}-extracted`;
    await fs.mkdirSync(`${tmpDir}`, { recursive: true });
    await decompress(path.resolve(applicationPath), path.resolve(tmpDir));
    const zipPath = await this.applicationFactory.createTemplateAndZip(appPath, ref, identifier, tmpDir, propertyIdentifier, env, property.namespace);
    const formData: any = new FormData();
    try {
      const fileStream = await fs.createReadStream(zipPath);
      formData.append('spa', fileStream);
      formData.append('description', `${propertyIdentifier}_${env}`);
      formData.append('website', propertyIdentifier);
      const response = await this.applicationFactory.deploymentRequest(formData, deploymentConnection.baseurl);
      this.logger.log('OperatorResponse', JSON.stringify(response.data));
      return response;
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return applicationRequest;
  }

  /* @internal
   * Create the request object for the SSR
   * Check that application exists or not
   * If not exists then create a new record for the application
   * Else update the existing application
   * Start the SSR deployment in the operator
   * Send the acknowledgement to the user and wait for the final response
   */
  async saveSSRApplication(applicationRequest: CreateApplicationDto, propertyIdentifier: string, env: string): Promise<any> {
    const identifier = this.applicationFactory.getSSRIdentifier(applicationRequest.name);
    const { property, deploymentConnection } = await this.getDeploymentConnection(propertyIdentifier, env);
    applicationRequest.path = this.applicationFactory.getPath(applicationRequest.path);
    if (applicationRequest?.healthCheckPath) applicationRequest.healthCheckPath = this.applicationFactory.getPath(applicationRequest.healthCheckPath);
    let applicationDetails = (await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isSSR: true, isGit: false }))[0];
    const searchedApplicationsByPath = await this.dataServices.application.getByAny({
      propertyIdentifier,
      env,
      path: applicationRequest.path,
      isSSR: true,
      isGit: false
    });
    const applicationExists = this.applicationFactory.getExistingApplicationsByPath(searchedApplicationsByPath, identifier);
    if (!applicationDetails) {
      const saveApplication = await this.applicationFactory.createSSRApplicationRequest(
        propertyIdentifier,
        applicationRequest,
        identifier,
        env,
        applicationRequest.createdBy
      );
      this.logger.log('SSRApplicationDetails', JSON.stringify(saveApplication));
      applicationDetails = await this.dataServices.application.create(saveApplication);
    } else {
      applicationDetails.nextRef = this.applicationFactory.getNextRef(applicationRequest.ref) || 'NA';
      applicationDetails.name = applicationRequest.name;
      applicationDetails.path = applicationRequest.path;
      applicationDetails.imageUrl = applicationRequest.imageUrl;
      applicationDetails.version = this.applicationFactory.incrementVersion(applicationDetails.version);
      applicationDetails.healthCheckPath = applicationRequest.healthCheckPath || applicationDetails.healthCheckPath;
      applicationDetails.config = applicationRequest.config || applicationDetails.config;
      applicationDetails.port = applicationRequest.port || applicationDetails.port || SSR_DETAILS.port;
      applicationDetails.updatedBy = applicationRequest.createdBy;
      this.logger.log('SSRUpdatedApplicationDetails', JSON.stringify(applicationDetails));
      await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isSSR: true, isGit: false }, applicationDetails);
    }
    const ssrOperatorRequest = this.applicationFactory.createSSROperatorRequest(
      applicationRequest,
      propertyIdentifier,
      identifier,
      env,
      applicationDetails,
      property.namespace
    );
    this.logger.log('SSROperatorRequest', JSON.stringify(ssrOperatorRequest));
    this.deploySSRApplication(ssrOperatorRequest, propertyIdentifier, env, identifier, deploymentConnection.baseurl, applicationRequest.createdBy);
    await this.analyticsService.createActivityStream(
      propertyIdentifier,
      Action.APPLICATION_DEPLOYMENT_STARTED,
      env,
      identifier,
      `Deployment started for ${applicationRequest.name} at ${env} [SSR Enabled]`,
      applicationRequest.createdBy,
      Source.MANAGER,
      JSON.stringify(applicationRequest)
    );
    return this.applicationFactory.createApplicationResponse(applicationDetails, deploymentConnection.baseurl, applicationExists);
  }

  // @internal Get the deployment connection for the property
  private async getDeploymentConnection(propertyIdentifier: string, env: string) {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    this.logger.log('Property', JSON.stringify(property));
    const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === environment.cluster);
    const deploymentConnection = (await this.dataServices.deploymentConnection.getByAny({ name: deploymentRecord.name }))[0];
    this.logger.log('DeploymentConnection', JSON.stringify(deploymentConnection));
    return { property, deploymentConnection };
  }

  /* @internal
   * Start the SSR deployment in the operator
   * Receive the final acknowledgement from the operator
   * Update the particular application accordingly
   */
  async deploySSRApplication(
    ssrRequest: SSRDeploymentRequest,
    propertyIdentifier: string,
    env: string,
    identifier: string,
    baseUrl: string,
    createdBy: string
  ) {
    try {
      const response = await this.applicationFactory.ssrDeploymentRequest(ssrRequest, baseUrl);
      this.logger.log('SSRDeploymentResponse', JSON.stringify(response));
      if (!response) return;
      // @internal TODO : To be removed after the Operator Enhancement
      await this.applicationFactory.ssrConfigUpdate(ssrRequest, baseUrl);
      const applicationDetails = (
        await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isSSR: true, isGit: false })
      )[0];
      applicationDetails.accessUrl = response.accessUrl;
      applicationDetails.ref = applicationDetails.nextRef;
      await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isSSR: true, isGit: false }, applicationDetails);
      this.logger.log('UpdatedSSRApplication', JSON.stringify(applicationDetails));
      const diff = (applicationDetails.updatedAt.getTime() - new Date().getTime()) / 1000;
      const consumedTime = Math.abs(diff).toFixed(2).toString();
      this.logger.log('TimeToDeploy', `${consumedTime} seconds`);
      const eventTimeTrace = this.applicationFactory.processDeploymentTime(applicationDetails, consumedTime);
      await this.dataServices.eventTimeTrace.create(eventTimeTrace);
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.APPLICATION_DEPLOYED,
        env,
        identifier,
        `Deployment Time : ${consumedTime} seconds [Containerized]`,
        createdBy,
        `${Source.OPERATOR}-SSR`,
        JSON.stringify(response)
      );
    } catch (err) {
      this.logger.warn('SSRDeployment', err);
    }
  }

  /* @internal
   * Update the configuration for the particular application
   * Request the updated configuration to the operator
   * Update the application accordingly after the successful updating
   */
  async saveConfig(configDTO: ApplicationConfigDTO) {
    const search = {
      identifier: configDTO.identifier,
      propertyIdentifier: configDTO.propertyIdentifier,
      env: configDTO.env,
      isSSR: true,
      isGit: false
    };
    const applicationDetails = (await this.dataServices.application.getByAny(search))[0];
    if (!applicationDetails)
      this.exceptionService.badRequestException({
        message: `${configDTO.identifier} application doesn't exist for ${configDTO.propertyIdentifier}.`
      });
    const { property, deploymentConnection } = await this.getDeploymentConnection(configDTO.propertyIdentifier, configDTO.env);
    const ssrOperatorRequest = this.applicationFactory.createSSROperatorConfigRequest(configDTO, property.namespace);
    applicationDetails.config = configDTO.config;
    applicationDetails.updatedBy = configDTO.createdBy;
    await this.dataServices.application.updateOne(search, applicationDetails);
    this.applicationFactory.ssrConfigUpdate(ssrOperatorRequest, deploymentConnection.baseurl);
    await this.analyticsService.createActivityStream(
      configDTO.propertyIdentifier,
      Action.APPLICATION_CONFIG_UPDATED,
      configDTO.env,
      configDTO.identifier,
      `${applicationDetails.name} configuration updated for ${configDTO.env}`,
      configDTO.createdBy,
      Source.MANAGER,
      JSON.stringify(applicationDetails)
    );
    return applicationDetails;
  }

  /* @internal
   * Create the request object for the SSR-Git Application
   * Process the Application
   * Start the SSR-Git build and deployment in the operator
   */
  async saveGitApplication(applicationRequest: CreateApplicationDto, propertyIdentifier: string, env: string): Promise<Application> {
    const identifier = this.applicationFactory.getSSRIdentifier(applicationRequest.name);
    const { property } = await this.getDeploymentConnection(propertyIdentifier, env);
    applicationRequest.repoUrl = this.applicationFactory.getRepoUrl(applicationRequest.repoUrl);
    applicationRequest.contextDir = this.applicationFactory.getPath(applicationRequest.contextDir);
    applicationRequest.path = this.applicationFactory.getPath(applicationRequest.path);
    if (applicationRequest?.healthCheckPath) applicationRequest.healthCheckPath = this.applicationFactory.getPath(applicationRequest.healthCheckPath);
    let applicationDetails = (await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isSSR: true, isGit: true }))[0];
    if (!applicationDetails) {
      const saveApplication = await this.applicationFactory.createSSREnabledGitApplicationRequest(
        propertyIdentifier,
        applicationRequest,
        identifier,
        env,
        applicationRequest.createdBy
      );
      this.logger.log('SSRGitApplicationDetails', JSON.stringify(saveApplication));
      applicationDetails = await this.dataServices.application.create(saveApplication);
    } else {
      applicationDetails.nextRef = this.applicationFactory.getNextRef(applicationRequest.ref) || 'NA';
      applicationDetails.path = applicationRequest.path;
      applicationDetails.version = this.applicationFactory.incrementVersion(applicationDetails.version);
      applicationDetails.healthCheckPath = applicationRequest.healthCheckPath || applicationDetails.healthCheckPath;
      applicationDetails.config = applicationRequest.config || applicationDetails.config;
      applicationDetails.port = applicationRequest.port || applicationDetails.port || SSR_DETAILS.port;
      applicationDetails.repoUrl = applicationRequest.repoUrl || applicationDetails.repoUrl;
      applicationDetails.gitRef = applicationRequest.gitRef || applicationDetails.gitRef;
      applicationDetails.contextDir = applicationRequest.contextDir || applicationDetails.contextDir;
      applicationDetails.buildArgs = applicationRequest.buildArgs || applicationDetails.buildArgs;
      applicationDetails.commitId = applicationRequest.commitId || applicationDetails.commitId;
      applicationDetails.mergeId = applicationRequest.mergeId || applicationDetails.mergeId;
      applicationDetails.updatedBy = applicationRequest.createdBy;
      this.logger.log('SSRGitUpdatedApplicationDetails', JSON.stringify(applicationDetails));
      await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isSSR: true, isGit: true }, applicationDetails);
    }
    const ssrEnabledGitOperatorRequest = this.applicationFactory.createSSREnabledGitOperatorRequest(
      applicationRequest,
      propertyIdentifier,
      identifier,
      env,
      property.namespace,
      applicationDetails
    );
    this.logger.log('SSRGitOperatorRequest', JSON.stringify(ssrEnabledGitOperatorRequest));
    // @internal TODO : once it's ready in the Operator
    // await this.applicationFactory.ssrEnabledGitDeploymentRequest(ssrEnabledGitOperatorRequest, deploymentConnection.baseurl);
    await this.analyticsService.createActivityStream(
      propertyIdentifier,
      Action.APPLICATION_DEPLOYMENT_STARTED,
      env,
      identifier,
      `Deployment started for ${applicationRequest.name} at ${env} [GIT-SSR Enabled]`,
      applicationRequest.createdBy,
      Source.GIT,
      JSON.stringify(applicationRequest)
    );
    return applicationDetails;
  }

  /* @internal
   * Process and Select the Environment for Deployment
   * Create the Payload and Start the Deployment
   */
  async processGitRequest(gitRequestDTO: GitDeploymentRequestDTO) {
    gitRequestDTO.repoUrl = this.applicationFactory.getRepoUrl(gitRequestDTO.repoUrl);
    gitRequestDTO.contextDir = this.applicationFactory.getPath(gitRequestDTO.contextDir);
    const checkGitRegistry = await this.dataServices.application.getByAny({ repoUrl: gitRequestDTO.repoUrl, contextDir: gitRequestDTO.contextDir });
    if (!checkGitRegistry.length)
      this.exceptionService.badRequestException({
        message: `${gitRequestDTO.contextDir} is not registered for ${gitRequestDTO.repoUrl}. Please register your repository from the SPAship Manager.`
      });
    const { propertyIdentifier } = checkGitRegistry[0];
    let envsResponse = await this.dataServices.environment.getByAny({ propertyIdentifier, env: gitRequestDTO.envs });
    envsResponse = envsResponse.filter((i) => i.cluster !== Cluster.PROD);
    this.logger.log('RegisteredEnvs', JSON.stringify(envsResponse));
    if (!envsResponse.length) {
      envsResponse = await this.dataServices.environment.getByAny({ propertyIdentifier });
      envsResponse = envsResponse.filter((i) => i.cluster !== Cluster.PROD);
      // @internal By Default deploy in Dev (Pre-prod) Environment if no cluster mentioned
      envsResponse = [envsResponse.find((i) => i.env === 'dev')];
      this.logger.log('DefaultEnv', JSON.stringify(envsResponse));
    }
    if (!envsResponse.length) this.exceptionService.badRequestException({ message: `No Preferred environment found for the deployment` });
    try {
      for (const tmp of envsResponse) {
        const applicationRequest = this.applicationFactory.generateApplicationRequestFromGit(checkGitRegistry, tmp);
        await this.saveGitApplication(applicationRequest, tmp.propertyIdentifier, tmp.env);
      }
    } catch (e) {
      this.logger.warn('Deployment', e);
    }
    // @internal TODO: Message to be changed
    return { message: 'Deployment Completed for the requested registered envs.' };
  }

  // @internal it will check that registered property and env
  async validatePropertyAndEnvironment(propertyIdentifier: string, env: string) {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (!environment)
      this.exceptionService.badRequestException({
        message: `${env} environment doesn't exist on ${propertyIdentifier}.`
      });
  }

  // @internal it will validate the image format and the source
  async validateImageRegistry(imageUrl: string) {
    const imageRegistry = await this.applicationFactory.validateImageSource(imageUrl);
    if (!imageRegistry)
      this.exceptionService.badRequestException({
        message: `${imageUrl} doesn't exists on the source registry, please provide a valid imageUrl.`
      });
  }

  // @internal it will validate the git repository
  async validateGitProps(repoUrl: string, gitRef: string, contextDir: string) {
    const gitProps = await this.applicationFactory.validateGitProps(repoUrl, gitRef, contextDir);
    if (!gitProps)
      this.exceptionService.badRequestException({
        message: `${repoUrl} doesn't exists.`
      });
  }

  // @internal it will validate if the url and context directory is registered for any other property
  async validateExistingGitDeployment(repoUrl: string, contextDir: string, propertyIdentifier: string, identifier: string) {
    repoUrl = this.applicationFactory.getRepoUrl(repoUrl);
    contextDir = this.applicationFactory.getPath(contextDir);
    const checkGitRegistry = await this.dataServices.application.getByAny({ repoUrl, contextDir });
    const existingApplications = checkGitRegistry.filter((i) => i.propertyIdentifier !== propertyIdentifier || i.identifier !== identifier);
    if (existingApplications.length) {
      const listApplications = [];
      existingApplications.forEach((tmp) => {
        listApplications.push(`${tmp.identifier} ${tmp.env} on ${tmp.propertyIdentifier}`);
      });
      this.exceptionService.badRequestException({
        message: `${repoUrl}${contextDir} is already registered for ${listApplications}`
      });
    }
  }
}
