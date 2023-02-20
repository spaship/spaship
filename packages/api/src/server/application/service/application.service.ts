import { Injectable } from '@nestjs/common';
import * as decompress from 'decompress';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { DIRECTORY_CONFIGURATION, EPHEMERAL_ENV, JOB } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { AgendaService } from 'src/server/agenda/agenda.service';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { Application } from 'src/server/application/application.entity';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { Source } from 'src/server/property/property.entity';
import { ApplicationConfigDTO, ApplicationResponse, CreateApplicationDto, SSRDeploymentRequest } from '../application.dto';
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
    const applicationDetails = (await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isSSR: false }))[0];
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === environment.cluster);
    const deploymentConnection = (await this.dataServices.deploymentConnection.getByAny({ name: deploymentRecord.name }))[0];
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
      return this.applicationFactory.createApplicationResponse(saveApplication, deploymentConnection.baseurl);
    }
    applicationDetails.nextRef = this.applicationFactory.getNextRef(applicationRequest.ref) || 'NA';
    applicationDetails.name = applicationRequest.name;
    applicationDetails.updatedBy = createdBy;
    this.logger.log('UpdatedApplicationDetails', JSON.stringify(applicationDetails));
    await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isSSR: false }, applicationDetails);
    return this.applicationFactory.createApplicationResponse(applicationDetails, deploymentConnection.baseurl);
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
    const identifier = this.applicationFactory.getIdentifier(applicationRequest.name);
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    this.logger.log('Property', JSON.stringify(property));
    const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === environment.cluster);
    const deploymentConnection = (await this.dataServices.deploymentConnection.getByAny({ name: deploymentRecord.name }))[0];
    this.logger.log('DeploymentConnection', JSON.stringify(deploymentConnection));
    const ssrOperatorRequest = this.applicationFactory.createSSROperatorRequest(applicationRequest, propertyIdentifier, env, property.namespace);
    this.logger.log('SSROperatorRequest', JSON.stringify(ssrOperatorRequest));
    const saveApplication = await this.applicationFactory.createSSRApplicationRequest(
      propertyIdentifier,
      applicationRequest,
      identifier,
      env,
      applicationRequest.createdBy
    );
    const applicationDetails = (await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isSSR: true }))[0];
    if (!applicationDetails) {
      this.logger.log('SSRApplicationDetails', JSON.stringify(applicationDetails));
      this.dataServices.application.create(saveApplication);
    } else {
      applicationDetails.nextRef = this.applicationFactory.getNextRef(applicationRequest.ref) || 'NA';
      applicationDetails.name = applicationRequest.name;
      applicationDetails.path = applicationRequest.path;
      applicationDetails.imageUrl = applicationRequest.imageUrl;
      applicationDetails.healthCheckPath = applicationRequest.healthCheckPath;
      applicationDetails.config = applicationRequest.config;
      applicationDetails.updatedBy = applicationRequest.createdBy;
      this.logger.log('SSRUpdatedApplicationDetails', JSON.stringify(applicationDetails));
      await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier }, applicationDetails);
    }
    this.deploySSRApplication(ssrOperatorRequest, propertyIdentifier, env, identifier, deploymentConnection.baseurl);
    return saveApplication;
  }

  /* @internal
   * Start the SSR deployment in the operator
   * Receive the final acknowledgement from the operator
   * Update the particular application accordingly
   */
  async deploySSRApplication(sseRequest: SSRDeploymentRequest, propertyIdentifier: string, env: string, identifier: string, baseUrl: string) {
    const applicationDetails = (await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isSSR: true }))[0];
    try {
      const response = await this.applicationFactory.ssrDeploymentRequest(sseRequest, baseUrl);
      this.logger.warn('SSRDeploymentResponse', JSON.stringify(response));
      if (!response) return;
      applicationDetails.accessUrl = response.accessUrl;
      applicationDetails.ref = applicationDetails.nextRef;
      await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isSSR: true }, applicationDetails);
      this.logger.warn('UpdatedSSRApplication', JSON.stringify(applicationDetails));
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
    const search = { identifier: configDTO.identifier, propertyIdentifier: configDTO.propertyIdentifier, env: configDTO.env, isSSR: true };
    const applicationDetails = (await this.dataServices.application.getByAny(search))[0];
    if (!applicationDetails)
      this.exceptionService.badRequestException({
        message: `${configDTO.identifier} application doesn't exist for ${configDTO.propertyIdentifier}.`
      });
    applicationDetails.config = configDTO.config;
    applicationDetails.updatedBy = configDTO.createdBy;
    await this.dataServices.application.updateOne(search, applicationDetails);
    // @internal TODO : SSR configs to be implemented for the operator
    return applicationDetails;
  }

  async checkPropertyAndEnvironment(propertyIdentifier: string, env: string) {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (!environment)
      this.exceptionService.badRequestException({
        message: `${env} environment doesn't exist on ${propertyIdentifier}. Please check the Deployment URL.`
      });
  }
}
