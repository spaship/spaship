import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DIRECTORY_CONFIGURATION } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { CreateApplicationDto } from 'src/server/application/application.dto';
import { ApplicationService } from 'src/server/application/service/application.service';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { CreatePropertyDto } from 'src/server/property/property.dto';
import { zip } from 'zip-a-folder';
import { Environment } from '../environment.entity';
import { DeploymentRecord, Property } from '../property.entity';

@Injectable()
export class PropertyFactory {
  constructor(private exceptionService: ExceptionsService, private loggerService: LoggerService, private applicationService: ApplicationService) {}

  createNewProperty(createPropertyDto: CreatePropertyDto, deploymentRecord: DeploymentRecord): Property {
    const newProperty = new Property();
    newProperty.title = createPropertyDto.title || createPropertyDto.identifier;
    newProperty.identifier = createPropertyDto.identifier;
    newProperty.namespace = `spaship--${createPropertyDto.identifier}`;
    newProperty.createdBy = createPropertyDto.createdBy;
    newProperty.deploymentRecord = [deploymentRecord];
    this.loggerService.log('NewProperty', JSON.stringify(newProperty));
    return newProperty;
  }

  createNewEnvironment(createPropertyDto: CreatePropertyDto): Environment {
    const newEnvironment = new Environment();
    newEnvironment.propertyIdentifier = createPropertyDto.identifier;
    newEnvironment.env = createPropertyDto.env;
    newEnvironment.url = createPropertyDto.url;
    newEnvironment.cluster = createPropertyDto.cluster;
    newEnvironment.createdBy = createPropertyDto.createdBy;
    this.loggerService.log('NewEnvironment', JSON.stringify(newEnvironment));
    return newEnvironment;
  }

  async initializeEnvironment(propertyRequest: Property, environmentRequest: Environment): Promise<any> {
    const initializeEnvironment = new CreateApplicationDto();
    initializeEnvironment.name = 'envInit';
    initializeEnvironment.ref = '0.0.0';
    initializeEnvironment.path = '.';

    const spashipFile = {
      websiteVersion: 'v1',
      websiteName: propertyRequest.identifier,
      name: initializeEnvironment.name,
      mapping: initializeEnvironment.path,
      environments: [{ name: environmentRequest.env, updateRestriction: false, exclude: false, ns: propertyRequest.namespace }]
    };

    this.loggerService.log('SpashipFile', JSON.stringify(spashipFile));
    const { baseDir } = DIRECTORY_CONFIGURATION;
    const fileOriginalName = propertyRequest.identifier;
    const tmpDir = `${baseDir}/${fileOriginalName.split('.')[0]}-${Date.now()}`;
    await fs.mkdirSync(`${tmpDir}`, { recursive: true });
    await fs.writeFileSync(path.join(tmpDir, 'spaship.txt'), JSON.stringify(spashipFile, null, '\t'));
    const zipPath = path.join(tmpDir, `../SPAship${Date.now()}.zip`);
    await zip(tmpDir, zipPath);
    try {
      const response = await this.applicationService.deployApplication(
        initializeEnvironment,
        zipPath,
        propertyRequest.identifier,
        environmentRequest.env
      );
      return response;
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
  }
}
