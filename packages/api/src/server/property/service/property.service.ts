import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Property } from 'src/repository/mongo/model';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { EnvironmentFactory } from 'src/server/environment/service/environment.factory';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { PermissionService } from 'src/server/permission/service/permission.service';
import { CreatePropertyDto } from 'src/server/property/property.dto';
import { DeploymentRecord } from '../property.entity';
import { PropertyResponseDto } from '../property.response.dto';
import { PropertyFactory } from './property.factory';

@Injectable()
export class PropertyService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly propertyFactory: PropertyFactory,
    private readonly environmentFactory: EnvironmentFactory,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
    private readonly analyticsService: AnalyticsService,
    private readonly permissionService: PermissionService
  ) {}

  getAllProperties(): Promise<Property[]> {
    return this.dataServices.property.getAll();
  }

  /* @internal
   * Get the property details based on the propertyIdentifier
   * It'll append the environment details linked with the particular property
   */
  async getPropertyDetails(propertyIdentifier: string): Promise<PropertyResponseDto> {
    const propertyResponse = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    const environmentResponse = await this.dataServices.environment.getByAny({ propertyIdentifier });
    const response = new PropertyResponseDto();
    response.title = propertyResponse.title;
    response.identifier = propertyResponse.identifier;
    response.createdBy = propertyResponse.createdBy;
    response.env = environmentResponse;
    return response;
  }

  /* @internal
   * This will create the property
   * Transform the request to property and environment entity
   * Initialize the deployment record for the new property
   * Save the details related to property
   */
  async createProperty(createPropertyDto: CreatePropertyDto): Promise<PropertyResponseDto> {
    const checkProperty = await this.dataServices.property.getByAny({
      identifier: createPropertyDto.identifier
    });
    if (checkProperty.length > 0) this.exceptionService.badRequestException({ message: 'Property already exist.' });
    const deploymentRecord = await this.getDeploymentRecord(createPropertyDto.cluster);
    const property = this.propertyFactory.createNewProperty(createPropertyDto, deploymentRecord);
    const environmentDTO = this.propertyFactory.transformToEnvironmentDTO(createPropertyDto);
    const environment = this.environmentFactory.createNewEnvironment(environmentDTO);
    await Promise.all([this.dataServices.property.create(property), this.dataServices.environment.create(environment)]);
    await this.environmentFactory.initializeEnvironment(property, environment);
    await this.permissionService.provideInitialAccess(property.identifier, createPropertyDto.createdBy, createPropertyDto.creatorName);
    await this.analyticsService.createActivityStream(createPropertyDto.identifier, Action.PROPERTY_CREATED);
    await this.analyticsService.createActivityStream(createPropertyDto.identifier, Action.ENV_CREATED, createPropertyDto.env);
    return this.getPropertyDetails(createPropertyDto.identifier);
  }

  /* @internal
   * This function will provide the deployment records for a particular Property
   * If it has the deployment-connection mapping for the particular cluster
   */
  async getDeploymentRecord(cluster: string) {
    const deploymentConnection = await this.dataServices.deploymentConnection.getByAny({ cluster });
    const deploymentRecord = new DeploymentRecord();
    if (deploymentConnection.length === 1) {
      deploymentRecord.name = deploymentConnection[0].name;
      deploymentRecord.cluster = cluster;
    } else {
      deploymentConnection.sort((a, b) => a.weight - b.weight);
      const nextDeploymentConnection = deploymentConnection[0];
      nextDeploymentConnection.weight += 1;
      this.logger.log('NextDeploymentConnection', JSON.stringify(nextDeploymentConnection));
      deploymentRecord.name = deploymentConnection[0].name;
      deploymentRecord.cluster = cluster;
      await this.dataServices.deploymentConnection.updateOne({ name: nextDeploymentConnection.name }, nextDeploymentConnection);
    }
    this.logger.log('DeploymentRecord', JSON.stringify(deploymentRecord));
    return deploymentRecord;
  }
}
