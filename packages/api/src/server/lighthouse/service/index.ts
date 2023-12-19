import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/entity';
import { AnalyticsService } from 'src/server/analytics/service';
import { Application } from 'src/server/application/entity';
import { ApplicationService } from 'src/server/application/service';
import { ExceptionsService } from 'src/server/exceptions/service';
import { Property, Source } from 'src/server/property/entity';
import { LighthouseFactory } from './factory';

@Injectable()
export class LighthouseService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly logger: LoggerService,
    private readonly exceptionService: ExceptionsService,
    private readonly lighthouseFactory: LighthouseFactory,
    private readonly applicationService: ApplicationService,
    private readonly analyticsService: AnalyticsService
  ) {}

  async registerLighthouse(identifier: string): Promise<Property> {
    const propertyDetails = (await this.dataServices.property.getByAny({ identifier }))[0];
    if (!propertyDetails) this.exceptionService.badRequestException({ message: 'No Property Found.' });
    if (propertyDetails.lighthouseDetails)
      this.exceptionService.badRequestException({ message: 'This property is already registered in the lighthouse.' });
    let response;
    try {
      response = await this.lighthouseFactory.registerLighthouse({ name: identifier });
    } catch (err) {
      this.exceptionService.internalServerErrorException(err.message);
    }
    propertyDetails.lighthouseDetails = response;
    try {
      await this.dataServices.property.updateOne({ identifier: propertyDetails.identifier }, propertyDetails);
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return propertyDetails;
  }

  async generateLighthouseReport(
    propertyIdentifier: string,
    env: string,
    identifier: string,
    isContainerized: boolean,
    isGit: boolean,
    createdBy: string
  ): Promise<Application> {
    const environment = (await this.dataServices.environment.getByAny({ propertyIdentifier, env }))[0];
    if (!environment) this.exceptionService.badRequestException({ message: 'Invalid Property & Environment.' });
    const application = (await this.dataServices.application.getByAny({ propertyIdentifier, env, identifier, isContainerized, isGit }))[0];
    if (!application) this.exceptionService.badRequestException({ message: 'Application not found' });
    const property = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    try {
      // @internal as both of the deployment will be identical so we'll generate the report for one only
      this.logger.log('checkApplicationStatus', application.routerUrl[0]);
      await this.applicationService.checkApplicationStatus(application.routerUrl[0]);
    } catch (error) {
      this.exceptionService.badRequestException({ message: 'Cannot generate the Lighthouse Report, Application is currently down.' });
    }
    if (!property.lighthouseDetails) {
      this.logger.log('propertyDetails - check', 'checking registerLighthouse');
      // @internal if the property is not registered with the lighthouse then we'll register it with the lighthouse report portal
      const result = await this.registerLighthouse(property.identifier);
      property.lighthouseDetails = result.lighthouseDetails;
    }
    const lhIdentifier = this.lighthouseFactory.generateLighthouseIdentifier(identifier, env, isContainerized, isGit);
    const lighthouseRequest = this.lighthouseFactory.createLighthouseRequest(
      lhIdentifier,
      application.env,
      application.routerUrl[0],
      property.lighthouseDetails.token
    );
    try {
      const response = await this.lighthouseFactory.generateLighthouseReport(lighthouseRequest);
      application.pipelineDetails = application.pipelineDetails ? [...application.pipelineDetails, response] : [response];
      await this.dataServices.application.updateOne({ propertyIdentifier, env, identifier, isContainerized, isGit }, application);
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.LIGHTHOUSE_REPORT_GENEARATION_STARTED,
        env,
        application.identifier,
        `Report Generation started for ${application.identifier}.`,
        createdBy,
        Source.MANAGER,
        JSON.stringify(response)
      );
    } catch (error) {
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.LIGHTHOUSE_REPORT_GENEARATION_FAILED,
        env,
        application.identifier,
        `Report Generation Failed for ${application.identifier}.`,
        createdBy,
        Source.MANAGER,
        JSON.stringify(lighthouseRequest)
      );
      this.exceptionService.badRequestException({ message: 'Pipeline trigger Failed.' });
    }
    return application;
  }

  async getlighthouseReport(
    propertyIdentifier: string,
    env: string,
    identifier: string,
    buildId: string,
    isContainerized: boolean = false,
    isGit: boolean = false
  ): Promise<any> {
    const lhIdentifier = this.lighthouseFactory.generateLighthouseIdentifier(identifier, env, isContainerized, isGit);
    const propertyDetails = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    if (!propertyDetails) this.exceptionService.badRequestException({ message: 'No Property Found.' });
    this.logger.log('propertyDetails - check', JSON.stringify(propertyDetails));
    if (!propertyDetails.lighthouseDetails)
      this.exceptionService.badRequestException({ message: 'This property is not registered with lighthouse.' });
    let reposne;
    this.logger.log('propertyDetails', JSON.stringify(propertyDetails));
    if (buildId) {
      try {
        reposne = await this.lighthouseFactory.getLighthouseReportDetails(propertyDetails.lighthouseDetails.id, buildId);
        return this.lighthouseFactory.buildLighthouseReportResponse(reposne, propertyIdentifier, identifier, env);
      } catch (error) {
        this.logger.error('getlighthouseReportDetails', error);
        this.exceptionService.internalServerErrorException(error);
      }
    }
    try {
      reposne = await this.lighthouseFactory.getLighthouseReportList(propertyDetails.lighthouseDetails.id, lhIdentifier);
    } catch (error) {
      this.logger.error('getlighthouseReportList', error);
      this.exceptionService.internalServerErrorException(error);
    }
    return this.lighthouseFactory.buildLighthouseReportResponse(reposne, propertyIdentifier, identifier, env);
  }
}
