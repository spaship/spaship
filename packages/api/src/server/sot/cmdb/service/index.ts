import { Injectable } from '@nestjs/common';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action } from 'src/server/analytics/entity';
import { AnalyticsService } from 'src/server/analytics/service';
import { Application } from 'src/server/application/entity';
import { EnvironmentFactory } from 'src/server/environment/service/factory';
import { ExceptionsService } from 'src/server/exceptions/service';
import { Property, Source } from 'src/server/property/entity';
import { CMDBDTO, CMDBResponse } from '../dto';
import { CMDBFactory } from './factory';

@Injectable()
export class CMDBService {
  constructor(
    private readonly cmdbFactory: CMDBFactory,
    private readonly dataServices: IDataServices,
    private readonly exceptionService: ExceptionsService,
    private readonly analyticsService: AnalyticsService,
    private readonly environmentFactory: EnvironmentFactory
  ) {}

  /* @internal
   *  Search the Details from CMDB
   *  Details will be searched from the CMDB
   *  Transform the response to CMDB Details
   */
  async getCMDBDetailsByCode(key: string): Promise<CMDBResponse[]> {
    return this.cmdbFactory.getCMDBDetails(`u_application_id=${key}`);
  }

  /* @internal
   *  Search the Details from CMDB
   *  Details will be searched from the CMDB
   *  Transform the response to CMDB Details
   */
  async getCMDBDetailsByName(key: string): Promise<CMDBResponse[]> {
    return this.cmdbFactory.getCMDBDetails(`name=${key}`);
  }

  /* @internal
   * Update CMDB code for specifc applications
   */
  async updateApplicationCMDBCode(cmdbRequest: CMDBDTO): Promise<Application[]> {
    const { applicationIdentifier } = cmdbRequest;
    const { propertyIdentifier } = cmdbRequest;
    const search = {
      identifier: applicationIdentifier,
      propertyIdentifier
    };
    const applicationDetails = await this.dataServices.application.getByAny(search);
    if (!applicationDetails) this.exceptionService.badRequestException({ message: 'Application not found.' });
    for (const application of applicationDetails) {
      application.cmdbCode = cmdbRequest.cmdbCode;
      application.severity = cmdbRequest.severity;
      await this.dataServices.application.updateOne(
        {
          propertyIdentifier,
          env: application.env,
          identifier: applicationIdentifier,
          isContainerized: application.isContainerized,
          isGit: application.isGit
        },
        application
      );
    }
    try {
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.CMDB_UPDATED,
        'NA',
        applicationIdentifier,
        `${applicationIdentifier} CMDB Code updated`,
        cmdbRequest.createdBy,
        Source.MANAGER,
        JSON.stringify(cmdbRequest)
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    return applicationDetails;
  }

  /* @internal
   * Update CMDB code for property
   * Update the CMDB code for the applications which share similar codes with the property
   */
  async updatePropertyCMDBCode(cmdbRequest: CMDBDTO): Promise<Property> {
    const { propertyIdentifier } = cmdbRequest;
    const propertyDetails = (await this.dataServices.property.getByAny({ identifier: propertyIdentifier }))[0];
    if (!propertyDetails) this.exceptionService.badRequestException({ message: 'Property not found.' });
    const envDetails = await this.dataServices.environment.getByAny({ propertyIdentifier });
    if (!envDetails) this.exceptionService.badRequestException({ message: `No related Environment found for ${propertyIdentifier}.` });
    const previousCMDB = propertyDetails.cmdbCode;
    propertyDetails.cmdbCode = cmdbRequest.cmdbCode;
    propertyDetails.severity = cmdbRequest.severity;
    if (previousCMDB !== cmdbRequest.cmdbCode) {
      await this.dataServices.property.updateOne({ identifier: propertyIdentifier }, propertyDetails);
      const { buildEnvironment, orginalFileName, zipPath } = await this.environmentFactory.getArchivePath(propertyDetails, envDetails[0]);
      for (const env of envDetails) {
        try {
          await this.environmentFactory.configureEnvironment(buildEnvironment, orginalFileName, zipPath, propertyDetails, env, true);
        } catch (err) {
          propertyDetails.cmdbCode = previousCMDB;
          await this.dataServices.property.updateOne({ identifier: propertyIdentifier }, propertyDetails);
          this.exceptionService.internalServerErrorException(err);
        }
      }
    }
    try {
      await this.analyticsService.createActivityStream(
        propertyIdentifier,
        Action.CMDB_UPDATED,
        'NA',
        'NA',
        `${propertyIdentifier} CMDB Code Updated`,
        cmdbRequest.createdBy,
        Source.MANAGER,
        JSON.stringify(cmdbRequest)
      );
    } catch (err) {
      this.exceptionService.internalServerErrorException(err);
    }
    if (cmdbRequest.autoCMDBUpdate) {
      const applications = await this.dataServices.application.getByAny({ propertyIdentifier });
      for (const application of applications) {
        if (application.cmdbCode === previousCMDB) {
          application.cmdbCode = cmdbRequest.cmdbCode;
          await this.dataServices.application.updateOne(
            {
              propertyIdentifier,
              env: application.env,
              identifier: application.identifier,
              isContainerized: application.isContainerized,
              isGit: application.isGit
            },
            application
          );
        }
      }
    }
    return propertyDetails;
  }
}
