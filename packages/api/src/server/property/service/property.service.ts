import { Injectable } from "@nestjs/common";
import { CreatePropertyDto } from "src/server/property/property.dto";
import { Property } from "src/repository/mongo/model";
import { IDataServices } from "src/repository/data-services.abstract";
import { ExceptionsService } from "src/server/exceptions/exceptions.service";
import { LoggerService } from "src/configuration/logger/logger.service";
import { response } from "express";
import { CreateApplicationDto } from "src/server/application/application.dto";
import { ApplicationService } from "src/server/application/service/application.service";
import { PropertyFactory } from "./property.factory";
import { PropertyResponseDto } from "../property.response.dto";

@Injectable()
export class PropertyService {
  constructor(private dataServices: IDataServices,
    private propertyFactoryService: PropertyFactory,
    private loggerService: LoggerService,
    private exceptionService: ExceptionsService
  ) { }

  getAllProperties(): Promise<Property[]> {
    return this.dataServices.property.getAll();
  }

  async getPropertyDetails(propertyIdentifier: string): Promise<PropertyResponseDto> {
    const propertyResponse = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    const environmentResponse = await this.dataServices.environment.getByAny({ identifier: propertyIdentifier });
    const response = new PropertyResponseDto();
    response.title = propertyResponse.title;
    response.identifier = propertyResponse.identifier;
    response.createdBy = propertyResponse.createdBy;
    response.env = environmentResponse;
    return response;
  }

  async createProperty(createPropertyDto: CreatePropertyDto): Promise<PropertyResponseDto> {
    const checkProperty = await this.dataServices.environment.getByAny({ propertyIdentifier: createPropertyDto.identifier, env: createPropertyDto.env });
    if (checkProperty.length > 0) this.exceptionService.badRequestException({ message: "Property & Environment already exist." });
    const property = this.propertyFactoryService.createNewProperty(createPropertyDto);
    const environment = this.propertyFactoryService.createNewEnvironment(createPropertyDto);
    Promise.all([this.dataServices.property.create(property), this.dataServices.environment.create(environment)]);
    await this.propertyFactoryService.initializeEnvironment(property, environment);
    return this.getPropertyDetails(createPropertyDto.identifier);
  }

  async createEnvironment(createPropertyDto: CreatePropertyDto): Promise<PropertyResponseDto> {
    const checkPropertyAndEnv = await this.dataServices.environment.getByAny({ propertyIdentifier: createPropertyDto.identifier, env: createPropertyDto.env });
    const property = (await this.dataServices.property.getByAny({ identifier: createPropertyDto.identifier }))[0];
    if (checkPropertyAndEnv.length > 0) this.exceptionService.badRequestException({ message: "Property & Environment already exist." });
    if (!property) this.exceptionService.badRequestException({ message: "Please create the Property first." });
    const environment = this.propertyFactoryService.createNewEnvironment(createPropertyDto);
    Promise.all([this.dataServices.environment.create(environment)]);
    await this.propertyFactoryService.initializeEnvironment(property, environment);
    return this.getPropertyDetails(createPropertyDto.identifier);
  }
}
