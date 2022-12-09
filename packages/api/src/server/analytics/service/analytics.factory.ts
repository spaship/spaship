import { Injectable } from '@nestjs/common';
import { Action } from '../activity-stream.entity';

@Injectable()
export class AnalyticsFactory {
  private static readonly ephemeral: string = 'ephemeral';

  async buildAggregationQuery(searchQuery: Object, groupQuery: Object, projectionQuery: Object) {
    return [{ $match: searchQuery }, { $group: groupQuery }, { $project: projectionQuery }];
  }

  async getDeploymentCountQuery(propertyIdentifier: string): Promise<Object> {
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

  async getAverageDeploymentTimeQuery(propertyIdentifier: string, days: number, isEph: string): Promise<Object> {
    let searchQuery;
    let groupQuery;
    let projectQuery;
    const [startDate, endDate] = await this.getStartAndEndDate(days);
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
}
