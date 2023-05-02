import { Injectable } from '@nestjs/common';
import { DEPLOYMENT_DETAILS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { CreateEnvironmentDto } from 'src/server/environment/environment.dto';
import { CreatePropertyDto } from 'src/server/property/property.dto';
import { DeploymentRecord, Property } from '../property.entity';

@Injectable()
export class PropertyFactory {
  constructor(private readonly logger: LoggerService) {}

  createNewProperty(createPropertyDto: CreatePropertyDto, deploymentRecord: DeploymentRecord): Property {
    const newProperty = new Property();
    newProperty.title = createPropertyDto.title || createPropertyDto.identifier;
    newProperty.identifier = createPropertyDto.identifier;
    newProperty.namespace = `${DEPLOYMENT_DETAILS.namespace}--${createPropertyDto.identifier}`;
    newProperty.createdBy = createPropertyDto.createdBy;
    newProperty.updatedBy = createPropertyDto.createdBy;
    newProperty.deploymentRecord = [deploymentRecord];
    this.logger.log('NewProperty', JSON.stringify(newProperty));
    return newProperty;
  }

  transformToEnvironmentDTO(createPropertyDto: CreatePropertyDto): CreateEnvironmentDto {
    const environmentDTO = new CreateEnvironmentDto();
    environmentDTO.propertyIdentifier = createPropertyDto.identifier;
    environmentDTO.env = createPropertyDto.env;
    environmentDTO.url = createPropertyDto.url;
    environmentDTO.cluster = createPropertyDto.cluster;
    environmentDTO.createdBy = createPropertyDto.createdBy;
    this.logger.log('CreateEnvironmentDto', JSON.stringify(environmentDTO));
    return environmentDTO;
  }
}
