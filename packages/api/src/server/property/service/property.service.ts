import { Injectable } from "@nestjs/common";
import { CreatePropertyDto } from "src/server/property/property.dto";
import { Property } from "src/repository/mongo/model";
import { IDataServices } from "src/repository/data-services.abstract";
import { ExceptionsService } from "src/server/exceptions/exceptions.service";
import { LoggerService } from "src/configuration/logger/logger.service";
import { response } from "express";
import { PropertyFactoryService } from "./property.factory";
import { PropertyResponseDto } from "../property.response.dto";

@Injectable()
export class PropertyUseCases {
  constructor(private dataServices: IDataServices,
    private propertyFactoryService: PropertyFactoryService,
    private loggerService: LoggerService,
    private exceptionService: ExceptionsService) { }

  getAllPropertys(): Promise<Property[]> {
    return this.dataServices.property.getAll();
  }

  async getProperty(propertyIdentifier: string): Promise<any> {

    const propertyResponse = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    const environmentResponse = await this.dataServices.environment.getByAny({ identifier: propertyIdentifier });

    const response = new PropertyResponseDto();
    response.title = propertyResponse.title;
    response.identifier = propertyResponse.identifier;
    response.createdBy = propertyResponse.createdBy;
    response.env = environmentResponse;

    return response;

  }

  async createProperty(createPropertyDto: CreatePropertyDto): Promise<any> {
    const checkProperty = await this.dataServices.environment.getByAny({ propertyIdentifier: createPropertyDto.identifier, env: createPropertyDto.env });
    if (checkProperty.length > 0) return this.exceptionService.badRequestException({ message: "Property & Environment already exist." });
    const [property, environment] = [...this.propertyFactoryService.createNewProperty(createPropertyDto)];
    const response = Promise.all([this.dataServices.property.create(property), this.dataServices.environment.create(environment)]);
    return response;
  }
}
