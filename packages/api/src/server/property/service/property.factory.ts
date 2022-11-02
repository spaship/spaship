import { Injectable } from "@nestjs/common";
import { LoggerService } from "src/configuration/logger/logger.service";
import { IDataServices } from "src/repository/data-services.abstract";
import { ExceptionsService } from "src/server/exceptions/exceptions.service";
import { CreatePropertyDto } from "src/server/property/property.dto";
import { Environment } from "../environment.entity";
import { DeploymentConnectionRecord, Property } from "../property.entity";

@Injectable()
export class PropertyFactoryService {

  constructor(private dataServices: IDataServices,
    private exceptionService: ExceptionsService,
    private loggerService: LoggerService
  ) { }

  createNewProperty(createPropertyDto: CreatePropertyDto): [Property, Environment] {
    const newProperty = new Property();
    newProperty.title = createPropertyDto.title;
    newProperty.identifier = createPropertyDto.identifier;
    newProperty.namespace = `spaship--${createPropertyDto.identifier}`;
    newProperty.createdBy = createPropertyDto.createdBy;

    const newDeploymentConnection = new DeploymentConnectionRecord();
    newDeploymentConnection.deploymentConnectionName = "west2";
    newDeploymentConnection.cluster = "preprod";
    newProperty.deploymentConnectionRecord = [newDeploymentConnection];

    const newEnvironment = new Environment();
    newEnvironment.propertyIdentifier = createPropertyDto.identifier;
    newEnvironment.env = createPropertyDto.env;
    newEnvironment.url = createPropertyDto.url;
    newEnvironment.cluster = createPropertyDto.cluster;
    newEnvironment.createdBy = createPropertyDto.createdBy;

    this.loggerService.log("NewProperty", JSON.stringify(newProperty));
    this.loggerService.log("NewEnvironment", JSON.stringify(newEnvironment));

    return [newProperty, newEnvironment];
  }


}