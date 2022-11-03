import { Injectable } from '@nestjs/common';
import * as extract from 'extract-zip';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { DIRECTORY_CONFIGURATION } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Application } from 'src/server/application/application.entity';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { CreateApplicationDto } from '../application.dto';
import { ApplicationFactory } from './application.factory';

@Injectable()
/** @internal ApplicationService is for depenedent operations on database */
export class ApplicationService {
  constructor(
    private dataServices: IDataServices,
    private logger: LoggerService,
    private applicationFactoryService: ApplicationFactory,
    private exceptionService: ExceptionsService
  ) {}

  getAllApplications(): Promise<Application[]> {
    return this.dataServices.applications.getAll();
  }

  getApplicationsByProperty(propertyIdentifier: string): Promise<Application[]> {
    return this.dataServices.applications.getByAny({ propertyIdentifier });
  }

  async saveApplication(
    applicationRequest: CreateApplicationDto,
    applicationPath: string,
    propertyIdentifier: string,
    env: string
  ): Promise<Application> {
    const identifier = this.applicationFactoryService.getIdentifier(applicationRequest.name);
    await this.deployApplication(applicationRequest, applicationPath, propertyIdentifier, env);
    const applicationDetails = (await this.dataServices.applications.getByAny({ propertyIdentifier, env, identifier }))[0];
    if (!applicationDetails) {
      const saveApplication = await this.applicationFactoryService.createApplicationRequest(propertyIdentifier, applicationRequest, identifier, env);
      this.logger.log('NewApplicationDetails', JSON.stringify(saveApplication));
      return this.dataServices.applications.create(saveApplication);
    }
    applicationDetails.nextRef = applicationRequest.ref;
    applicationDetails.name = applicationRequest.name;
    this.logger.log('UpdatedApplicationDetails', JSON.stringify(applicationDetails));
    await this.dataServices.applications.updateOneByAny({ propertyIdentifier, env, identifier }, applicationDetails);
    return applicationDetails;
  }

  async deployApplication(applicationRequest: CreateApplicationDto, applicationPath: string, propertyIdentifier: string, env: string): Promise<any> {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (!environment) this.exceptionService.badRequestException({ message: 'Invalid Property & Environment. Please check the Deployment URL.' });
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    this.logger.log('Environment', JSON.stringify(environment));
    this.logger.log('Property', JSON.stringify(property));
    const deploymentRecord = property.deploymentRecord.find((data) => data.cluster === environment.cluster);
    const deploymentConnection = (
      await this.dataServices.deploymentConnection.getByAny({
        name: deploymentRecord.name
      })
    )[0];
    this.logger.log('DeploymentConnection', JSON.stringify(deploymentConnection));
    const { name, ref } = applicationRequest;
    const appPath = applicationRequest.path;
    this.logger.log('ApplicationRequest', JSON.stringify(applicationRequest));
    const { baseDir } = DIRECTORY_CONFIGURATION;
    const tmpDir = `${baseDir}/${name.split('.')[0]}-${Date.now()}-extracted`;
    await fs.mkdirSync(`${tmpDir}`, { recursive: true });
    await extract(path.resolve(applicationPath), { dir: path.resolve(tmpDir) });
    const zipPath = await this.applicationFactoryService.createTemplateAndZip(
      appPath,
      ref,
      name,
      tmpDir,
      propertyIdentifier,
      env,
      property.namespace
    );
    const formData: any = new FormData();
    try {
      const fileStream = await fs.createReadStream(zipPath);
      formData.append('spa', fileStream);
      formData.append('description', `${propertyIdentifier}_${env}`);
      formData.append('website', propertyIdentifier);
      const response = await this.applicationFactoryService.deploymentRequest(formData, deploymentConnection.baseurl);
      this.logger.log('OperatorResponse', JSON.stringify(response.data));
      return response;
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
  }
}
