import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { orchestratorReq } from '@app/config/orchestratorReq';
import {
  TDeploymentCount,
  TSPADeploymentCount,
  TSPAMonthlyDeploymentCount,
  TWebPropActivityStream,
  TSPADeploymentTime,
  TSPAMonthlyDeploymentChart
} from './types';

interface IDeploymentData {
  env: string;
  count: number;
  startDate: string;
  endDate: string;
}

const analyticsKeys = {
  deploy: ['deployment-count'] as const,
  deploymentTimeMonthly: ['deployment-time-monthly'] as const,
  deploymentTimeQuarterly: ['deployment-time-quarterly'] as const,
  deploymentTimeHalfYearly: ['deployment-time-halfYearly'] as const,
  deploymentTimeYearly: ['deployment-time-yearly'] as const,
  spaMonthyDeploymentChartWithEphemeral: ['deployment-time-with-ephemeral'] as const,
  propertyActivityStream: (id: string, spaId?: string, action?: string) =>
    ['activity-stream', id, spaId, action] as const,
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
  skip?: number,
  action?: string
): Promise<TWebPropActivityStream[]> => {
  const { data } = await orchestratorReq.get('/analytics/activity-stream', {
    params: {
      propertyIdentifier,
      applicationIdentifier,
      limit: LIMIT,
      skip,
      action
    }
  });
  return data.data;
};

export const useGetWebPropActivityStream = (
  propertyIdentifier: string,
  applicationIdentifier?: string,
  action?: string
) =>
  useInfiniteQuery(
    analyticsKeys.propertyActivityStream(propertyIdentifier),
    ({ pageParam = 0 }) =>
      fetchWebPropertyActivityStream(propertyIdentifier, applicationIdentifier, pageParam, action),
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
  Record<string, TSPAMonthlyDeploymentChart[]>
> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/env/month');
  return data.data;
};

const sortWeeklyDeployments = (arr: IDeploymentData[]) =>
  arr
    .sort((a: IDeploymentData, b: IDeploymentData) => (a.startDate > b.startDate ? 1 : -1))
    .map((ele: IDeploymentData) => ({
      name: `${ele.env.toLocaleUpperCase()}`,
      x: `${dayjs(ele.startDate).format('DD MMM')} - ${dayjs(ele.endDate).format('DD MMM')}`,
      y: ele.count
    }));

export const useGetMonthlyDeploymentChartWithEphemeral = () =>
  useQuery({
    queryKey: analyticsKeys.spaMonthyDeploymentChartWithEphemeral,
    queryFn: () => fetchMonthlyDeploymentChartWithEphemeral(),
    select: (data: {
      qa?: IDeploymentData[];
      stage?: IDeploymentData[];
      dev?: IDeploymentData[];
      uatprod?: IDeploymentData[];
      ephemeral?: IDeploymentData[];
    }) => {
      const monthlyDelpoymentData: {
        qa?: any[];
        stage?: any[];
        dev?: any[];
        uatprod?: any[];
        lastMonthEphemeral?: number;
        maxDeploymentCount?: number;
        minDeploymentCount?: number;
      } = {};
      monthlyDelpoymentData.qa = sortWeeklyDeployments(data.qa || []);
      monthlyDelpoymentData.stage = sortWeeklyDeployments(data.stage || []);
      monthlyDelpoymentData.dev = sortWeeklyDeployments(data.dev || []);
      monthlyDelpoymentData.uatprod = sortWeeklyDeployments(data.uatprod || []);
      monthlyDelpoymentData.lastMonthEphemeral =
        data.ephemeral?.reduce((acc, obj) => acc + obj.count, 0) || 0;
      monthlyDelpoymentData.minDeploymentCount = Math.min(
        data.qa?.reduce((acc, obj) => Math.min(acc, obj.count), data?.qa?.[0]?.count) || 0,
        data.stage?.reduce((acc, obj) => Math.min(acc, obj.count), data?.stage?.[0]?.count) || 0,
        data.dev?.reduce((acc, obj) => Math.min(acc, obj.count), data?.dev?.[0]?.count) || 0,
        data.uatprod?.reduce((acc, obj) => Math.min(acc, obj.count), data?.uatprod?.[0]?.count) || 0
      );
      monthlyDelpoymentData.maxDeploymentCount = Math.max(
        data.qa?.reduce((acc, obj) => Math.max(acc, obj.count), 0) || 0,
        data.stage?.reduce((acc, obj) => Math.max(acc, obj.count), 0) || 0,
        data.dev?.reduce((acc, obj) => Math.max(acc, obj.count), 0) || 0,
        data.uatprod?.reduce((acc, obj) => Math.max(acc, obj.count), 0) || 0
      );
      return monthlyDelpoymentData;
    }
  });

const fetchTotalDeployment = async (): Promise<TSPADeploymentCount[]> => {
  const { data } = await orchestratorReq.get('analytics/deployment/env');
  return data.data;
};

export const useGetTotalDeployments = () =>
  useQuery(analyticsKeys.spaDeployments(''), () => fetchTotalDeployment());

const fetchTotalMonthlyDeploymentTime = async (): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time?days=30');
  return data.data;
};

export const useGetMonthlyDeploymentsTime = () =>
  useQuery({
    queryKey: analyticsKeys.deploymentTimeMonthly,
    queryFn: () => fetchTotalMonthlyDeploymentTime(),
    select: (data) => data.averageTime
  });

const fetchTotalQuarterlyDeploymentTime = async (): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time?days=120');
  return data.data;
};

export const useGetQuarterlyDeploymentsTime = () =>
  useQuery({
    queryKey: analyticsKeys.deploymentTimeQuarterly,
    queryFn: () => fetchTotalQuarterlyDeploymentTime(),
    select: (data) => data.averageTime
  });

const fetchTotalHalfYearlyDeploymentTime = async (): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time?days=180');
  return data.data;
};

export const useGetHalfYearlyDeploymentsTime = () =>
  useQuery({
    queryKey: analyticsKeys.deploymentTimeHalfYearly,
    queryFn: () => fetchTotalHalfYearlyDeploymentTime(),
    select: (data) => data.averageTime
  });

const fetchTotalYearlyDeploymentTime = async (): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time?days=365');
  return data.data;
};

export const useGetYearlyDeploymentsTime = () =>
  useQuery({
    queryKey: analyticsKeys.deploymentTimeYearly,
    queryFn: () => fetchTotalYearlyDeploymentTime(),
    select: (data) => data.averageTime
  });
