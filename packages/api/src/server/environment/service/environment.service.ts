import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { Source } from 'src/server/property/property.entity';
import { PropertyService } from 'src/server/property/service/property.service';
import { CreateEnvironmentDto } from '../environment.dto';
import { Environment } from '../environment.entity';
import { EnvironmentFactory } from './environment.factory';

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

  async getEnvironmentByProperty(propertyIdentifier: string, isEphReq: string): Promise<Environment[]> {
    let isEph = false;
    if (isEphReq === 'true') isEph = true;
    return this.dataServices.environment.getByAny({ propertyIdentifier, isEph });
  }

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
    await this.environmentFactory.initializeEnvironment(property, environment);
    await this.analyticsService.createActivityStream(createEnvironmentDto.propertyIdentifier, Action.ENV_CREATED, createEnvironmentDto.env);
    return environment;
  }

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
      name: environment.env,
      websiteName: property.identifier,
      nameSpace: property.namespace,
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
      this.exceptionService.internalServerErrorException(err.message);
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
      this.exceptionService.internalServerErrorException(err);
    }
    return { environment, applications };
  }
}
