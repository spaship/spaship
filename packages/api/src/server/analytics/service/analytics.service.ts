import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ActivityStream, Props } from '../activity-stream.entity';
import { AnalyticsFactory } from './analytics.factory';

@Injectable()
export class AnalyticsService {
  // @internal This emitter will be sharable for all the instances
  private static readonly emitter: EventEmitter = new EventEmitter();

  private static readonly channel: string = 'activity_stream';

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
    this.emit({ activityStream });
    return this.dataServices.activityStream.create(activityStream);
  }

  async getActivityStream(propertyIdentifier: string, applicationIdentifier: string): Promise<ActivityStream[]> {
    if (propertyIdentifier && applicationIdentifier)
      return this.dataServices.activityStream.getByAny({ propertyIdentifier, 'props.applicationIdentifier': applicationIdentifier });
    if (!propertyIdentifier) return this.dataServices.activityStream.getAll();
    return this.dataServices.activityStream.getByAny({ propertyIdentifier });
  }

  async getDeploymentCount(propertyIdentifier: string): Promise<any> {
    const query = await this.analyticsFactory.getDeploymentCountQuery(propertyIdentifier);
    return Promise.resolve(this.dataServices.activityStream.aggregate(query));
  }

  async getDeploymentCountForEnv(propertyIdentifier: string, applicationIdentifier: string): Promise<any> {
    const query = await this.analyticsFactory.getDeploymentCountForEnv(propertyIdentifier, applicationIdentifier);
    return Promise.resolve(this.dataServices.activityStream.aggregate(query));
  }

  async getMonthlyDeploymentCount(propertyIdentifier: string, applicationIdentifier: string): Promise<Object> {
    const response = {};
    const monthlyCountResponse = [];
    const [searchQuery, groupQuery, projectQuery] = await this.analyticsFactory.getMonthlyDeploymentCountQuery(
      propertyIdentifier,
      applicationIdentifier
    );
    const monthlyDateFrame = await this.analyticsFactory.buildWeeklyDateFrame();
    for (const week of monthlyDateFrame) {
      const element = { startDate: week.startDate, endDate: week.endDate };
      const query = await this.analyticsFactory.buildMonthlyCountQuery(element.startDate, element.endDate, searchQuery, groupQuery, projectQuery);
      const tmpResponse = await this.dataServices.activityStream.aggregate(query);
      tmpResponse.forEach((item) => {
        item.startDate = element.startDate;
        item.endDate = element.endDate;
      });
      monthlyCountResponse.push(tmpResponse);
    }
    for (const week of monthlyCountResponse)
      for (const obj of week)
        if (response[obj.env]) response[obj.env].push(obj);
        else response[obj.env] = [obj];
    return response;
  }

  subscribe() {
    return fromEvent(AnalyticsService.emitter, AnalyticsService.channel);
  }

  emit(data) {
    AnalyticsService.emitter.emit(AnalyticsService.channel, data);
  }
}
