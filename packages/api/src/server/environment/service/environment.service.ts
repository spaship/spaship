import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
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

  async getEnvironmentByProperty(propertyIdentifier: string): Promise<Environment[]> {
    return await this.dataServices.environment.getByAny({ propertyIdentifier, isEph: false });
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
}
