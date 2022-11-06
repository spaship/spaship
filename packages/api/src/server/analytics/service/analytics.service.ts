import { Injectable } from '@nestjs/common';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { Action, ActivityStream, Props } from '../activity-stream.entity';
import { AnalyticsFactory } from './analytics.factory';

@Injectable()
export class AnalyticsService {
  constructor(
    private readonly dataServices: IDataServices,
    private readonly analyticsFactory: AnalyticsFactory,
    private readonly logger: LoggerService
  ) {}

  createActivityStream(
    propertyIdentifier: string,
    action: string,
    env?: string,
    applicationIdentifier?: string,
    message?: string,
    createdBy?: string,
    source?: string,
    payload?: string
  ): Promise<ActivityStream> {
    const activityStream = new ActivityStream();
    const props = new Props();
    activityStream.propertyIdentifier = propertyIdentifier;
    activityStream.action = action;
    props.applicationIdentifier = applicationIdentifier || 'NA';
    props.env = env || 'NA';
    activityStream.props = props;
    activityStream.message = message;
    activityStream.payload = payload;
    activityStream.createdBy = createdBy;
    activityStream.source = source;
    this.logger.log('ActivityStream', JSON.stringify(activityStream));
    return this.dataServices.activityStream.create(activityStream);
  }

  async getActivityStream(propertyIdentifier: string): Promise<ActivityStream[]> {
    if (!propertyIdentifier) return await this.dataServices.activityStream.getAll();
    return await this.dataServices.activityStream.getByAny({ propertyIdentifier });
  }

  async getDeploymentCount(propertyIdentifier: string): Promise<any> {
    const query = await this.analyticsFactory.getDeploymentCountQuery(propertyIdentifier);
    return await this.dataServices.activityStream.aggregate(query);
  }

  async getDeploymentCountForEnv(propertyIdentifier: string, applicationIdentifier: string): Promise<any> {
    const query = await this.analyticsFactory.getDeploymentCountForEnv(propertyIdentifier, applicationIdentifier);
    return await this.dataServices.activityStream.aggregate(query);
  }
}
