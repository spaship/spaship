import { Injectable } from '@nestjs/common';
import { isURL } from 'class-validator';
import * as decompress from 'decompress';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { CONTAINERIZED_DEPLOYMENT_DETAILS, DEPLOYMENT_DETAILS, DIRECTORY_CONFIGURATION, JOB, LOGTYPE, STATUS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { AgendaService } from 'src/server/agenda/agenda.service';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { Application } from 'src/server/application/application.entity';
import { DeploymentConnection } from 'src/server/deployment-connection/deployment-connection.entity';
import { Cluster } from 'src/server/environment/environment.entity';
import { EnvironmentFactory } from 'src/server/environment/service/environment.factory';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { Property, Source } from 'src/server/property/property.entity';
import {
  ApplicationConfigDTO,
  ApplicationResponse,
  ContainerizedDeploymentRequest,
  CreateApplicationDto,
  DeleteApplicationSyncDTO,
  EnableApplicationSyncDTO,
  GitApplicationStatusRequest,
  GitDeploymentRequestDTO
} from '../application.dto';
import { ApplicationFactory } from './application.factory';

@Injectable()
export class ApplicationService {
  private static readonly defaultSkip: number = 0;

  private static readonly defaultLimit: number = 500;

  private readonly period: number = 15000;

  private readonly timeout: number = 1200000;

  private readonly applicationTimeout: number = 180000;

  constructor(
    private readonly dataServices: IDataServices,
    private readonly logger: LoggerService,
    private readonly applicationFactory: ApplicationFactory,
    private readonly environmentFactory: EnvironmentFactory,
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
    isContainerized: boolean,
    isGit: boolean,
    skip: number = ApplicationService.defaultSkip,
    limit: number = ApplicationService.defaultLimit
  ): Promise<Application[]> {
    let keys = { propertyIdentifier, identifier, isContainerized, isGit };
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
    env = await this.createEphemeralEnvironment(applicationRequest, propertyIdentifier, env, createdBy);
    const applicationDetails = (
      await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isContainerized: false, isGit: false })
    )[0];
    try {
      await this.deployApplication(
        applicationRequest,
        applicationPath,
        propertyIdentifier,
        env,
        this.applicationFactory.incrementVersion(applicationDetails?.version),
        applicationDetails?.autoSync
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err.message);
    }
    const { property, deploymentConnection } = await this.getDeploymentConnection(propertyIdentifier, env);
    const searchedApplicationsByPath = await this.dataServices.application.getByOptions(
      {
        propertyIdentifier,
        env,
        path: applicationRequest.path,
        isContainerized: false,
        isGit: false
      },
      { updatedAt: -1 },
      ApplicationService.defaultSkip,
      ApplicationService.defaultLimit
    );
    const applicationExists = this.applicationFactory.getExistingApplicationsByPath(searchedApplicationsByPath, identifier);
    await this.analyticsService.createActivityStream(
      property.identifier,
      Action.APPLICATION_DEPLOYMENT_STARTED,
      env,
      identifier,
      `Deployment started for ${applicationRequest.name} at ${env}`,
      createdBy,
      Source.CLI,
      JSON.stringify(applicationRequest)
    );
    if (!applicationDetails) {
      const saveApplication = await this.applicationFactory.createApplicationRequest(
        propertyIdentifier,
        applicationRequest,
        identifier,
        env,
        deploymentConnection,
        false,
        createdBy
      );
      this.logger.log('NewApplicationDetails', JSON.stringify(saveApplication));
      this.dataServices.application.create(saveApplication);
      return this.applicationFactory.createApplicationResponse(saveApplication, applicationExists);
    }
    applicationDetails.nextRef = this.applicationFactory.getNextRef(applicationRequest.ref) || 'NA';
    applicationDetails.version = this.applicationFactory.incrementVersion(applicationDetails.version);
    applicationDetails.name = applicationRequest.name;
    applicationDetails.path = applicationRequest.path;
    applicationDetails.accessUrl = this.applicationFactory.getAccessUrl(deploymentConnection, applicationRequest, propertyIdentifier, env, false);
    applicationDetails.routerUrl = this.applicationFactory.getRouterUrl(deploymentConnection, applicationRequest, propertyIdentifier, env);
    applicationDetails.updatedBy = createdBy;
    this.logger.log('UpdatedApplicationDetails', JSON.stringify(applicationDetails));
    await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isContainerized: false, isGit: false }, applicationDetails);
    return this.applicationFactory.createApplicationResponse(applicationDetails, applicationExists);
  }

  private async createEphemeralEnvironment(applicationRequest: CreateApplicationDto, propertyIdentifier: string, env: string, createdBy: string) {
    if (this.applicationFactory.isEphemeral(applicationRequest)) {
      const actionEnabled = !!applicationRequest.actionId;
      const { actionId } = applicationRequest;
      const ephemeral = (await this.dataServices.environment.getByAny({ propertyIdentifier, actionEnabled: true, actionId, isActive: true }))[0];
      if (ephemeral) {
        env = ephemeral.env;
        this.logger.log('Ephemeral', JSON.stringify(ephemeral));
      } else {
        const tmpEph = this.applicationFactory.createEphemeralPreview(
          propertyIdentifier,
          actionEnabled,
          actionId,
          'NA',
          applicationRequest.expiresIn
        );
        await this.checkDeploymentRecord(propertyIdentifier, Cluster.PREPROD);
        await this.dataServices.environment.create(tmpEph);
        this.logger.log('NewEphemeral', JSON.stringify(tmpEph));
        env = tmpEph.env;
        const expiresIn = this.applicationFactory.getExpiresIn(applicationRequest.expiresIn);
        const scheduledDate = new Date();
        scheduledDate.setSeconds(scheduledDate.getSeconds() + Number(expiresIn));
        const agendaResponse = await this.agendaService.agenda.schedule(scheduledDate, JOB.DELETE_EPH_ENV, {
          propertyIdentifier,
          env
        });
        this.logger.log('Agenda', JSON.stringify(agendaResponse));
      }
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.ENV_CREATED,
        env,
        'NA',
        `${env} created for ${propertyIdentifier}.`,
        createdBy,
        Source.CLI,
        JSON.stringify(applicationRequest)
      );
    }
    return env;
  }

  /* @internal
   * Check the property & environment is valid or not
   * Find the mapped deployment connection for the particular cluster
   * Extract & process the uploaded distribution file, add spaship config (.spaship)
   * Zip the folder and upload it to the deployment engine
   */
  async deployApplication(
    applicationRequest: CreateApplicationDto,
    applicationPath: string,
    propertyIdentifier: string,
    env: string,
    version: number = 1,
    autoSync: boolean = false
  ): Promise<any> {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    const identifier = this.applicationFactory.getIdentifier(applicationRequest.name);
    if (!environment) this.exceptionService.badRequestException({ message: 'Invalid Property & Environment. Please check the Deployment URL.' });
    const { property, deploymentConnection } = await this.getDeploymentConnection(propertyIdentifier, env);
    this.logger.log('Environment', JSON.stringify(environment));
    this.logger.log('Property', JSON.stringify(property));
    this.logger.log('DeploymentConnection', JSON.stringify(deploymentConnection));
    const appPath = applicationRequest.path;
    this.logger.log('ApplicationRequest', JSON.stringify(applicationRequest));
    const { baseDir } = DIRECTORY_CONFIGURATION;
    const tmpDir = `${baseDir}/${identifier.split('.')[0]}-${Date.now()}-extracted`;
    await fs.mkdirSync(`${tmpDir}`, { recursive: true });
    await decompress(path.resolve(applicationPath), path.resolve(tmpDir));
    const zipPath = await this.applicationFactory.createTemplateAndZip(
      appPath,
      `${version}`,
      identifier,
      tmpDir,
      propertyIdentifier,
      env,
      property.namespace,
      property.cmdbCode
    );
    try {
      for (const con of deploymentConnection) {
        const formData: any = new FormData();
        const fileStream = await fs.createReadStream(zipPath);
        formData.append('spa', fileStream);
        formData.append('description', `${propertyIdentifier}_${env}`);
        formData.append('website', propertyIdentifier);
        const response = await this.applicationFactory.deploymentRequest(formData, con.baseurl);
        this.logger.log('OperatorResponse', JSON.stringify(response.data));
        if (autoSync && environment.sync !== 'NA') {
          const operatorPayload = JSON.parse(environment.sync);
          this.logger.log('OperatorPayload', JSON.stringify(operatorPayload));
          this.triggerSync(operatorPayload, con.baseurl, propertyIdentifier, env, property, applicationRequest);
        }
      }
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return applicationRequest;
  }

  // @internal it will trigger the sync for the specific application
  private async triggerSync(
    operatorPayload: Object,
    baseurl: string,
    propertyIdentifier: string,
    env: string,
    property: Property,
    applicationRequest: CreateApplicationDto
  ) {
    try {
      const syncResponse = await this.environmentFactory.syncRequest(operatorPayload, baseurl, propertyIdentifier, env, property.namespace);
      this.logger.log('SyncOperatorResponse', JSON.stringify(syncResponse.data));
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.ENV_SYNCED,
        env,
        'NA',
        `${env} synced for ${propertyIdentifier}`,
        applicationRequest.createdBy,
        Source.MANAGER,
        JSON.stringify(applicationRequest)
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err.message);
    }
  }

  /* @internal
   * Create the request object for the Containerized
   * Check that application exists or not
   * If not exists then create a new record for the application
   * Else update the existing application
   * Start the Containerized deployment in the operator
   * Send the acknowledgement to the user and wait for the final response
   */
  async saveContainerizedApplication(
    applicationRequest: CreateApplicationDto,
    propertyIdentifier: string,
    env: string
  ): Promise<ApplicationResponse> {
    const identifier = this.applicationFactory.getContainerizedApplicationIdentifier(applicationRequest.name);
    const { property, deploymentConnection } = await this.getDeploymentConnection(propertyIdentifier, env);
    applicationRequest.path = this.applicationFactory.getPath(applicationRequest.path);
    if (applicationRequest?.healthCheckPath) applicationRequest.healthCheckPath = this.applicationFactory.getPath(applicationRequest.healthCheckPath);
    let applicationDetails = (
      await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isContainerized: true, isGit: false })
    )[0];
    const searchedApplicationsByPath = await this.dataServices.application.getByAny({
      propertyIdentifier,
      env,
      path: applicationRequest.path,
      isContainerized: true,
      isGit: false
    });
    const applicationExists = this.applicationFactory.getExistingApplicationsByPath(searchedApplicationsByPath, identifier);
    const applicationConfigDTO = this.applicationFactory.configRequestBuilder(propertyIdentifier, identifier, env, applicationRequest);
    if (!applicationDetails) {
      const saveApplication = await this.applicationFactory.createContainerizedApplicationRequest(
        propertyIdentifier,
        applicationRequest,
        identifier,
        env,
        deploymentConnection,
        applicationRequest.createdBy
      );
      this.logger.log('ContainerizedApplicationDetails', JSON.stringify(saveApplication));
      applicationDetails = await this.dataServices.application.create(saveApplication);
    } else {
      if (await this.applicationFactory.compareApplicationConfigurationForContainerizedDeployment(applicationDetails, { ...applicationRequest })) {
        await this.saveConfig(applicationConfigDTO);
        applicationDetails.config = applicationRequest.config || applicationDetails.config;
        this.logger.log('ContainerizedApplicationUpdatedDetails', JSON.stringify(applicationDetails));
        await this.dataServices.application.updateOne(
          { propertyIdentifier, env, identifier, isContainerized: true, isGit: false },
          applicationDetails
        );
        return this.applicationFactory.createApplicationResponse(applicationDetails, applicationExists);
      }
      /* @internal TODO : Condition to be added once changes are done from the Operator 
        if (JSON.stringify(applicationRequest.config) !== JSON.stringify(applicationDetails.config))
      */
      await this.saveConfig(applicationConfigDTO);
      applicationDetails.nextRef = this.applicationFactory.getNextRef(applicationRequest.ref) || 'NA';
      applicationDetails.name = applicationRequest.name;
      applicationDetails.path = applicationRequest.path;
      applicationDetails.imageUrl = applicationRequest.imageUrl;
      applicationDetails.version = this.applicationFactory.incrementVersion(applicationDetails.version);
      applicationDetails.healthCheckPath = applicationRequest.healthCheckPath || applicationDetails.healthCheckPath;
      applicationDetails.config = applicationRequest.config || applicationDetails.config;
      applicationDetails.port = applicationRequest.port || applicationDetails.port || CONTAINERIZED_DEPLOYMENT_DETAILS.port;
      applicationDetails.accessUrl = this.applicationFactory.getAccessUrl(deploymentConnection, applicationRequest, propertyIdentifier, env, true);
      applicationDetails.routerUrl = this.applicationFactory.getRouterUrl(deploymentConnection, applicationRequest, propertyIdentifier, env);
      applicationDetails.updatedBy = applicationRequest.createdBy;
      this.logger.log('ContainerizedApplicationUpdatedDetails', JSON.stringify(applicationDetails));
      applicationDetails.config = applicationRequest.config;
      await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isContainerized: true, isGit: false }, applicationDetails);
    }
    const containerizedDeploymentRequestForOperator = this.applicationFactory.createContainerizedDeploymentRequestForOperator(
      propertyIdentifier,
      identifier,
      env,
      applicationDetails,
      property.cmdbCode,
      property.namespace
    );
    this.logger.log('OperatorRequestForContainerizedDeployment', JSON.stringify(containerizedDeploymentRequestForOperator));
    this.deployContainerizedApplication(
      containerizedDeploymentRequestForOperator,
      propertyIdentifier,
      env,
      identifier,
      deploymentConnection,
      applicationRequest.createdBy
    );
    await this.analyticsService.createActivityStream(
      propertyIdentifier,
      Action.APPLICATION_DEPLOYMENT_STARTED,
      env,
      identifier,
      `Deployment started for ${applicationRequest.name} at ${env} [Containerized]`,
      applicationRequest.createdBy,
      Source.MANAGER,
      JSON.stringify(applicationRequest)
    );
    return this.applicationFactory.createApplicationResponse(applicationDetails, applicationExists);
  }

  // @internal Get the deployment connection for the property
  async getDeploymentConnection(propertyIdentifier: string, env: string) {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    this.logger.log('Property', JSON.stringify(property));
    let deploymentConnection;
    // @internal checking property severity, if that is higher then deploy it in multi-cluster
    if (DEPLOYMENT_DETAILS.severity.includes(property.severity) && environment.cluster === Cluster.PROD) {
      deploymentConnection = await this.dataServices.deploymentConnection.getByAny({ cluster: Cluster.PROD });
    } else {
      const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === environment.cluster);
      deploymentConnection = await this.dataServices.deploymentConnection.getByAny({ name: deploymentRecord.name });
    }
    this.logger.log('DeploymentConnection', JSON.stringify(deploymentConnection));
    return { property, deploymentConnection };
  }

  // @internal check if property exists in the cluster or not
  async checkDeploymentRecord(propertyIdentifier: string, cluster: string) {
    if (!propertyIdentifier || !cluster) this.exceptionService.badRequestException({ message: `PropertyIdentifier or Cluster not present.` });
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    if (!property) this.exceptionService.badRequestException({ message: `No Property Found.` });
    const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === cluster);
    if (!deploymentRecord)
      this.exceptionService.badRequestException({
        message: `No environment found for the property: ${propertyIdentifier} on ${cluster} cluster. Please create a new environment selecting ${cluster} as the environment type from the SPAship Manager.`
      });
  }

  /* @internal
   * Start the Containerized deployment in the operator
   * Receive the final acknowledgement from the operator
   * Update the particular application accordingly
   */
  async deployContainerizedApplication(
    containerizedRequest: ContainerizedDeploymentRequest,
    propertyIdentifier: string,
    env: string,
    identifier: string,
    deploymentConnection: DeploymentConnection[],
    createdBy: string
  ) {
    let applicationDetails;
    let cluster;
    try {
      for (const con of deploymentConnection) {
        const response = await this.applicationFactory.containerizedDeploymentRequest(containerizedRequest, con.baseurl);
        this.logger.log('ContainerizedDeploymentResponse', JSON.stringify(response));
        if (!response) return;
        [applicationDetails] = await this.dataServices.application.getByAny({
          propertyIdentifier,
          env,
          identifier,
          isContainerized: true,
          isGit: false
        });
        applicationDetails.ref = applicationDetails.nextRef;
        await this.dataServices.application.updateOne(
          { propertyIdentifier, env, identifier, isContainerized: true, isGit: false },
          applicationDetails
        );
        this.logger.log('UpdatedContainerizedApplication', JSON.stringify(applicationDetails));
        const diff = (applicationDetails.updatedAt.getTime() - new Date().getTime()) / 1000;
        const consumedTime = Math.abs(diff).toFixed(2).toString();
        this.logger.log('TimeToDeploy', `${consumedTime} seconds`);
        const envDetails = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
        cluster = envDetails.cluster;
        const eventTimeTrace = this.applicationFactory.processDeploymentTime(applicationDetails, consumedTime, envDetails.cluster);
        await this.dataServices.eventTimeTrace.create(eventTimeTrace);
        await this.analyticsService.createActivityStream(
          propertyIdentifier,
          Action.APPLICATION_DEPLOYED,
          env,
          identifier,
          `Deployment Time : ${consumedTime} seconds [Containerized]`,
          createdBy,
          `${Source.OPERATOR}-Containerized`,
          JSON.stringify(response),
          envDetails.cluster,
          DEPLOYMENT_DETAILS.type.containerized
        );
      }
      for (const routerUrl of applicationDetails.routerUrl) this.recordDeploymentStatus(propertyIdentifier, env, identifier, cluster, routerUrl);
    } catch (err) {
      this.logger.warn('ContainerizedDeployment', err);
    }
  }

  /* @internal
   * Update the configuration for the particular application
   * Request the updated configuration to the operator
   * Update the application accordingly after the successful updating
   */
  async saveConfig(configDTO: ApplicationConfigDTO): Promise<Application> {
    const search = {
      identifier: configDTO.identifier,
      propertyIdentifier: configDTO.propertyIdentifier,
      env: configDTO.env,
      isContainerized: true,
      isGit: false
    };
    const applicationDetails = (await this.dataServices.application.getByAny(search))[0];
    if (!applicationDetails)
      this.exceptionService.badRequestException({
        message: `${configDTO.identifier} application doesn't exist for ${configDTO.propertyIdentifier}.`
      });
    const { property, deploymentConnection } = await this.getDeploymentConnection(configDTO.propertyIdentifier, configDTO.env);
    const deletedConfigKeys = this.applicationFactory.getDeletedKeys(applicationDetails.config || {}, configDTO.config || {});
    const containerizedDeploymentRequestForOperator = this.applicationFactory.createContainerizedOperatorConfigRequest(
      configDTO,
      property.namespace,
      deletedConfigKeys
    );
    applicationDetails.config = configDTO.config;
    applicationDetails.updatedBy = configDTO.createdBy;
    await this.dataServices.application.updateOne(search, applicationDetails);
    for (const con of deploymentConnection) {
      try {
        this.applicationFactory.containerizedConfigUpdate(containerizedDeploymentRequestForOperator, con.baseurl);
      } catch (error) {
        this.logger.error('ConfigUpdateError', error);
      }
    }
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
   * Create the request object for the Containerized-Git Application
   * Process the Application
   * Start the Containerized-Git build and deployment in the operator
   */
  async saveGitApplication(applicationRequest: CreateApplicationDto, propertyIdentifier: string, env: string): Promise<Application> {
    const identifier = this.applicationFactory.getContainerizedApplicationIdentifier(applicationRequest.name);
    const { property, deploymentConnection } = await this.getDeploymentConnection(propertyIdentifier, env);
    applicationRequest.repoUrl = this.applicationFactory.getRepoUrl(applicationRequest.repoUrl);
    applicationRequest.contextDir = this.applicationFactory.getPath(applicationRequest.contextDir);
    applicationRequest.path = this.applicationFactory.getPath(applicationRequest.path);
    const tmpSecret = applicationRequest.secret;
    if (applicationRequest.secret) applicationRequest.secret = this.applicationFactory.initializeEmptyValues(applicationRequest.secret);
    if (applicationRequest.healthCheckPath) applicationRequest.healthCheckPath = this.applicationFactory.getPath(applicationRequest.healthCheckPath);
    env = await this.createEphemeralEnvironment(applicationRequest, propertyIdentifier, env, applicationRequest.createdBy);
    let applicationDetails = (
      await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isContainerized: true, isGit: true })
    )[0];
    if (!applicationDetails) {
      const saveApplication = await this.applicationFactory.createContainerizedGitApplicationRequest(
        propertyIdentifier,
        applicationRequest,
        identifier,
        env,
        deploymentConnection,
        applicationRequest.createdBy
      );
      this.logger.log('ContainerizedGitApplicationDetails', JSON.stringify(saveApplication));
      applicationDetails = await this.dataServices.application.create(saveApplication);
    } else {
      if (await this.applicationFactory.compareApplicationConfiguration(applicationDetails, { ...applicationRequest, secret: tmpSecret })) {
        const deletedConfigKeys = this.applicationFactory.getDeletedKeys(applicationDetails.config || {}, applicationRequest.config || {});
        const applicationConfigRequest = this.applicationFactory.transformRequestToApplicationConfig(
          propertyIdentifier,
          identifier,
          applicationDetails.env,
          applicationRequest.config
        );
        const containerizedDeploymentRequestForOperator = this.applicationFactory.createContainerizedOperatorConfigRequest(
          applicationConfigRequest,
          property.namespace,
          deletedConfigKeys
        );
        this.logger.log('ConfigUpdateRequestToOperator', JSON.stringify(containerizedDeploymentRequestForOperator));
        applicationDetails.config = applicationRequest.config;
        applicationDetails.updatedBy = applicationRequest.createdBy;
        for (const con of deploymentConnection) {
          try {
            await this.applicationFactory.containerizedConfigUpdate(containerizedDeploymentRequestForOperator, con.baseurl);
          } catch (error) {
            this.logger.error('ConfigUpdateError', error);
          }
        }
        if (tmpSecret) {
          const deletedSecretKeys = this.applicationFactory.getDeletedKeys(applicationDetails.secret || {}, tmpSecret || {});
          containerizedDeploymentRequestForOperator.ssrResourceDetails.secretMap = await this.applicationFactory.decodeBase64SecretValues({
            ...tmpSecret
          });
          containerizedDeploymentRequestForOperator.keysToDelete = deletedSecretKeys;
          applicationDetails.secret = applicationRequest.secret;
          for (const con of deploymentConnection) {
            try {
              this.applicationFactory.containerizedSecretUpdate(containerizedDeploymentRequestForOperator, con.baseurl);
            } catch (error) {
              this.logger.error('SecretUpdateError', error);
            }
          }
        }
        await this.dataServices.application.updateOne(
          { propertyIdentifier, env, identifier, isContainerized: true, isGit: true },
          applicationDetails
        );
        await this.analyticsService.createActivityStream(
          propertyIdentifier,
          Action.APPLICATION_CONFIG_UPDATED,
          env,
          identifier,
          `${applicationDetails.name} configuration updated for ${env} [Workflow 3.0]`,
          applicationRequest.createdBy,
          Source.MANAGER,
          JSON.stringify(applicationDetails)
        );
        return applicationDetails;
      }
      const currentTime = new Date();
      applicationDetails.nextRef = this.applicationFactory.getNextRef(applicationRequest.ref) || 'NA';
      applicationDetails.path = applicationRequest.path;
      applicationDetails.version = this.applicationFactory.incrementVersion(applicationDetails.version);
      applicationDetails.healthCheckPath = applicationRequest.healthCheckPath || applicationDetails.healthCheckPath;
      applicationDetails.config = applicationRequest.config || applicationDetails.config;
      applicationDetails.secret = applicationRequest.secret || applicationDetails.secret;
      applicationDetails.port = applicationRequest.port || applicationDetails.port || CONTAINERIZED_DEPLOYMENT_DETAILS.port;
      applicationDetails.accessUrl = this.applicationFactory.getAccessUrl(deploymentConnection, applicationRequest, propertyIdentifier, env, true);
      applicationDetails.routerUrl = this.applicationFactory.getRouterUrl(deploymentConnection, applicationRequest, propertyIdentifier, env);
      applicationDetails.repoUrl = applicationRequest.repoUrl || applicationDetails.repoUrl;
      applicationDetails.gitRef = applicationRequest.gitRef || applicationDetails.gitRef;
      applicationDetails.contextDir = applicationRequest.contextDir || applicationDetails.contextDir;
      applicationDetails.buildArgs = applicationRequest.buildArgs || applicationDetails.buildArgs;
      applicationDetails.dockerFileName = applicationRequest.dockerFileName || applicationDetails.dockerFileName;
      applicationDetails.commitDetails = applicationRequest.commitId
        ? [...applicationDetails.commitDetails, { id: applicationRequest.commitId, createdAt: currentTime }]
        : applicationDetails.commitDetails;
      applicationDetails.mergeDetails = applicationRequest.mergeId
        ? [...applicationDetails.mergeDetails, { id: applicationRequest.mergeId, createdAt: currentTime }]
        : applicationDetails.mergeDetails;
      applicationDetails.gitProjectId = applicationRequest.gitProjectId || applicationDetails.gitProjectId;
      applicationDetails.updatedBy = applicationRequest.createdBy;
      await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isContainerized: true, isGit: true }, applicationDetails);
    }
    if (tmpSecret) applicationDetails.secret = tmpSecret;
    const containerizedGitOperatorRequest = this.applicationFactory.createContainerizedGitOperatorRequest(
      applicationRequest,
      propertyIdentifier,
      identifier,
      env,
      property.cmdbCode,
      property.namespace,
      applicationDetails
    );
    this.logger.log('ContainerizedGitOperatorRequest', JSON.stringify(containerizedGitOperatorRequest));
    if (applicationDetails.secret) applicationDetails.secret = this.applicationFactory.initializeEmptyValues(applicationDetails.secret);
    for (const con of deploymentConnection) {
      const response = await this.applicationFactory.containerizedEnabledGitDeploymentRequest(containerizedGitOperatorRequest, con.baseurl);
      if (response) {
        const statusRequest = this.applicationFactory.createLogRequest(propertyIdentifier, env, identifier, property.namespace);
        await this.analyticsService.createActivityStream(
          propertyIdentifier,
          Action.APPLICATION_BUILD_STARTED,
          env,
          identifier,
          `Build [${response.buildName}] Started for ${applicationRequest.name} at ${env} [Workflow 3.0]`,
          applicationRequest.createdBy,
          Source.GIT,
          JSON.stringify(response)
        );
        applicationDetails.buildName = [...applicationDetails.buildName, { name: response.buildName, deploymentConnection: con.name }];
        await this.dataServices.application.updateOne(
          { propertyIdentifier, env, identifier, isContainerized: true, isGit: true },
          applicationDetails
        );
        this.manageBuildAndDeployment(
          applicationDetails,
          statusRequest,
          response.buildName,
          con.baseurl,
          applicationRequest.commitId,
          applicationRequest.mergeId
        );
      } else {
        await this.analyticsService.createActivityStream(
          propertyIdentifier,
          Action.APPLICATION_DEPLOYMENT_FAILED,
          env,
          identifier,
          `Deployment Failed ${applicationRequest.name} at ${env} [Workflow 3.0]`,
          applicationRequest.createdBy,
          Source.GIT,
          JSON.stringify(applicationRequest)
        );
        this.exceptionService.internalServerErrorException({
          message: `Application Deployment is Failed currently, please try after sometime.`
        });
      }
    }
    return applicationDetails;
  }

  private async manageBuildAndDeployment(
    application: Application,
    statusRequest: GitApplicationStatusRequest,
    buildName: string,
    baseurl: string,
    commitId: string,
    mergeId: string
  ) {
    await this.startBuildInterval(application, buildName, statusRequest, baseurl, commitId, mergeId);
  }

  // @internal Check build periodically & update the status
  async startBuildInterval(
    application: Application,
    buildName: string,
    statusRequest: GitApplicationStatusRequest,
    baseurl: string,
    commitId: string,
    mergeId: string
  ) {
    let buildCheck = false;
    const buildInterval = setInterval(async () => {
      this.logger.log('BuildCheck', `Checking Build for ${buildName}`);
      const buildStatus = await this.applicationFactory.buildStatusRequest({ ...statusRequest, objectName: buildName }, baseurl);
      this.logger.log('BuildStatus', `${buildName} : ${buildStatus.data}}`);
      if (buildStatus?.data === STATUS.BUILD_COMPLETED) {
        this.logger.log('BuildStatus', `Build Successfully Completed for ${buildName} [Workflow 3.0]`);
        buildCheck = true;
        this.startDeploymentInterval(application, statusRequest, baseurl, buildName, commitId, mergeId);
        await clearInterval(buildInterval);
      } else if (buildStatus?.data === STATUS.BUILD_FAILED) {
        buildCheck = true;
        this.logger.error('BuildStatus', `Build Failed for ${buildName} [Workflow 3.0]`);
        this.analyticsService.createActivityStream(
          application.propertyIdentifier,
          Action.APPLICATION_BUILD_FAILED,
          application.env,
          application.identifier,
          `Build [${buildName}] Failed for ${application.identifier} [Workflow 3.0]`,
          application.createdBy,
          Source.GIT,
          JSON.stringify(statusRequest)
        );
        await clearInterval(buildInterval);
        if (commitId) {
          const gitCommentRequest = this.applicationFactory.generateGitCommentPayload(
            commitId,
            mergeId,
            application.gitProjectId,
            Action.APPLICATION_BUILD_FAILED
          );
          this.applicationFactory.pushEventsInGitBroker(gitCommentRequest);
        }
      } else if (buildStatus?.data === STATUS.BUILD_TERMINATED) {
        buildCheck = true;
        this.logger.error('BuildStatus', `Build Terminated for ${buildName} [Workflow 3.0]`);
        this.analyticsService.createActivityStream(
          application.propertyIdentifier,
          Action.APPLICATION_BUILD_TERMINATED,
          application.env,
          application.identifier,
          `Build [${buildName}] Terminated for ${application.identifier} [Workflow 3.0]`,
          application.createdBy,
          Source.GIT,
          JSON.stringify(statusRequest)
        );
        await clearInterval(buildInterval);
        if (commitId) {
          const gitCommentRequest = this.applicationFactory.generateGitCommentPayload(
            commitId,
            mergeId,
            application.gitProjectId,
            Action.APPLICATION_BUILD_TERMINATED
          );
          this.applicationFactory.pushEventsInGitBroker(gitCommentRequest);
        }
      }
    }, this.period);
    setTimeout(async () => {
      if (!buildCheck) {
        this.logger.warn('BuildTimeout', `Build Timeout for ${buildName} [Workflow 3.0]`);
        this.analyticsService.createActivityStream(
          application.propertyIdentifier,
          Action.APPLICATION_BUILD_TIMEOUT,
          application.env,
          application.identifier,
          `Build [${buildName}] Timeout for ${application.identifier} [Workflow 3.0]`,
          application.createdBy,
          Source.GIT,
          JSON.stringify(statusRequest)
        );
        if (commitId) {
          const gitCommentRequest = this.applicationFactory.generateGitCommentPayload(
            commitId,
            mergeId,
            application.gitProjectId,
            Action.APPLICATION_BUILD_TIMEOUT
          );
          this.applicationFactory.pushEventsInGitBroker(gitCommentRequest);
        }
      }
      await clearInterval(buildInterval);
    }, this.timeout);
  }

  // @internal Check deployment periodically & update the status
  async startDeploymentInterval(
    application: Application,
    statusRequest: GitApplicationStatusRequest,
    baseurl: string,
    buildName: string,
    commitId: string,
    mergeId: string
  ) {
    let deploymentCheck = false;
    const deploymentInterval = setInterval(async () => {
      const deploymentStatus = await this.applicationFactory.deploymentStatusRequest(statusRequest, baseurl);
      this.logger.log('DeploymentStatus', `${statusRequest.objectName} : ${deploymentStatus.data}`);
      if (deploymentStatus.status === STATUS.DEPLOYMENT_READY) {
        await clearInterval(deploymentInterval);
        deploymentCheck = true;
        const applicationDetails = (
          await this.dataServices.application.getByAny({
            propertyIdentifier: application.propertyIdentifier,
            env: application.env,
            identifier: application.identifier,
            isContainerized: true,
            isGit: true
          })
        )[0];
        // @internal conversion from the milliseconds to seconds
        const diff = (applicationDetails.updatedAt.getTime() - new Date().getTime()) / 1000;
        const consumedTime = Math.abs(diff).toFixed(2).toString();
        this.logger.log('TimeToDeploy', `${consumedTime} seconds [${buildName}]`);
        const envDetails = (
          await this.dataServices.environment.getByAny({ propertyIdentifier: application.propertyIdentifier, env: application.env })
        )[0];
        const eventTimeTrace = this.applicationFactory.processDeploymentTime(applicationDetails, consumedTime, envDetails.cluster);
        await this.dataServices.eventTimeTrace.create(eventTimeTrace);
        this.analyticsService.createActivityStream(
          application.propertyIdentifier,
          Action.APPLICATION_DEPLOYED,
          application.env,
          application.identifier,
          `Deployment Time : ${consumedTime} seconds  [${buildName}]`,
          application.createdBy,
          Source.GIT,
          JSON.stringify(deploymentStatus.data),
          envDetails.cluster,
          DEPLOYMENT_DETAILS.type.containerized
        );
        if (commitId) {
          const gitCommentRequest = this.applicationFactory.generateGitCommentPayload(
            commitId,
            mergeId,
            application.gitProjectId,
            Action.APPLICATION_DEPLOYED,
            application.routerUrl
          );
          this.applicationFactory.pushEventsInGitBroker(gitCommentRequest);
        }
      } else if (deploymentStatus?.status === STATUS.DEPLOYMENT_FAILED) {
        this.logger.warn('DeploymentFailed', `Deployment Failed [BuildId : ${buildName}]`);
        deploymentCheck = true;
        this.analyticsService.createActivityStream(
          application.propertyIdentifier,
          Action.APPLICATION_DEPLOYMENT_FAILED,
          application.env,
          application.identifier,
          `Deployment Failed [${buildName}] [Workflow 3.0]`,
          application.createdBy,
          Source.GIT,
          JSON.stringify(statusRequest)
        );
        await clearInterval(deploymentInterval);
        if (commitId) {
          const gitCommentRequest = this.applicationFactory.generateGitCommentPayload(
            commitId,
            mergeId,
            application.gitProjectId,
            Action.APPLICATION_DEPLOYMENT_FAILED
          );
          this.applicationFactory.pushEventsInGitBroker(gitCommentRequest);
        }
      }
    }, this.period);
    setTimeout(async () => {
      if (!deploymentCheck) {
        this.logger.warn('DeploymentTimeout', `Deployment Timeout for ${statusRequest.objectName} [BuildId : ${buildName}]`);
        this.analyticsService.createActivityStream(
          application.propertyIdentifier,
          Action.APPLICATION_DEPLOYMENT_TIMEOUT,
          application.env,
          application.identifier,
          `Deployment Timeout [${buildName}] [Workflow 3.0]`,
          application.createdBy,
          Source.GIT,
          JSON.stringify(statusRequest)
        );
        if (commitId) {
          const gitCommentRequest = this.applicationFactory.generateGitCommentPayload(
            commitId,
            mergeId,
            application.gitProjectId,
            Action.APPLICATION_DEPLOYMENT_TIMEOUT
          );
          this.applicationFactory.pushEventsInGitBroker(gitCommentRequest);
        }
      }
      await clearInterval(deploymentInterval);
    }, this.timeout);
  }

  /* @internal
   * Process and Select the Environment for Deployment
   * Create the Payload and Start the Deployment
   */
  async processGitRequest(gitRequestDTO: GitDeploymentRequestDTO) {
    const defaultEnv = 'dev';
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
      envsResponse = envsResponse.find((i) => i.env === defaultEnv) ? [envsResponse.find((i) => i.env === defaultEnv)] : [];
      this.logger.log('DefaultEnv', JSON.stringify(envsResponse));
    }
    if (!envsResponse.length) this.exceptionService.badRequestException({ message: `No Preferred environment found for the deployment` });
    try {
      for (const tmp of envsResponse) {
        const applicationRequest = this.applicationFactory.generateApplicationRequestFromGit(checkGitRegistry, tmp, gitRequestDTO);
        await this.saveGitApplication(applicationRequest, tmp.propertyIdentifier, tmp.env);
      }
    } catch (error) {
      this.logger.warn('GitDeployment', error);
      this.exceptionService.internalServerErrorException(error);
    }
    return { message: `Build & Deployment Process Started Successfully, please check SPAship Manager for more details.` };
  }

  // @internal It will check that registered property and env
  async validatePropertyAndEnvironment(propertyIdentifier: string, env: string) {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (!environment)
      this.exceptionService.badRequestException({
        message: `${env} environment doesn't exist on ${propertyIdentifier}.`
      });
  }

  // @internal It will validate the image format and the source
  async validateImageRegistry(imageUrl: string) {
    const imageRegistry = await this.applicationFactory.validateImageSource(imageUrl);
    if (!imageRegistry)
      this.exceptionService.badRequestException({
        message: `${imageUrl} doesn't exists on the source registry, please provide a valid imageUrl.`
      });
  }

  // @internal It will validate the git repository
  async validateGitProps(repoUrl: string, gitRef: string, contextDir: string) {
    if (!isURL(repoUrl)) this.exceptionService.badRequestException({ message: 'Please provide a valid url.' });
    if (!repoUrl.startsWith(Source.GITHUB) && !repoUrl.startsWith(Source.GITLAB))
      this.exceptionService.badRequestException({
        message: `Currently we only support Github & Gitlab repositories. Please provide a valid url.`
      });
    const gitProps = await this.applicationFactory.validateGitProps(repoUrl, gitRef, contextDir);
    if (!gitProps)
      this.exceptionService.badRequestException({
        message: `Please verify the repository details (Public Repository URL / Context Dir / Branch name).`
      });
  }

  // @internal It will validate if the url and context directory is registered for any other property
  async validateExistingGitDeployment(repoUrl: string, contextDir: string, propertyIdentifier: string, identifier: string) {
    repoUrl = this.applicationFactory.getRepoUrl(repoUrl);
    contextDir = this.applicationFactory.getPath(contextDir);
    identifier = this.applicationFactory.getContainerizedApplicationIdentifier(identifier);
    const checkGitRegistry = await this.dataServices.application.getByAny({ repoUrl, contextDir });
    const existingApplications = checkGitRegistry.filter((i) => i.propertyIdentifier !== propertyIdentifier || i.identifier !== identifier);
    if (existingApplications.length) {
      const listApplications = [];
      existingApplications.forEach((tmp) => {
        listApplications.push(`${tmp.propertyIdentifier}-${tmp.env}-${tmp.identifier}`);
      });
      this.exceptionService.badRequestException({
        message: `${repoUrl}${contextDir} is already registered. [${listApplications}]`
      });
    }
  }

  // @internal It will get the logs (build/deployment/pod) based on the request
  async getLogs(
    propertyIdentifier: string,
    env: string,
    identifier: string,
    lines: string,
    type: string,
    id: string,
    cluster: string
  ): Promise<String> {
    let response;
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (!environment) this.exceptionService.badRequestException({ message: 'Invalid Property & Environment. Please check the Deployment URL.' });
    const connectionDetails = await this.getDeploymentConnection(propertyIdentifier, env);
    const { property } = connectionDetails;
    let { deploymentConnection } = connectionDetails;
    if (cluster) [response] = await this.dataServices.deploymentConnection.getByAny({ name: cluster });
    deploymentConnection = response || deploymentConnection[0];
    const logRequest = this.applicationFactory.createLogRequest(propertyIdentifier, env, identifier, property.namespace, lines);
    if (type === LOGTYPE.BUILD) {
      if (!id) this.exceptionService.badRequestException({ message: 'Please provide the id for the build logs.' });
      logRequest.objectName = id;
      return this.applicationFactory.buildLogRequest(logRequest, deploymentConnection.baseurl);
    }
    if (type === LOGTYPE.POD) {
      if (!id) this.exceptionService.badRequestException({ message: 'Please provide the id for the pod logs.' });
      logRequest.objectName = id;
      return this.applicationFactory.podLogRequest(logRequest, deploymentConnection.baseurl);
    }
    return this.applicationFactory.deploymentLogRequest(logRequest, deploymentConnection.baseurl);
  }

  // @internal Check the status of an application
  async checkApplicationStatus(accessUrl: string) {
    if (!accessUrl) this.exceptionService.badRequestException({ message: 'Please provide the access url.' });
    if (!isURL(accessUrl)) this.exceptionService.badRequestException({ message: 'Please provide a valid access url.' });
    if (!(await this.applicationFactory.checkUrlSource(accessUrl)))
      this.exceptionService.badRequestException({ message: 'Application is currently down.' });
    return { message: 'Application is running.' };
  }

  // @internal Get the list of the pods
  async getListOfPods(propertyIdentifier: string, env: string, identifier: string): Promise<String[]> {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (!environment) this.exceptionService.badRequestException({ message: 'Invalid Property & Environment. Please check the Deployment URL.' });
    const { property, deploymentConnection } = await this.getDeploymentConnection(propertyIdentifier, env);
    const deploymentName = `${propertyIdentifier}-${identifier}-${env}`;
    const response = [];
    for (const con of deploymentConnection) {
      try {
        const listOfPods = await this.applicationFactory.getListOfPods(deploymentName, property.namespace, con.baseurl);
        response.push({ con: con.name, pods: listOfPods });
      } catch (err) {
        response.push(err.message);
      }
    }
    return response;
  }

  /* @internal
   * Enable auto sync for the Applications
   * It will enable auto sync for the Static Applications
   */
  async enableApplicationAutoSync(enableApplicationSync: EnableApplicationSyncDTO): Promise<Application> {
    const search = {
      identifier: enableApplicationSync.identifier,
      propertyIdentifier: enableApplicationSync.propertyIdentifier,
      env: enableApplicationSync.env,
      isContainerized: false,
      isGit: false
    };
    const applicationDetails = (await this.dataServices.application.getByAny(search))[0];
    if (!applicationDetails)
      this.exceptionService.badRequestException({
        message: `${enableApplicationSync.identifier} application doesn't exist for ${enableApplicationSync.propertyIdentifier}.`
      });
    applicationDetails.autoSync = enableApplicationSync.autoSync;
    applicationDetails.updatedBy = enableApplicationSync.createdBy;
    await this.dataServices.application.updateOne(search, applicationDetails);
    return applicationDetails;
  }

  /* @internal
   * Delete Application from an env of specific property
   * TBD : Currently we're only doing the Static Property deletion
   * We've already have the containerized deletion in the env delete service
   * We'll prioritize it accordingly
   */
  async deleteApplication(deleteApplicationSyncDTO: DeleteApplicationSyncDTO) {
    const { propertyIdentifier } = deleteApplicationSyncDTO;
    const { env } = deleteApplicationSyncDTO;
    const search = {
      identifier: deleteApplicationSyncDTO.identifier,
      propertyIdentifier,
      env,
      isContainerized: false,
      isGit: false
    };
    const applicationDetails = (await this.dataServices.application.getByAny(search))[0];
    if (!applicationDetails)
      this.exceptionService.badRequestException({
        message: `${deleteApplicationSyncDTO.identifier} application doesn't exist for ${propertyIdentifier}.`
      });
    const { property, deploymentConnection } = await this.getDeploymentConnection(propertyIdentifier, env);
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (environment.cluster === Cluster.PROD)
      this.exceptionService.badRequestException({
        message: `Deleting the Application form Prod Cluster is Restricted. Please Connect with the SPAship Team`
      });
    const zipPath = await this.applicationFactory.createApplicationDeletionTemplateAndZip(property, applicationDetails);
    try {
      for (const con of deploymentConnection) {
        const formData: any = new FormData();
        const fileStream = await fs.createReadStream(zipPath);
        formData.append('spa', fileStream);
        formData.append('description', `${propertyIdentifier}_${env}`);
        formData.append('website', propertyIdentifier);
        const response = await this.applicationFactory.deploymentRequest(formData, con.baseurl);
        this.logger.log('OperatorResponse', JSON.stringify(response.data));
      }
    } catch (err) {
      this.logger.error('ApplicationDeletion', err);
      this.exceptionService.internalServerErrorException(err.message);
    }
    const deletionResponse = await this.dataServices.application.delete({ ...search });
    if (deletionResponse)
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.APPLICATION_DELETED,
        'NA',
        'NA',
        `${applicationDetails.identifier} deleted from ${env} of ${propertyIdentifier}`,
        deleteApplicationSyncDTO.createdBy,
        Source.MANAGER,
        JSON.stringify(applicationDetails)
      );
    return applicationDetails;
  }

  /* @internal
   * Check & record the application status
   * if application is not live it will be terminated after the given time
   */
  async recordDeploymentStatus(propertyIdentifier: string, env: string, identifier: string, cluster: string, routeUrl: string) {
    let applicationStatus = false;
    const applicationStatusInterval = setInterval(async () => {
      this.logger.log('ApplicationStatus', `Checking the application ${routeUrl}`);
      try {
        await this.checkApplicationStatus(routeUrl);
        await this.analyticsService.createActivityStream(
          propertyIdentifier,
          Action.APPLICATION_AVAILABLE,
          env,
          identifier,
          `Application is live`,
          'Operator',
          `${Source.OPERATOR}-Containerized`,
          JSON.stringify(propertyIdentifier),
          cluster,
          DEPLOYMENT_DETAILS.type.containerized
        );
        applicationStatus = true;
        await clearInterval(applicationStatusInterval);
      } catch (err) {
        this.logger.log('ApplicationStatus', err);
      }
    }, this.period);
    setTimeout(async () => {
      if (!applicationStatus) {
        await this.analyticsService.createActivityStream(
          propertyIdentifier,
          Action.APPLICATION_UNAVAILABLE,
          env,
          identifier,
          `Application is unavailable, please redeploy with the valid config`,
          'Operator',
          `${Source.OPERATOR}-Containerized`,
          JSON.stringify(propertyIdentifier),
          cluster,
          DEPLOYMENT_DETAILS.type.containerized
        );
      }
      await clearInterval(applicationStatusInterval);
    }, this.applicationTimeout);
  }
}
