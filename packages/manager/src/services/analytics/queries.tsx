import { useInfiniteQuery, useQuery } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import {
  TDeploymentCount,
  TSPADeploymentCount,
  TSPAMonthlyDeploymentCount,
  TWebPropActivityStream,
  TSPADeploymentTime
} from './types';

interface IDeploymentData {
  env: string;
  count: number;
  startDate: string;
  endDate: string;
}

const analyticsKeys = {
  deploy: ['deployment-count'] as const,
  deploymentTime: ['deployment-time'] as const,
  spaMonthyDeploymentChartWithEphemeral: ['deployment-time-with-ephemeral'] as const,
  propertyActivityStream: (id: string, spaId?: string) => ['activity-stream', id, spaId] as const,
  totalDeployments: (propertyId: string) => ['total-deployment', propertyId] as const,
  spaDeployments: (propertyId: string, spaID?: string) =>
    [...analyticsKeys.propertyActivityStream(propertyId), spaID] as const,
  spaMonthyDeploymentChart: (propertyId: string, spaID?: string) =>
    [...analyticsKeys.propertyActivityStream(propertyId), spaID, 'monthly-chart'] as const
};

const fetchDeploymentCounts = async (): Promise<TDeploymentCount[]> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/count');
  return data.data;
};

const groupDeploymentCountByPropertyIdentifier = (
  data: TDeploymentCount[]
): Record<string, number> => {
  const groupedData: Record<string, number> = {};
  data.forEach(({ count, propertyIdentifier }) => {
    groupedData[propertyIdentifier] = count;
  });

  return groupedData;
};

export const useGetDeploymentCounts = () =>
  useQuery(analyticsKeys.deploy, fetchDeploymentCounts, {
    select: groupDeploymentCountByPropertyIdentifier
  });

const LIMIT = 10;

const fetchWebPropertyActivityStream = async (
  propertyIdentifier: string,
  applicationIdentifier?: string,
  skip?: number
): Promise<TWebPropActivityStream[]> => {
  const { data } = await orchestratorReq.get('/analytics/activity-stream', {
    params: {
      propertyIdentifier,
      applicationIdentifier,
      limit: LIMIT,
      skip
    }
  });
  return data.data;
};

export const useGetWebPropActivityStream = (
  propertyIdentifier: string,
  applicationIdentifier?: string
) =>
  useInfiniteQuery(
    analyticsKeys.propertyActivityStream(propertyIdentifier),
    ({ pageParam = 0 }) =>
      fetchWebPropertyActivityStream(propertyIdentifier, applicationIdentifier, pageParam),
    {
      getNextPageParam: (lastPage, allPages) =>
        lastPage.length ? allPages.length * LIMIT : undefined
    }
  );

const fetchTotalDeploymentForApps = async (
  webProperty: string,
  spaName = ''
): Promise<TSPADeploymentCount[]> => {
  const { data } = await orchestratorReq.get('analytics/deployment/env', {
    params: {
      propertyIdentifier: webProperty,
      applicationIdentifier: spaName
    }
  });
  // TODO: To be removed after backend revamp
  if (data.data) {
    data.data = data.data.filter((spa: any) => !spa.env.startsWith('ephemeral'));
  }
  return data.data;
};

export const useGetTotalDeploymentsForApps = (webProperty: string, spaName?: string) =>
  useQuery(analyticsKeys.spaDeployments(webProperty, spaName), () =>
    fetchTotalDeploymentForApps(webProperty, spaName)
  );

const fetchMonthlyDeploymentChart = async (
  webProperty: string,
  spaName?: string
): Promise<Record<string, TSPAMonthlyDeploymentCount[]>> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/env/month', {
    params: {
      propertyIdentifier: webProperty,
      applicationIdentifier: spaName
    }
  });
  // TODO: Remove this once backend has been revamped
  if (data.data) {
    data.data = Object.keys(data.data).reduce((acc: any, key: string) => {
      if (!key.startsWith('ephemeral')) {
        acc[key] = data.data[key];
      }
      return acc;
    }, {});
  }
  return data.data;
};

export const useGetMonthlyDeploymentChart = (webProperty: string, spaName?: string) =>
  useQuery(analyticsKeys.spaMonthyDeploymentChart(webProperty, spaName), () =>
    fetchMonthlyDeploymentChart(webProperty, spaName)
  );

const fetchMonthlyDeploymentChartWithEphemeral = async (): Promise<
  Record<string, TSPAMonthlyDeploymentCount[]>
> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/env/month');
  return data.data;
};

const sortWeeklyDeployments = (arr: IDeploymentData[]) =>
  arr
    .sort((a: IDeploymentData, b: IDeploymentData) => (a.startDate > b.startDate ? 1 : -1))
    .map((ele: IDeploymentData, index: number) => ({
      name: `${ele.env.toLocaleUpperCase()}`,
      x: `Week ${index + 1}`,
      y: ele.count
    }));

export const useGetMonthlyDeploymentChartWithEphemeral = () =>
  useQuery({
    queryKey: analyticsKeys.spaMonthyDeploymentChartWithEphemeral,
    queryFn: () => fetchMonthlyDeploymentChartWithEphemeral(),
    select: (data) =>
      Object.keys(data).map((key) => ({ env: key, data: sortWeeklyDeployments(data[key]) }))
  });

const fetchTotalDeployment = async (): Promise<TSPADeploymentCount[]> => {
  const { data } = await orchestratorReq.get('analytics/deployment/env');
  return data.data;
};

export const useGetTotalDeployments = () =>
  useQuery(analyticsKeys.spaDeployments(''), () => fetchTotalDeployment());

const fetchTotalDeploymentTime = async (): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time');
  return data.data;
};

export const useGetDeploymentsTime = () =>
  useQuery(analyticsKeys.deploymentTime, () => fetchTotalDeploymentTime());
