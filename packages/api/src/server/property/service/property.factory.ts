import { Injectable } from '@nestjs/common';
import { DEPLOYMENT_DETAILS, LIGHTHOUSE_DETAILS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { CreateEnvironmentDto } from 'src/server/environment/environment.dto';
import { CreatePropertyDto } from 'src/server/property/property.dto';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { AuthFactory } from 'src/server/auth/auth.factory';
import { HttpService } from '@nestjs/axios';
import { DeploymentRecord, Property } from '../property.entity';

@Injectable()
export class PropertyFactory {
  constructor(
    private readonly logger: LoggerService,
    private readonly httpService: HttpService,
    private readonly exceptionService: ExceptionsService
  ) {}

  createNewProperty(createPropertyDto: CreatePropertyDto, deploymentRecord: DeploymentRecord): Property {
    const newProperty = new Property();
    newProperty.title = createPropertyDto.title || createPropertyDto.identifier;
    newProperty.identifier = createPropertyDto.identifier;
    newProperty.namespace = `${DEPLOYMENT_DETAILS.namespace}--${createPropertyDto.identifier}`;
    newProperty.cmdbCode = createPropertyDto.cmdbCode || 'NA';
    newProperty.severity = createPropertyDto.severity || 'NA';
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

  // @internal Update the secret for a Containerized application
  async registerLighthouse(request: Object): Promise<Object> {
    if (!request) this.exceptionService.badRequestException({ message: 'Please provide the request body' });
    let response;
    const headers = { Authorization: await AuthFactory.getAccessToken() };
    try {
      response = await this.httpService.axiosRef.post(`${LIGHTHOUSE_DETAILS.hostUrl}/v1/projects`, request, {
        maxBodyLength: Infinity,
        headers
      });
      this.logger.log('registerLighthouseProperty', JSON.stringify(response.data));
    } catch (err) {
      this.logger.error('registerLighthouseProperty', err);
      this.exceptionService.internalServerErrorException(err);
    }
    return response.data;
  }
}
