import { HttpService } from '@nestjs/axios';
import { Injectable } from '@nestjs/common';
import { EventEmitter } from 'events';
import { fromEvent } from 'rxjs';
import { ANALYTICS } from 'src/configuration';
import { LoggerService } from 'src/configuration/logger/service';
import { IDataServices } from 'src/repository/data-services.abstract';
import { ExceptionsService } from 'src/server/exceptions/service';
import { DeploymentCount } from '../deployment-count-response.dto';
import { AverageDeploymentDetails, DeploymentTime } from '../deployment-time-response.dto';
import { ActivityStream, Props } from '../entity';
import { UserAnalytics } from '../user-analytics-response.dto';
import { AnalyticsFactory } from './factory';

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
    private readonly httpService: HttpService,
    private readonly exceptionService: ExceptionsService
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
    const response = await this.dataServices.activityStream.getByOptions(keys, { createdAt: -1 }, skip, limit);
    if (!response) this.exceptionService.badRequestException({ message: 'No Activity Stream Present.' });
    return response;
  }

  async getDeploymentCount(propertyIdentifier?: string): Promise<DeploymentCount[]> {
    const query = await this.analyticsFactory.getDeploymentCountQuery(propertyIdentifier);
    const response = await this.dataServices.activityStream.aggregate(query);
    if (!response) this.exceptionService.badRequestException({ message: 'No Analytics Present.' });
    return response;
  }

  async getDeploymentCountForEnv(propertyIdentifier: string, applicationIdentifier: string): Promise<DeploymentCount[]> {
    const query = await this.analyticsFactory.getDeploymentCountForEnv(propertyIdentifier, applicationIdentifier);
    const response = await this.dataServices.activityStream.aggregate(query);
    if (!response) this.exceptionService.badRequestException({ message: 'No Analytics Present.' });
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
    /* @internal
     * send the date frame where analytical data doesn't exist
     * to be removed once patternly issue is reosolved from the SPAship maanger
     * */
    for (const env of Object.keys(response))
      for (const date of monthlyDateFrame) {
        const exist = response[env].find((data) => data.startDate === date.startDate);
        if (!exist) {
          const tmpData = {
            env,
            count: 0,
            startDate: date.startDate,
            endDate: date.endDate
          };
          response[env].push(tmpData);
        }
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
    if (!response) this.exceptionService.badRequestException({ message: 'No Analytics Present.' });
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

  async getDeploymentTimeSaved(averageDeploymentTimeInSecs: string): Promise<Object> {
    let deploymentTimeResponse;
    let deploymentCountResponse;
    try {
      deploymentTimeResponse = await this.getAverageDeploymentTime('', 'NA', AnalyticsService.defaultDays * AnalyticsService.days);
      deploymentCountResponse = await this.getDeploymentCount();
    } catch (error) {
      this.exceptionService.badRequestException(error);
    }
    const totalDeploymentCount = deploymentCountResponse.reduce((acc, obj) => acc + obj.count, 0);
    const totalTimeForStandardDeployment = Number(averageDeploymentTimeInSecs || ANALYTICS.averageTimeToDeploy) * deploymentTimeResponse.count;
    const timeSavedInSec = totalTimeForStandardDeployment - deploymentTimeResponse.totalTime;
    const timeSavedInHours = Math.round(timeSavedInSec / AnalyticsService.seconds / AnalyticsService.minutes);
    return { timeSavedInHours, averageTime: deploymentTimeResponse.averageTime, deploymentCount: totalDeploymentCount };
  }

  async getDeveloperMetrics(month: number, cluster: string, type: string, mode: string, averageDeploymentTimeInSecs: string): Promise<Object> {
    const monthlyDateFrame = await this.analyticsFactory.buildMonthlyDateFrame(month || 1);
    // @internal TODO : To be implemented in another way
    const spashipAdmin = 'spaship-admin';
    let overallCostSaved = 0;
    const averageDevelopmentHours = Number(averageDeploymentTimeInSecs || ANALYTICS.averageDevelopmentHours);
    const { developerHourlyRate } = ANALYTICS;
    const response = [];
    for (const tmpMonth of monthlyDateFrame) {
      let frequencyOfDeployment;
      let costSavingPerHour;
      let totalCostSaved;
      try {
        const monthlyAnalytics = await this.getAverageDeploymentTime('', 'NA', AnalyticsService.days, tmpMonth, cluster, type);
        const spashipAverageTimeInSecs = monthlyAnalytics.averageTime;
        const averageSavedTimeInSecs = Number(averageDevelopmentHours) - monthlyAnalytics.averageTime;
        const totalWorkingHours = Number(ANALYTICS.workingDays) * Number(ANALYTICS.workingHours);
        const totalDeploymentCount = monthlyAnalytics.count;
        const totalDeploymentHours = parseFloat(
          ((monthlyAnalytics.averageTime * totalDeploymentCount) / AnalyticsService.seconds / AnalyticsService.minutes).toFixed(2)
        );
        const totalDeploymentHoursSaved = parseFloat(
          ((averageSavedTimeInSecs * totalDeploymentCount) / AnalyticsService.seconds / AnalyticsService.minutes).toFixed(2)
        );
        if (mode === spashipAdmin) {
          frequencyOfDeployment = parseFloat((totalDeploymentCount / totalWorkingHours).toFixed(2));
          costSavingPerHour = parseFloat(
            (
              (averageSavedTimeInSecs / AnalyticsService.seconds / AnalyticsService.minutes) *
              frequencyOfDeployment *
              Number(developerHourlyRate)
            ).toFixed(2)
          );
          totalCostSaved = parseFloat((costSavingPerHour * totalDeploymentHours).toFixed(2));
        } else {
          totalCostSaved = parseFloat((totalDeploymentHoursSaved * Number(developerHourlyRate)).toFixed(2));
        }
        if (totalCostSaved) overallCostSaved += totalCostSaved;
        if (spashipAverageTimeInSecs)
          response.push({
            ...tmpMonth,
            averageSavedTimeInSecs,
            spashipAverageTimeInSecs,
            totalWorkingHours,
            totalDeploymentCount,
            totalDeploymentHours,
            totalDeploymentHoursSaved,
            frequencyOfDeployment,
            developerHourlyRate,
            costSavingPerHour,
            totalCostSaved
          });
      } catch (error) {
        /* @internal
         * As we're accumulating multiple months in the iteration
         * If any exception occurs in the query we'll skip that month
         */
        this.logger.error('DeveloperMetrics', error);
      }
    }
    if (!response.length && !overallCostSaved) this.exceptionService.badRequestException({ message: 'No Analytics Present.' });
    return { monthlyAnalytics: response, overallCostSaved: parseFloat(overallCostSaved.toFixed(2)) };
  }

  async getUserPropertyDetails(email: string): Promise<UserAnalytics[]> {
    const query = await this.analyticsFactory.buildPropertyAnalyticsQuery(email);
    const response = await this.dataServices.permission.aggregate(query);
    if (!response || response.length === 0)
      this.exceptionService.badRequestException({ message: `No Property/Application data found for ${email}.` });
    const userAnalytics: UserAnalytics[] = [];
    const propertyIdentifiers = response.map((key) => key.propertyIdentifier);
    const propertyQuery = await this.analyticsFactory.buildPropertyDetailsQuery(propertyIdentifiers);
    const propertyDetails = await this.dataServices.property.aggregate(propertyQuery);
    this.logger.log("propertyDetails", propertyDetails);
    this.logger.log("response", response);


    for (const data of response) {
      const analytics = new UserAnalytics();
      const applicationListQuery = await this.analyticsFactory.buildApplicationListByPropertyQuery(data.propertyIdentifier);
      const property = propertyDetails.find((key) => key.propertyIdentifier === data.propertyIdentifier);
      this.logger.log("property", property);
      analytics.propertyIdentifier = data.propertyIdentifier;
      analytics.createdBy = (property) ? property.createdBy : 'NA';
      const [deploymentCount, applicationDetails] = await Promise.all([
        this.getDeploymentCount(data.propertyIdentifier),
        this.dataServices.application.aggregate(applicationListQuery)
      ]);
      analytics.deploymentCount = deploymentCount[0] ? deploymentCount[0].count : 0;
      analytics.identifiers = applicationDetails[0] ? applicationDetails[0].identifiers : [];
      analytics.applicationCount = applicationDetails[0] ? applicationDetails[0].identifiers.length : 0;
      userAnalytics.push(analytics);
    }
    return userAnalytics;
  }
}
