import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { DIRECTORY_CONFIGURATION } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { CreateApplicationDto } from 'src/server/application/application.dto';
import { ApplicationService } from 'src/server/application/service/application.service';
import { Environment } from 'src/server/environment/environment.entity';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { Property } from 'src/server/property/property.entity';
import { zip } from 'zip-a-folder';
import { CreateEnvironmentDto } from '../environment.dto';

@Injectable()
export class EnvironmentFactory {
  constructor(
    private readonly exceptionService: ExceptionsService,
    private readonly logger: LoggerService,
    private readonly applicationService: ApplicationService
  ) {}

  createNewEnvironment(createEnvironmentDto: CreateEnvironmentDto): Environment {
    const newEnvironment = new Environment();
    newEnvironment.propertyIdentifier = createEnvironmentDto.propertyIdentifier;
    newEnvironment.env = createEnvironmentDto.env;
    newEnvironment.url = createEnvironmentDto.url;
    newEnvironment.cluster = createEnvironmentDto.cluster;
    newEnvironment.createdBy = createEnvironmentDto.createdBy;
    this.logger.log('NewEnvironment', JSON.stringify(newEnvironment));
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

    this.logger.log('SpashipFile', JSON.stringify(spashipFile));
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
