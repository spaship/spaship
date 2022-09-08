import { useQuery } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import {
  TDeploymentCount,
  TSPADeploymentCount,
  TSPAMonthlyDeploymentCount,
  TWebPropActivityStream
} from './types';

const analyticsKeys = {
  deploy: ['deployment-count'] as const,
  propertyActivityStream: (id: string, spaId?: string) => ['activity-stream', id, spaId] as const,
  totalDeployments: (propertyId: string) => ['total-deployment', propertyId] as const,
  spaDeployments: (propertyId: string, spaID?: string) =>
    [...analyticsKeys.propertyActivityStream(propertyId), spaID] as const,
  spaMonthyDeploymentChart: (propertyId: string, spaID?: string) =>
    [...analyticsKeys.propertyActivityStream(propertyId), spaID, 'monthly-chart'] as const
};

const fetchDeploymentCounts = async (): Promise<TDeploymentCount[]> => {
  const { data } = await orchestratorReq.post('/event/fetch/analytics/all', {
    count: {
      all: true
    }
  });
  return data.data;
};

const groupDeploymentCountByPropertyName = (data: TDeploymentCount[]): Record<string, number> => {
  const groupedData: Record<string, number> = {};
  data.forEach(({ count, propertyName }) => {
    groupedData[propertyName] = count;
  });

  return groupedData;
};

export const useGetDeploymentCounts = () =>
  useQuery(analyticsKeys.deploy, fetchDeploymentCounts, {
    select: groupDeploymentCountByPropertyName
  });

const fetchWebPropertyActivityStream = async (
  webProperty: string,
  spaName?: string
): Promise<TWebPropActivityStream[]> => {
  const { data } = await orchestratorReq.post('/event/fetch/analytics/filter', {
    activities: {
      propertyName: webProperty,
      spaName
    }
  });
  return data.data;
};

export const useGetWebPropActivityStream = (webProperty: string, spaName?: string) =>
  useQuery(analyticsKeys.propertyActivityStream(webProperty), () =>
    fetchWebPropertyActivityStream(webProperty, spaName)
  );

const fetchTotalDeployment = async (
  webProperty: string,
  spaName?: string
): Promise<TSPADeploymentCount[]> => {
  const { data } = await orchestratorReq.post('/event/fetch/analytics/filter', {
    count: {
      propertyName: webProperty,
      spaName
    }
  });
  return data.data;
};

export const useGetTotalDeployments = (webProperty: string, spaName?: string) =>
  useQuery(analyticsKeys.spaDeployments(webProperty, spaName), () =>
    fetchTotalDeployment(webProperty, spaName)
  );

const fetchMonthlyDeploymentChart = async (
  webProperty: string,
  spaName?: string
): Promise<Record<string, TSPAMonthlyDeploymentCount[]>> => {
  const { data } = await orchestratorReq.post('/event/fetch/analytics/filter', {
    chart: {
      month: true,
      propertyName: webProperty,
      spaName
    }
  });
  return data.data;
};

export const useGetMonthyDeploymentChart = (webProperty: string, spaName?: string) =>
  useQuery(analyticsKeys.spaMonthyDeploymentChart(webProperty, spaName), () =>
    fetchMonthlyDeploymentChart(webProperty, spaName)
  );
