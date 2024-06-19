import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/entity';
import { AnalyticsService } from 'src/server/analytics/service';
import { EnvironmentFactory } from 'src/server/environment/service/factory';
import { ExceptionsService } from 'src/server/exceptions/service';
import { PermissionService } from 'src/server/permission/service';
import { CreatePropertyDto } from 'src/server/property/request.dto';
import { CMDBService } from 'src/server/sot/cmdb/service';
import { DeploymentRecord, Source } from '../entity';
import { PropertyResponseDto } from '../response.dto';
import { PropertyFactory } from './factory';

@Injectable()
export class PropertyService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly propertyFactory: PropertyFactory,
    private readonly environmentFactory: EnvironmentFactory,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
    private readonly analyticsService: AnalyticsService,
    private readonly permissionService: PermissionService,
    private readonly cmdbService: CMDBService
  ) {}

  private static readonly defaultSkip: number = 0;

  private static readonly defaultLimit: number = 1000;

  /* @internal
   * Get all the Property Details from the SPAship
   * It'll group the environments with the particular Property
   */
  async getAllProperties(skip: number = PropertyService.defaultSkip, limit: number = PropertyService.defaultLimit): Promise<PropertyResponseDto[]> {
    const propertyDetails = await this.dataServices.property.getByOptions({}, { identifier: 1 }, skip, limit);
    if (!propertyDetails) this.exceptionService.badRequestException({ message: 'No Property found.' });
    const environmentDetails = await this.dataServices.environment.getAll();
    const response: PropertyResponseDto[] = [];
    for (const prop of propertyDetails) {
      const groupedDetails = new PropertyResponseDto();
      groupedDetails.title = prop.title;
      groupedDetails.identifier = prop.identifier;
      groupedDetails.createdBy = prop.createdBy;
      groupedDetails.cmdbCode = prop.cmdbCode;
      groupedDetails.severity = prop.severity;
      groupedDetails.env = environmentDetails ? environmentDetails.filter((key) => key.propertyIdentifier === prop.identifier) : [];
      response.push(groupedDetails);
    }
    return response;
  }

  /* @internal
   * Get the property details based on the propertyIdentifier
   * It'll append the environment details linked with the particular property
   */
  async getPropertyDetails(propertyIdentifier: string): Promise<PropertyResponseDto> {
    const propertyResponse = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    if (!propertyResponse) this.exceptionService.badRequestException({ message: 'Property not found.' });
    const environmentResponse = await this.dataServices.environment.getByAny({ propertyIdentifier });
    const response = new PropertyResponseDto();
    response.title = propertyResponse.title;
    response.identifier = propertyResponse.identifier;
    response.createdBy = propertyResponse.createdBy;
    response.cmdbCode = propertyResponse.cmdbCode;
    response.severity = propertyResponse.severity;
    response.env = environmentResponse || [];
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
    if (createPropertyDto?.cmdbCode && createPropertyDto?.cmdbCode !== 'NA') {
      const validateCMDB = await this.cmdbService.getCMDBDetailsByCode(createPropertyDto.cmdbCode);
      if (!validateCMDB.length) this.exceptionService.badRequestException({ message: 'CMDB code is not valid.' });
    }
    const deploymentRecord = await this.getDeploymentRecord(createPropertyDto.cluster);
    const property = this.propertyFactory.createNewProperty(createPropertyDto, deploymentRecord);
    const environmentDTO = this.propertyFactory.transformToEnvironmentDTO(createPropertyDto);
    const environment = this.environmentFactory.createNewEnvironment(environmentDTO);
    await Promise.all([this.dataServices.property.create(property), this.dataServices.environment.create(environment)]);
    // @internal TODO : removing the auto initialization, to be discussed on it further
    // await this.environmentFactory.initializeEnvironment(property, environment);
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

  /* @internal
   * This will update the property
   * CMDB code and severity
   */
  async updateProperty(createPropertyDto: CreatePropertyDto): Promise<PropertyResponseDto> {
    const propertyDetails = (
      await this.dataServices.property.getByAny({
        identifier: createPropertyDto.identifier
      })
    )[0];
    if (!propertyDetails) this.exceptionService.badRequestException({ message: 'No Property Found.' });
    if (createPropertyDto?.cmdbCode && createPropertyDto?.cmdbCode !== 'NA') {
      const validateCMDB = await this.cmdbService.getCMDBDetailsByCode(createPropertyDto.cmdbCode);
      if (!validateCMDB.length) this.exceptionService.badRequestException({ message: 'CMDB code is not valid.' });
    }
    propertyDetails.title = createPropertyDto.title;
    propertyDetails.cmdbCode = createPropertyDto.cmdbCode;
    propertyDetails.severity = createPropertyDto.severity;
    try {
      await this.dataServices.property.updateOne({ identifier: propertyDetails.identifier }, propertyDetails);
      await this.analyticsService.createActivityStream(
        createPropertyDto.identifier,
        Action.PROPERTY_UPDATED,
        'NA',
        'NA',
        `${createPropertyDto.identifier} details updated`,
        createPropertyDto.createdBy,
        Source.MANAGER,
        JSON.stringify(createPropertyDto)
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return this.getPropertyDetails(createPropertyDto.identifier);
  }
}
