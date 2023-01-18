import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';
import { LoggerService } from 'src/configuration/logger/logger.service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ActivityStream, Props } from '../activity-stream.entity';
import { DeploymentCount } from '../deployment-count-response.dto';
import { AverageDeploymentDetails, DeploymentTime } from '../deployment-time-response.dto';
import { AnalyticsFactory } from './analytics.factory';

@Injectable()
export class AnalyticsService {
  // @internal This emitter will be sharable for all the instances
  private static readonly emitter: EventEmitter = new EventEmitter();

  private static readonly channel: string = 'activity_stream';

  private static readonly ephemeral: string = 'ephemeral';

  private static readonly defaultSkip: number = 0;

  private static readonly defaultLimit: number = 100;

  private static readonly defaultDays: number = 120;

  constructor(
    private readonly dataServices: IDataServices,
    private readonly analyticsFactory: AnalyticsFactory,
    private readonly logger: LoggerService,
    private readonly httpService: HttpService
  ) {}

  async createActivityStream(
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
    await this.emit(propertyIdentifier, { activityStream });
    const savedAnalytics = await this.dataServices.activityStream.create(activityStream);
    const webhooks = await this.dataServices.webhook.getByAny({ propertyIdentifier, actions: action });
    this.publishWebhookEvents(webhooks, activityStream);
    return savedAnalytics;
  }

  async getActivityStream(
    propertyIdentifier: string,
    applicationIdentifier: string,
    action: string,
    skip: number = AnalyticsService.defaultSkip,
    limit: number = AnalyticsService.defaultLimit
  ): Promise<ActivityStream[]> {
    const keys = { propertyIdentifier, 'props.applicationIdentifier': applicationIdentifier, action };
    Object.keys(keys).forEach((key) => (keys[key] === undefined || keys[key] === '') && delete keys[key]);
    return this.dataServices.activityStream.getByOptions(keys, { createdAt: -1 }, skip, limit);
  }

  async getDeploymentCount(propertyIdentifier: string): Promise<DeploymentCount[]> {
    const query = await this.analyticsFactory.getDeploymentCountQuery(propertyIdentifier);
    return Promise.resolve(this.dataServices.activityStream.aggregate(query));
  }

  async getDeploymentCountForEnv(propertyIdentifier: string, applicationIdentifier: string): Promise<DeploymentCount[]> {
    const query = await this.analyticsFactory.getDeploymentCountForEnv(propertyIdentifier, applicationIdentifier);
    const response = await this.dataServices.activityStream.aggregate(query);
    const deploymentCount = [];
    const ephemeralCount = new DeploymentCount();
    ephemeralCount.env = AnalyticsService.ephemeral;
    response.forEach((deployment) => {
      if (deployment.env.includes(AnalyticsService.ephemeral)) ephemeralCount.count += deployment.count;
      else {
        const tmpDetails = new DeploymentCount();
        tmpDetails.env = deployment.env;
        tmpDetails.count = deployment.count;
        deploymentCount.push(tmpDetails);
      }
    });
    deploymentCount.push(ephemeralCount);
    return deploymentCount;
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
        if (response[this.analyticsFactory.getEnv(obj.env)]) {
          if (obj.env.includes(AnalyticsService.ephemeral)) {
            this.analyticsFactory.groupEphemeral(response, obj);
          } else response[this.analyticsFactory.getEnv(obj.env)].push(obj);
        } else {
          if (obj.env.includes(AnalyticsService.ephemeral)) obj.env = AnalyticsService.ephemeral;
          response[this.analyticsFactory.getEnv(obj.env)] = [obj];
        }
    return response;
  }

  subscribe(channel: string) {
    return fromEvent(AnalyticsService.emitter, channel);
  }

  emit(channel, data) {
    AnalyticsService.emitter.emit(channel, data);
  }

  async getAverageDeploymentTime(propertyIdentifier: string, isEph: string, days: number = AnalyticsService.defaultDays): Promise<DeploymentTime> {
    const query = await this.analyticsFactory.getAverageDeploymentTimeQuery(propertyIdentifier, days, isEph);
    const response = await this.dataServices.eventTimeTrace.aggregate(query);
    let sumOfDeploymentTime = 0;
    let sumOfDeploymentCount = 0;
    const deploymentTimeResponse = new DeploymentTime();
    const averageTimeDetails: AverageDeploymentDetails[] = [];
    for (const key in response) {
      if (Object.prototype.hasOwnProperty.call(response, key)) {
        const tmpDetails = new AverageDeploymentDetails();
        tmpDetails.propertyIdentifier = response[key].propertyIdentifier;
        tmpDetails.applicationIdentifier = response[key].applicationIdentifier;
        tmpDetails.count = response[key].count;
        tmpDetails.totalTime = parseFloat(response[key].totalTime);
        tmpDetails.averageTime = parseFloat(response[key].averageTime);
        averageTimeDetails.push(tmpDetails);
        sumOfDeploymentTime += tmpDetails.totalTime;
        sumOfDeploymentCount += tmpDetails.count;
      }
    }
    deploymentTimeResponse.averageTime = parseFloat((sumOfDeploymentTime / sumOfDeploymentCount).toFixed(2));
    deploymentTimeResponse.totalTime = parseFloat(sumOfDeploymentTime.toFixed(2));
    deploymentTimeResponse.count = sumOfDeploymentCount;
    deploymentTimeResponse.propertyIdentifier = propertyIdentifier;
    deploymentTimeResponse.deploymentDetails = averageTimeDetails;
    deploymentTimeResponse.days = days;
    return deploymentTimeResponse;
  }

  private publishWebhookEvents(webhooks, activityStream: ActivityStream) {
    for (const webhook of webhooks)
      this.httpService.axiosRef
        .post(webhook.url, { ...activityStream })
        .then((response) => {
          this.logger.log('WebhookResponse', JSON.stringify(response?.data));
        })
        .catch((err) => {
          this.logger.error('WebhookError', err);
        });
  }
}
