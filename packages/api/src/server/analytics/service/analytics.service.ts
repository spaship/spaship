import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';
import { ANALYTICS } from 'src/configuration';
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

  private static readonly standardTimeToDeploy: number = 300;

  private static readonly days = 30;

  private static readonly seconds = 60;

  private static readonly minutes = 60;

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
    payload?: string,
    cluster?: string,
    type?: string
  ): Promise<ActivityStream> {
    const activityStream = new ActivityStream();
    const props = new Props();
    activityStream.propertyIdentifier = propertyIdentifier;
    activityStream.action = action;
    props.applicationIdentifier = applicationIdentifier || 'NA';
    props.env = env || 'NA';
    props.cluster = cluster || 'NA';
    props.type = type || 'NA';
    activityStream.props = props;
    activityStream.message = message;
    activityStream.payload = payload;
    activityStream.createdBy = createdBy;
    activityStream.source = source;
    this.logger.log('ActivityStream', JSON.stringify(activityStream));
    await this.emit(propertyIdentifier, { activityStream });
    const savedAnalytics = await this.dataServices.activityStream.create(activityStream);
    try {
      const webhooks = await this.dataServices.webhook.getByAny({ propertyIdentifier, actions: action });
      if (webhooks.length !== 0) this.publishWebhookEvents(webhooks, activityStream);
    } catch (err) {
      this.logger.debug('WebhookError', err);
    }
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

  async getMonthlyDeploymentCount(propertyIdentifier: string, applicationIdentifier: string, previous: number): Promise<Object> {
    const response = {};
    const monthlyCountResponse = [];
    const [searchQuery, groupQuery, projectQuery] = await this.analyticsFactory.getMonthlyDeploymentCountQuery(
      propertyIdentifier,
      applicationIdentifier
    );
    let monthlyDateFrame;
    if (!previous) monthlyDateFrame = await this.analyticsFactory.buildWeeklyDateFrame();
    else monthlyDateFrame = await this.analyticsFactory.buildMonthlyDateFrame(previous);
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

  async getAverageDeploymentTime(
    propertyIdentifier: string,
    isEph: string,
    days: number = AnalyticsService.defaultDays,
    monthFrame?: any,
    cluster?: string,
    type?: string
  ): Promise<DeploymentTime> {
    const query = await this.analyticsFactory.getAverageDeploymentTimeQuery(propertyIdentifier, days, isEph, monthFrame, cluster, type);
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
    const webhookData = this.analyticsFactory.generateWebhookData(activityStream);
    for (const webhook of webhooks)
      this.httpService.axiosRef
        .post(webhook.url, { ...webhookData })
        .then((response) => {
          this.logger.log('WebhookResponse', JSON.stringify(response?.data));
        })
        .catch((err) => {
          this.logger.error('WebhookError', err);
        });
  }

  async getDeploymentTimeSaved(): Promise<Object> {
    const response = await this.getAverageDeploymentTime('', 'NA', AnalyticsService.defaultDays * AnalyticsService.days);
    const totalTimeForStandardDeployment = Number(ANALYTICS.averageTimeToDeploy) * response.count;
    const timeSavedInSec = totalTimeForStandardDeployment - response.totalTime;
    const timeSavedInHours = Math.round(timeSavedInSec / AnalyticsService.seconds / AnalyticsService.minutes);
    return { timeSavedInHours };
  }

  async getDeveloperMetrics(month: number, cluster: string, type: string): Promise<Object> {
    const monthlyDateFrame = await this.analyticsFactory.buildMonthlyDateFrame(month || 1);
    const { averageTimeToDeploy } = ANALYTICS;
    const response = [];
    for (const tmpMonth of monthlyDateFrame) {
      const monthlyAnalytics = await this.getAverageDeploymentTime('', 'NA', AnalyticsService.days, tmpMonth, cluster, type);
      const spashipAverageTime = monthlyAnalytics.averageTime;
      const averageSavedTime = Number(averageTimeToDeploy) - monthlyAnalytics.averageTime;
      const totalWorkingHours = Number(ANALYTICS.workingDays) * Number(ANALYTICS.averageDevelopmentHours);
      const totalDeploymentCount = monthlyAnalytics.count;
      const totalDeploymentHours = parseFloat(
        ((monthlyAnalytics.averageTime * totalDeploymentCount) / AnalyticsService.seconds / AnalyticsService.minutes).toFixed(2)
      );
      const frequencyOfDeployment = parseFloat((totalDeploymentCount / totalWorkingHours).toFixed(2));
      const { developerHourlyRate } = ANALYTICS;
      const costSavingPerHour = parseFloat(
        ((averageSavedTime / AnalyticsService.seconds / AnalyticsService.minutes) * frequencyOfDeployment * Number(developerHourlyRate)).toFixed(2)
      );
      const totalCostSaved = parseFloat((costSavingPerHour * totalDeploymentHours).toFixed(2));
      response.push({
        ...tmpMonth,
        averageSavedTime,
        spashipAverageTime,
        totalWorkingHours,
        totalDeploymentCount,
        totalDeploymentHours,
        frequencyOfDeployment,
        developerHourlyRate,
        costSavingPerHour,
        totalCostSaved
      });
    }
    return response;
  }
}
