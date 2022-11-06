import { Injectable } from '@nestjs/common';
import { Action } from '../activity-stream.entity';

@Injectable()
export class AnalyticsFactory {
  async getDeploymentCountQuery(propertyIdentifier: string): Promise<Object> {
    let searchQuery;
    if (!propertyIdentifier) searchQuery = { action: Action.APPLICATION_DEPLOYED };
    else searchQuery = { action: Action.APPLICATION_DEPLOYED, propertyIdentifier: propertyIdentifier };
    const groupQuery = {
      _id: {
        propertyIdentifier: '$propertyIdentifier',
        action: '$action'
      },
      count: {
        $sum: 1
      }
    };
    const projectionQuery = {
      _id: 0,
      propertyIdentifier: '$_id.propertyIdentifier',
      action: '$_id.action',
      count: '$count'
    };
    return await this.buildAggregationQuery(searchQuery, groupQuery, projectionQuery);
  }

  async getDeploymentCountForEnv(propertyIdentifier: string, applicationIdentifier: string): Promise<Object> {
    let searchQuery;
    if (!applicationIdentifier) searchQuery = { action: Action.APPLICATION_DEPLOYED, propertyIdentifier: propertyIdentifier };
    else
      searchQuery = {
        action: Action.APPLICATION_DEPLOYED,
        propertyIdentifier: propertyIdentifier,
        'props.applicationIdentifier': applicationIdentifier
      };
    const groupQuery = {
      _id: {
        applicationIdentifier: '$props.applicationIdentifier',
        env: '$props.env'
      },
      count: {
        $sum: 1
      }
    };
    const projectionQuery = {
      _id: 0,
      env: '$_id.env',
      count: '$count'
    };
    return await this.buildAggregationQuery(searchQuery, groupQuery, projectionQuery);
  }

  async buildAggregationQuery(searchQuery: Object, groupQuery: Object, projectionQuery: Object) {
    return [
      {
        $match: searchQuery
      },
      {
        $group: groupQuery
      },
      {
        $project: projectionQuery
      }
    ];
  }
}
