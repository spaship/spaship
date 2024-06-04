import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/service';
import { ApplicationService } from 'src/server/application/service';
import { DEPLOYMENT_DETAILS } from 'src/configuration';
import { ApplicationDetails, EnvironmentDetails, ReportDetails } from '../response.dto';

@Injectable()
export class ReportFactory {
  constructor(private readonly logger: LoggerService, readonly applicationService: ApplicationService) {}

  async getReportQuerty(): Promise<Object> {
    const group = {
      _id: {
        propertyIdentifier: '$propertyIdentifier',
        env: '$env'
      },
      data: {
        $push: {
          identifier: '$identifier',
          name: '$name',
          path: '$path',
          ref: '$ref',
          routerUr: '$routerUrl',
          cmdbCode: '$cmdbCode',
          severity: '$severity',
          isContainerized: '$isContainerized',
          isGit: '$isGit',
          createdBy: '$createdBy',
          updatedBy: '$updatedBy',
          createdAt: '$createdAt',
          updatedAt: '$updatedAt'
        }
      }
    };
    const project = { _id: 0, propertyIdentifier: '$_id.propertyIdentifier', env: '$_id.env', data: 1 };
    const query = [{ $group: group }, { $project: project }];
    return query;
  }

  async processReport(properties, data, exclude) {
    const podlist = 'podlist';
    const response = [];
    for (const property of properties) {
      const reportDetails = new ReportDetails();
      reportDetails.propertyName = property.identifier;
      reportDetails.namespace = property.identifier;
      reportDetails.cmdbCode = property.cmdbCode;
      reportDetails.severity = property.identifier;
      const environments = [];
      for (const env of property.env) {
        const envDetails = new EnvironmentDetails();
        envDetails.identifier = env.env;
        envDetails.url = env.url;
        envDetails.cluster = env.cluster;
        let result = data.filter((key) => key.env === env.env && key.propertyIdentifier === property.identifier);
        result = result.length !== 0 ? result[0].data : [];
        const applications = [];
        for (const application of result) {
          const appDetails = new ApplicationDetails();
          appDetails.identifier = application.identifier;
          appDetails.path = application.path;
          appDetails.ref = application.ref;
          appDetails.routerUrl = application.routerUrl;
          appDetails.cmdbCode = application.cmdbCode;
          appDetails.severity = application.severity;
          appDetails.createdBy = application.createdBy;
          appDetails.updatedBy = application.updatedBy;
          appDetails.createdAt = application.createdAt;
          appDetails.updatedAt = application.updatedAt;
          if (exclude !== podlist && application.isContainerized) {
            let podList = await this.applicationService.getListOfPods(
              property.identifier,
              envDetails.identifier,
              application.identifier,
              DEPLOYMENT_DETAILS.type.containerized
            );
            podList = podList.filter((item) => typeof item !== 'string');
            envDetails.podlist = envDetails.podlist ? [...envDetails.podlist, ...podList] : [...podList];
          }
          applications.push(appDetails);
        }
        envDetails.applications = applications;
        if (exclude !== podlist) {
          let podList = await this.applicationService.getListOfPods(property.identifier, envDetails.identifier, 'NA', DEPLOYMENT_DETAILS.type.static);
          podList = podList.filter((item) => typeof item !== 'string');
          envDetails.podlist = envDetails.podlist ? [...envDetails.podlist, ...podList] : [...podList];
        }
        environments.push(envDetails);
      }
      reportDetails.environments = environments;
      response.push(reportDetails);
    }
    return response;
  }
}
