import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/entity';
import { AnalyticsService } from 'src/server/analytics/service';
import { Application } from 'src/server/application/entity';
import { ExceptionsService } from 'src/server/exceptions/service';
import { Source } from 'src/server/property/entity';
import { PropertyService } from 'src/server/property/service';
import { CreateEnvironmentDto, SymlinkDTO, SyncEnvironmentDto } from '../dto';
import { Environment, Symlink } from '../entity';
import { EnvironmentFactory } from './factory';

@Injectable()
export class EnvironmentService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly environmentFactory: EnvironmentFactory,
    private readonly propertyService: PropertyService,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
    private readonly analyticsService: AnalyticsService
  ) {}

  getAllEnvironments(): Promise<Environment[]> {
    return this.dataServices.environment.getAll();
  }

  /* @internal
   * Get the environment details based on the propertyIdentifier & ephemeral preview
   * Need to pass the isEph as true for the ephemeral record
   */
  async getEnvironmentByProperty(propertyIdentifier: string, isEphReq: string): Promise<Environment[]> {
    let isEph = false;
    let applications: Application[];
    if (isEphReq === 'true') {
      isEph = true;
      applications = await this.dataServices.application.getByAny({ propertyIdentifier });
    }
    const environments = await this.dataServices.environment.getByAny({ propertyIdentifier, isEph });
    if (!environments) this.exceptionService.badRequestException({ message: 'No Environment found.' });
    if (!isEph) return environments;
    const ephEnvs = [];
    environments.forEach((environment) => {
      const tmpEphApps = [];
      /* eslint-disable array-callback-return */
      applications.find((app) => {
        if (app.env === environment.env) tmpEphApps.push(app);
      });
      ephEnvs.push({ ...environment, applications: tmpEphApps });
    });
    return ephEnvs;
  }

  /* @internal
   * Find the Environments by the Repository URL & Context Directory
   * If Repository is not registered it will throw an error
   */
  async getEnvironmentByRepositoryUrl(repoUrl: string, contextDir: string): Promise<Environment[]> {
    const applications = await this.dataServices.application.getByAny({ repoUrl, contextDir });
    if (!applications.length)
      this.exceptionService.badRequestException({
        message: `No Property found for this ${repoUrl}, please register your property from the SPAship Manager`
      });
    const { propertyIdentifier } = applications[0];
    const environments = await this.dataServices.environment.getByAny({ propertyIdentifier });
    if (!environments) this.exceptionService.badRequestException({ message: 'No Environment found.' });
    return environments;
  }

  /* @internal
   * Create environment for the property
   * Create the deployment record for the cluster if it's not available
   * Initialize environment in the cluster for the property
   * Save the details related to environment (property details & activity stream)
   */
  async createEnvironment(createEnvironmentDto: CreateEnvironmentDto): Promise<any> {
    const checkPropertyAndEnv = await this.dataServices.environment.getByAny({
      propertyIdentifier: createEnvironmentDto.propertyIdentifier,
      env: createEnvironmentDto.env
    });
    const property = (await this.dataServices.property.getByAny({ identifier: createEnvironmentDto.propertyIdentifier }))[0];
    if (checkPropertyAndEnv.length > 0) this.exceptionService.badRequestException({ message: 'Property & Environment already exist.' });
    if (!property) this.exceptionService.badRequestException({ message: 'Please create the Property first.' });
    const checkDeploymentRecord = property.deploymentRecord.find((data) => data.cluster === createEnvironmentDto.cluster);
    if (!checkDeploymentRecord) {
      const getDeploymentRecord = await this.propertyService.getDeploymentRecord(createEnvironmentDto.cluster);
      property.deploymentRecord = [...property.deploymentRecord, getDeploymentRecord];
      await this.dataServices.property.updateOne({ identifier: createEnvironmentDto.propertyIdentifier }, property);
    }
    this.logger.log('Property', JSON.stringify(property));
    const environment = this.environmentFactory.createNewEnvironment(createEnvironmentDto);
    Promise.all([this.dataServices.environment.create(environment)]);
    // @internal TODO : removing the auto initialization, to be discussed on it further
    // await this.environmentFactory.initializeEnvironment(property, environment);
    await this.analyticsService.createActivityStream(
      createEnvironmentDto.propertyIdentifier,
      Action.ENV_CREATED,
      createEnvironmentDto.env,
      'NA',
      `${createEnvironmentDto.env} created for ${createEnvironmentDto.propertyIdentifier}.`,
      createEnvironmentDto.createdBy,
      Source.MANAGER,
      JSON.stringify(environment)
    );
    return environment;
  }

  /* @internal
   * Delete environment for the property (only ephemeral environments deletion are allowed)
   * Start deleting the environment and the related application
   * Save the deleted environment and application details into activity stream
   */
  async deleteEnvironment(propertyIdentifier: string, env: string, createdBy?: string): Promise<any> {
    if (!env.includes('ephemeral'))
      this.exceptionService.badRequestException({ message: 'Only Ephemeral Environment can be deleted, please contact SPAship team.' });
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    if (!environment) this.exceptionService.badRequestException({ message: 'Property and Env not found.' });
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    const applications = await this.dataServices.application.getByAny({ propertyIdentifier, env });
    this.logger.log('Property', JSON.stringify(property));
    this.logger.log('Applications', JSON.stringify(applications));
    const operatorPayload = {
      name: env,
      websiteName: property.identifier,
      nameSpace: property.namespace,
      cmdbCode: this.environmentFactory.checkAndReturnCMDBCode(property.cmdbCode),
      websiteVersion: 'v1'
    };
    this.logger.log('OperatorPayload', JSON.stringify(operatorPayload));
    const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === environment.cluster);
    const deploymentConnection = (await this.dataServices.deploymentConnection.getByAny({ name: deploymentRecord.name }))[0];
    this.logger.log('DeploymentConnection', JSON.stringify(deploymentConnection));
    try {
      const response = await this.environmentFactory.deleteRequest(operatorPayload, deploymentConnection.baseurl);
      this.logger.log('OperatorResponse', JSON.stringify(response.data));
    } catch (err) {
      this.logger.error('DeletionErrorForStatic', err.message);
    }
    for (const app of applications) {
      if (app.isContainerized) {
        try {
          operatorPayload.name = `${app.identifier}-${env}`;
          const response = await this.environmentFactory.deleteRequest(operatorPayload, deploymentConnection.baseurl);
          this.logger.log('OperatorResponse', JSON.stringify(response.data));
        } catch (err) {
          this.logger.error('DeletionErrorForContainerized', err.message);
        }
      }
    }
    try {
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.ENV_DELETED,
        env,
        'NA',
        `${env} deleted for ${propertyIdentifier}`,
        createdBy,
        Source.MANAGER,
        JSON.stringify(environment)
      );
      for (const app of applications) {
        await this.analyticsService.createActivityStream(
          propertyIdentifier,
          Action.APPLICATION_DELETED,
          env,
          app.identifier,
          `${app.identifier} deleted for ${env} of ${propertyIdentifier}`,
          createdBy,
          Source.MANAGER,
          JSON.stringify(app)
        );
        await this.dataServices.application.delete({ propertyIdentifier, env, identifier: app.identifier });
      }
      await this.dataServices.environment.delete({ propertyIdentifier, env });
    } catch (err) {
      this.logger.error('DeletionError', err.message);
    }
    return { environment, applications };
  }

  /* @internal
   * Accept new configuration for the Sync
   * Update the new sync configuration for the particular environment
   */
  async syncEnvironment(syncEnvironment: SyncEnvironmentDto): Promise<Environment> {
    const { propertyIdentifier } = syncEnvironment;
    const { env } = syncEnvironment;
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    if (!environment) this.exceptionService.badRequestException({ message: 'Property and Env not found.' });
    const operatorPayload = JSON.parse(syncEnvironment.sync);
    this.logger.log('OperatorPayload', JSON.stringify(operatorPayload));
    const { property, deploymentConnection } = await this.environmentFactory.applicationService.getDeploymentConnection(propertyIdentifier, env);
    const applications = await this.dataServices.application.getByAny({ propertyIdentifier, env });
    this.logger.log('Applications', JSON.stringify(applications));
    for (const con of deploymentConnection) {
      try {
        const response = await this.environmentFactory.syncRequest(operatorPayload, con.baseurl, propertyIdentifier, env, property.namespace);
        this.logger.log('OperatorResponse', JSON.stringify(response.data));
      } catch (err) {
        this.exceptionService.internalServerErrorException(err.message);
      }
    }
    environment.sync = syncEnvironment.sync;
    environment.updatedBy = syncEnvironment.createdBy;
    try {
      await this.dataServices.environment.updateOne({ propertyIdentifier, env }, environment);
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.ENV_SYNCED,
        env,
        'NA',
        `${env} synced for ${propertyIdentifier}`,
        syncEnvironment.createdBy,
        Source.MANAGER,
        JSON.stringify(syncEnvironment.sync)
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return environment;
  }

  /* @internal
   * This will update the Environment
   */
  async updateEnvironment(createPropertyDto: CreateEnvironmentDto): Promise<Environment> {
    const { propertyIdentifier, env } = createPropertyDto;
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    if (!environment) this.exceptionService.badRequestException({ message: 'Property and Env not found.' });
    environment.cluster = createPropertyDto.cluster;
    environment.url = createPropertyDto.url;
    environment.updatedBy = createPropertyDto.createdBy;
    try {
      await this.dataServices.environment.updateOne({ propertyIdentifier, env }, environment);
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.ENV_UPDATED,
        env,
        'NA',
        `${env} updated for ${propertyIdentifier}`,
        createPropertyDto.createdBy,
        Source.MANAGER,
        JSON.stringify(createPropertyDto)
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return environment;
  }

  /* @internal
   * Update the symlink for the specific environment
   * Multi cluster symlink support is enabled
   */
  async updateSymlink(symlinkDTO: SymlinkDTO): Promise<Environment> {
    if (!symlinkDTO) this.exceptionService.badRequestException({ message: 'Please provide the value' });
    const { propertyIdentifier, env } = symlinkDTO;
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    if (!environment) this.exceptionService.badRequestException({ message: 'Environment not found.' });
    const { property, deploymentConnection } = await this.environmentFactory.applicationService.getDeploymentConnection(propertyIdentifier, env);
    if (!property || !deploymentConnection) this.exceptionService.badRequestException({ message: 'Property or Deployment Connection not found.' });
    symlinkDTO.source = this.environmentFactory.buildFolderPath(symlinkDTO.source);
    symlinkDTO.target = this.environmentFactory.buildFolderPath(symlinkDTO.target);
    const operatorPayload = this.environmentFactory.createOperatorSymlinkPayload(env, property, symlinkDTO);
    this.logger.log('OperatorPayload', JSON.stringify(operatorPayload));
    for (const con of deploymentConnection) {
      try {
        const response = await this.environmentFactory.symlinkRequest(operatorPayload, con.baseurl);
        this.logger.log('OperatorResponse', JSON.stringify(response.data));
        // @internal TODO : to be removed & error code to be fixed from the operator
        if (response.data.toString().includes('rm: cannot remove')) {
          this.exceptionService.badRequestException({
            message: 'Symlink creation failed. Target directory already present, Plaese check the distribution.'
          });
        }
      } catch (err) {
        this.exceptionService.badRequestException(err.message);
      }
    }
    const symlink = new Symlink();
    symlink.source = symlinkDTO.source;
    symlink.target = symlinkDTO.target;
    if (environment.symlink && environment.symlink.length) {
      const existingSymlink = environment.symlink.find((key) => key.source === symlinkDTO.source && key.target === symlinkDTO.target);
      if (!existingSymlink) environment.symlink = [...environment.symlink, symlink];
    } else environment.symlink = [symlink];
    try {
      await this.dataServices.environment.updateOne({ propertyIdentifier, env }, environment);
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.SYMLINK_CREATED,
        env,
        'NA',
        `symlink created for ${env} env of ${propertyIdentifier}`,
        symlinkDTO.createdBy,
        Source.MANAGER,
        JSON.stringify(symlinkDTO)
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return environment;
  }
}
