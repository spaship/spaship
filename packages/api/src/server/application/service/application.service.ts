import { Injectable } from '@nestjs/common';
import * as extract from 'extract-zip';
import * as FormData from 'form-data';
import * as fs from 'fs';
import * as path from 'path';
import { DIRECTORY_CONFIGURATION, EPHEMERAL_ENV } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { AgendaService, JOB } from 'src/server/agenda/agenda.service';
import { Action } from 'src/server/analytics/activity-stream.entity';
import { AnalyticsService } from 'src/server/analytics/service/analytics.service';
import { Application } from 'src/server/application/application.entity';
import { ExceptionsService } from 'src/server/exceptions/exceptions.service';
import { Source } from 'src/server/property/property.entity';
import { CreateApplicationDto } from '../application.dto';
import { ApplicationFactory } from './application.factory';

@Injectable()
/** @internal ApplicationService is for depenedent operations on database */
export class ApplicationService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly logger: LoggerService,
    private readonly applicationFactory: ApplicationFactory,
    private readonly exceptionService: ExceptionsService,
    private readonly analyticsService: AnalyticsService,
    private readonly agendaService: AgendaService
  ) {}

  getAllApplications(): Promise<Application[]> {
    return this.dataServices.application.getAll();
  }

  getApplicationsByProperty(propertyIdentifier: string): Promise<Application[]> {
    return this.dataServices.application.getByAny({ propertyIdentifier });
  }

  async saveApplication(
    applicationRequest: CreateApplicationDto,
    applicationPath: string,
    propertyIdentifier: string,
    env: string
  ): Promise<Application> {
    const identifier = this.applicationFactory.getIdentifier(applicationRequest.name);
    if (this.applicationFactory.isEphemeral(applicationRequest)) {
      const actionEnabled = !!applicationRequest.actionId;
      const { actionId } = applicationRequest;
      const ephemeral = (await this.dataServices.environment.getByAny({ propertyIdentifier, actionEnabled: true, actionId, isActive: true }))[0];
      if (ephemeral) {
        env = ephemeral.env;
        this.logger.log('Epehemral', JSON.stringify(ephemeral));
      } else {
        const tmpEph = this.applicationFactory.createEphemeralPreview(propertyIdentifier, actionEnabled, actionId, 'NA');
        await this.dataServices.environment.create(tmpEph);
        this.logger.log('NewEpehemral', JSON.stringify(tmpEph));
        env = tmpEph.env;
      }
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.ENV_CREATED,
        env,
        'NA',
        `${env} created for ${propertyIdentifier}.`,
        'NA',
        Source.CLI
      );
    }
    try {
      await this.deployApplication(applicationRequest, applicationPath, propertyIdentifier, env);
    } catch (err) {
      this.exceptionService.internalServerErrorException(err.message);
    }
    const applicationDetails = (await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier }))[0];
    await this.analyticsService.createActivityStream(
      propertyIdentifier,
      Action.APPLICATION_DEPLOYMENT_STARTED,
      env,
      applicationRequest.name,
      `Deployment started for ${applicationRequest.name} at ${env}`,
      'NA',
      Source.CLI
    );
    if (this.applicationFactory.isEphemeral(applicationRequest)) {
      const expiresIn = Number(EPHEMERAL_ENV.expiresIn);
      const scheduledDate = new Date();
      scheduledDate.setSeconds(scheduledDate.getSeconds() + expiresIn);
      const agendaResponse = await this.agendaService.agenda.schedule(scheduledDate, JOB.DELETE_EPH_ENV, {
        propertyIdentifier,
        env
      });
      this.logger.log('Agenda', JSON.stringify(agendaResponse));
    }
    if (!applicationDetails) {
      const saveApplication = await this.applicationFactory.createApplicationRequest(propertyIdentifier, applicationRequest, identifier, env);
      this.logger.log('NewApplicationDetails', JSON.stringify(saveApplication));
      return this.dataServices.application.create(saveApplication);
    }
    applicationDetails.nextRef = applicationRequest.ref;
    applicationDetails.name = applicationRequest.name;
    this.logger.log('UpdatedApplicationDetails', JSON.stringify(applicationDetails));
    await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier }, applicationDetails);
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
    const zipPath = await this.applicationFactory.createTemplateAndZip(appPath, ref, name, tmpDir, propertyIdentifier, env, property.namespace);
    const formData: any = new FormData();
    try {
      const fileStream = await fs.createReadStream(zipPath);
      formData.append('spa', fileStream);
      formData.append('description', `${propertyIdentifier}_${env}`);
      formData.append('website', propertyIdentifier);
      const response = await this.applicationFactory.deploymentRequest(formData, deploymentConnection.baseurl);
      this.logger.log('OperatorResponse', JSON.stringify(response.data));
      return response;
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
  }
}
