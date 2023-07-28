import { Injectable } from '@nestjs/common';
import { WebhookApikey, WebhookApplication, WebhookDetails, WebhookResponse } from 'src/server/webhook/webhook-response.dto';
import { Action, ActivityStream } from '../activity-stream.entity';

@Injectable()
export class AnalyticsFactory {
  private static readonly ephemeral: string = 'ephemeral';

  async buildAggregationQuery(searchQuery: Object, groupQuery: Object, projectionQuery: Object) {
    return [{ $match: searchQuery }, { $group: groupQuery }, { $project: projectionQuery }];
  }

  async getDeploymentCountQuery(propertyIdentifier?: string): Promise<Object> {
    let searchQuery;
    if (!propertyIdentifier) searchQuery = { action: Action.APPLICATION_DEPLOYED };
    else searchQuery = { action: Action.APPLICATION_DEPLOYED, propertyIdentifier };
    const groupQuery = { _id: { propertyIdentifier: '$propertyIdentifier', action: '$action' }, count: { $sum: 1 } };
    const projectionQuery = { _id: 0, propertyIdentifier: '$_id.propertyIdentifier', action: '$_id.action', count: '$count' };
    return this.buildAggregationQuery(searchQuery, groupQuery, projectionQuery);
  }

  async getDeploymentCountForEnv(propertyIdentifier: string, applicationIdentifier: string): Promise<Object> {
    const searchQuery = {
      action: Action.APPLICATION_DEPLOYED,
      propertyIdentifier,
      'props.applicationIdentifier': applicationIdentifier
    };
    Object.keys(searchQuery).forEach((key) => searchQuery[key] === undefined && delete searchQuery[key]);
    let groupQuery;
    if (applicationIdentifier && propertyIdentifier)
      groupQuery = { _id: { applicationIdentifier: '$props.applicationIdentifier', env: '$props.env' }, count: { $sum: 1 } };
    else if (propertyIdentifier) groupQuery = { _id: { propertyIdentifier, env: '$props.env' }, count: { $sum: 1 } };
    else groupQuery = { _id: { env: '$props.env' }, count: { $sum: 1 } };
    const projectionQuery = { _id: 0, env: '$_id.env', count: '$count' };
    return this.buildAggregationQuery(searchQuery, groupQuery, projectionQuery);
  }

  async getMonthlyDeploymentCountQuery(propertyIdentifier: string, applicationIdentifier: string): Promise<Object[]> {
    let searchQuery;
    let groupQuery;
    let projectQuery;
    if (applicationIdentifier && propertyIdentifier) {
      searchQuery = {
        action: Action.APPLICATION_DEPLOYED,
        propertyIdentifier,
        'props.applicationIdentifier': applicationIdentifier
      };
      groupQuery = { applicationIdentifier, env: '$props.env' };
      projectQuery = { _id: 0, applicationIdentifier: '$_id.applicationIdentifier', env: '$_id.env', count: '$count' };
    } else if (propertyIdentifier) {
      searchQuery = { action: Action.APPLICATION_DEPLOYED, propertyIdentifier };
      groupQuery = { propertyIdentifier, env: '$props.env' };
      projectQuery = { _id: 0, propertyIdentifier: '$_id.propertyIdentifier', env: '$_id.env', count: '$count' };
    } else {
      searchQuery = { action: Action.APPLICATION_DEPLOYED };
      groupQuery = { env: '$props.env' };
      projectQuery = { _id: 0, env: '$_id.env', count: '$count' };
    }
    return [searchQuery, groupQuery, projectQuery];
  }

  async getAverageDeploymentTimeQuery(
    propertyIdentifier: string,
    days: number,
    isEph: string,
    monthFrame: any,
    cluster: string,
    type: string
  ): Promise<Object> {
    let searchQuery;
    let groupQuery;
    let projectQuery;
    let startDate;
    let endDate;
    if (!monthFrame) [startDate, endDate] = await this.getStartAndEndDate(days);
    else {
      startDate = monthFrame.startDate;
      endDate = monthFrame.endDate;
    }
    if (isEph === 'true') searchQuery = { env: { $regex: /^ephemeral/ } };
    else searchQuery = { env: { $not: /ephemeral/ } };
    const groupOperations = { count: { $sum: 1 }, totalTime: { $sum: { $toDecimal: '$consumedTime' } } };
    const projectOperations = {
      count: '$count',
      totalTime: { $round: ['$totalTime', 2] },
      averageTime: { $round: [{ $divide: ['$totalTime', '$count'] }, 2] }
    };
    if (propertyIdentifier) {
      searchQuery = { ...searchQuery, propertyIdentifier };
      groupQuery = { $group: { _id: { applicationIdentifier: '$applicationIdentifier' }, ...groupOperations } };
      projectQuery = { $project: { _id: 0, applicationIdentifier: '$_id.applicationIdentifier', ...projectOperations } };
    } else {
      groupQuery = { $group: { _id: { propertyIdentifier: '$propertyIdentifier' }, ...groupOperations } };
      projectQuery = { $project: { _id: 0, propertyIdentifier: '$_id.propertyIdentifier', ...projectOperations } };
    }
    if (cluster) {
      searchQuery = { ...searchQuery, cluster };
    }
    if (type) {
      searchQuery = { ...searchQuery, type };
    }
    const query = [
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { $match: searchQuery },
      groupQuery,
      projectQuery,
      { $sort: { propertyIdentifier: 1, applicationIdentifier: 1 } }
    ];
    return query;
  }

  async buildWeeklyDateFrame(): Promise<any[]> {
    const dateFrame = [];
    let recentDate = new Date();
    for (let i = 1; i <= 4; i += 1) {
      const endDate = recentDate;
      const startDate = new Date(recentDate);
      startDate.setDate(recentDate.getDate() - 7);
      dateFrame.push({ startDate, endDate });
      recentDate = startDate;
    }
    return dateFrame;
  }

  async buildMonthlyDateFrame(previous: number): Promise<any[]> {
    const dateFrame = [];
    const startDate = new Date();
    const endDate = new Date();
    startDate.setDate(1);
    endDate.setMonth(endDate.getMonth() + 1);
    endDate.setDate(0);
    dateFrame.push({ startDate: new Date(startDate), endDate: new Date(endDate) });
    for (let i = 1; i < previous; i += 1) {
      startDate.setMonth(startDate.getMonth() - 1);
      endDate.setDate(0);
      dateFrame.push({ startDate: new Date(startDate), endDate: new Date(endDate) });
    }
    return dateFrame;
  }

  async buildMonthlyCountQuery(startDate, endDate, matchRequest, groupRequest, projectRequest): Promise<Object[]> {
    return [
      { $match: { createdAt: { $gte: startDate, $lt: endDate } } },
      { $match: matchRequest },
      { $group: { _id: groupRequest, count: { $sum: 1 } } },
      { $project: projectRequest },
      { $sort: { env: 1 } }
    ];
  }

  async getStartAndEndDate(days: number): Promise<Date[]> {
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);
    return [startDate, endDate];
  }

  groupEphemeral(response: Object, obj: any) {
    const result = response[AnalyticsFactory.ephemeral].findIndex((element) => element.startDate === obj.startDate);
    if (result !== -1) response[AnalyticsFactory.ephemeral][result].count += obj.count;
    else {
      obj.env = AnalyticsFactory.ephemeral;
      response[AnalyticsFactory.ephemeral].push(obj);
    }
  }

  getEnv(env: string): string {
    if (env.includes(AnalyticsFactory.ephemeral)) return AnalyticsFactory.ephemeral;
    return env;
  }

  // @internal generate the data for the webhook based on the details
  generateWebhookData(activityStream: ActivityStream): WebhookResponse {
    const tmpWebhook = new WebhookResponse();
    const tmpProps = JSON.parse(activityStream?.payload);
    tmpWebhook.propertyIdentifier = activityStream.propertyIdentifier;
    tmpWebhook.action = activityStream.action;
    tmpWebhook.actor = activityStream.createdBy;
    tmpWebhook.source = activityStream.source;
    tmpWebhook.environment = activityStream.props.env;
    tmpWebhook.message = activityStream.message;
    tmpWebhook.triggeredAt = new Date();

    if (activityStream.action === Action.APIKEY_CREATED || activityStream.action === Action.APIKEY_DELETED) {
      const tmpApikey = new WebhookApikey();
      tmpApikey.shortKey = tmpProps.shortKey;
      tmpApikey.label = tmpProps.label;
      tmpApikey.expirationDate = tmpProps.expirationDate;
      tmpWebhook.apiKey = tmpApikey;
    }

    if (
      activityStream.action === Action.APPLICATION_DEPLOYED ||
      activityStream.action === Action.APPLICATION_DEPLOYMENT_STARTED ||
      activityStream.action === Action.APPLICATION_DEPLOYMENT_FAILED ||
      activityStream.action === Action.APPLICATION_DELETED
    ) {
      const tmpApplication = new WebhookApplication();
      tmpApplication.name = activityStream.props.applicationIdentifier;
      tmpApplication.path = tmpProps.path;
      tmpApplication.ref = tmpProps.ref;
      tmpApplication.accessUrl = tmpProps?.accessUrl;
      tmpWebhook.application = tmpApplication;
    }

    if (
      activityStream.action === Action.WEBHOOK_CREATED ||
      activityStream.action === Action.WEBHOOK_DELETED ||
      activityStream.action === Action.WEBHOOK_UPDATED
    ) {
      const tmpDetails = new WebhookDetails();
      tmpDetails.name = tmpProps.name;
      tmpDetails.actions = tmpProps.actions;
      tmpDetails.url = tmpProps.url;
      tmpWebhook.webhook = tmpDetails;
    }
    return tmpWebhook;
  }
}
