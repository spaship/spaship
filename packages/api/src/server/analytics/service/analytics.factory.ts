import { Injectable } from '@nestjs/common';
import { Action } from '../activity-stream.entity';

@Injectable()
export class AnalyticsFactory {
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
}
