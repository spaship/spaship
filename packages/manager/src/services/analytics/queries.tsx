import { orchestratorReq } from '@app/config/orchestratorReq';
import { useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  TDeploymentCount,
  TSPADeploymentCount,
  TSPADeploymentTime,
  TSPAMonthlyDeploymentChart,
  TSPAMonthlyDeploymentCount,
  TWebPropActivityStream
} from './types';

type IDeploymentData = {
  env: string;
  count: number;
  startDate: string;
  endDate: string;
};

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
  propertyIdentifier: string,
  applicationIdentifier?: string
): Promise<TSPADeploymentCount[]> => {
  const { data } = await orchestratorReq.get('analytics/deployment/env', {
    params: {
      propertyIdentifier,
      applicationIdentifier
    }
  });

  // TODO: To be removed after backend revamp
  return data?.data?.filter((spa: any) => !spa.env.startsWith('ephemeral'));
};

export const useGetTotalDeploymentsForApps = (webProperty: string, spaName?: string) =>
  useQuery(analyticsKeys.spaDeployments(webProperty, spaName), () =>
    fetchTotalDeploymentForApps(webProperty, spaName)
  );

const fetchMonthlyDeploymentChart = async (
  propertyIdentifier: string,
  applicationIdentifier?: string
): Promise<Record<string, TSPAMonthlyDeploymentCount[]>> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/env/month', {
    params: {
      propertyIdentifier,
      applicationIdentifier
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

const fetchMonthlyDeploymentChartWithEphemeral = async (
  propertyIdentifier?: string
): Promise<Record<string, TSPAMonthlyDeploymentChart[]>> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/env/month', {
    params: {
      propertyIdentifier
    }
  });
  return data.data;
};

export const useGetMonthlyDeploymentChartWithEphemeral = (propertyIdentifier?: string) =>
  useQuery({
    queryKey: analyticsKeys.spaMonthyDeploymentChartWithEphemeral,
    queryFn: () => fetchMonthlyDeploymentChartWithEphemeral(propertyIdentifier),
    select: (data: {
      qa?: IDeploymentData[];
      stage?: IDeploymentData[];
      dev?: IDeploymentData[];
      prod?: IDeploymentData[];
      ephemeral?: IDeploymentData[];
    }) => {
      const monthlyDelpoymentData: {
        qa?: any[];
        stage?: any[];
        dev?: any[];
        prod?: any[];
        lastMonthEphemeral?: number;
        maxDeploymentCount?: number;
        minDeploymentCount?: number;
      } = {};
      monthlyDelpoymentData.qa = data.qa || [];
      monthlyDelpoymentData.stage = data.stage || [];
      monthlyDelpoymentData.dev = data.dev || [];
      monthlyDelpoymentData.prod = data.prod || [];
      monthlyDelpoymentData.lastMonthEphemeral =
        data.ephemeral?.reduce((acc, obj) => acc + obj.count, 0) || 0;
      monthlyDelpoymentData.minDeploymentCount = Math.min(
        data.qa?.reduce((acc, obj) => Math.min(acc, obj.count), data?.qa?.[0]?.count) || 0,
        data.stage?.reduce((acc, obj) => Math.min(acc, obj.count), data?.stage?.[0]?.count) || 0,
        data.dev?.reduce((acc, obj) => Math.min(acc, obj.count), data?.dev?.[0]?.count) || 0,
        data.prod?.reduce((acc, obj) => Math.min(acc, obj.count), data?.prod?.[0]?.count) || 0
      );
      monthlyDelpoymentData.maxDeploymentCount = Math.max(
        data.qa?.reduce((acc, obj) => Math.max(acc, obj.count), 0) || 0,
        data.stage?.reduce((acc, obj) => Math.max(acc, obj.count), 0) || 0,
        data.dev?.reduce((acc, obj) => Math.max(acc, obj.count), 0) || 0,
        data.prod?.reduce((acc, obj) => Math.max(acc, obj.count), 0) || 0
      );
      return monthlyDelpoymentData;
    }
  });

const fetchTotalDeployment = async (
  propertyIdentifier?: string
): Promise<TSPADeploymentCount[]> => {
  const { data } = await orchestratorReq.get('analytics/deployment/env', {
    params: { propertyIdentifier }
  });

  return data.data;
};

export const useGetTotalDeployments = (propertyIdentifier?: string) =>
  useQuery(analyticsKeys.spaDeployments(''), () => fetchTotalDeployment(propertyIdentifier));

const fetchTotalMonthlyDeploymentTime = async (
  propertyIdentifier?: string
): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time', {
    params: { propertyIdentifier, days: 30 }
  });
  return data.data;
};

export const useGetMonthlyDeploymentsTime = (
  propertyIdentifier?: string,
  applicationIdentifier?: string
) =>
  useQuery({
    queryKey: analyticsKeys.deploymentTimeMonthly,
    queryFn: () => fetchTotalMonthlyDeploymentTime(propertyIdentifier),
    select: (data) =>
      !applicationIdentifier
        ? data.averageTime
        : data.deploymentDetails.filter((m) => m.applicationIdentifier === applicationIdentifier)[0]
            .averageTime
  });

const fetchTotalQuarterlyDeploymentTime = async (
  propertyIdentifier?: string
): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time', {
    params: { propertyIdentifier, days: 90 }
  });
  return data.data;
};

export const useGetQuarterlyDeploymentsTime = (
  propertyIdentifier?: string,
  applicationIdentifier?: string
) =>
  useQuery({
    queryKey: analyticsKeys.deploymentTimeQuarterly,
    queryFn: () => fetchTotalQuarterlyDeploymentTime(propertyIdentifier),
    select: (data) =>
      !applicationIdentifier
        ? data.averageTime
        : data.deploymentDetails.filter((m) => m.applicationIdentifier === applicationIdentifier)[0]
            .averageTime
  });

const fetchTotalHalfYearlyDeploymentTime = async (
  propertyIdentifier?: string
): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time', {
    params: { propertyIdentifier, days: 180 }
  });
  return data.data;
};

export const useGetHalfYearlyDeploymentsTime = (
  propertyIdentifier?: string,
  applicationIdentifier?: string
) =>
  useQuery({
    queryKey: analyticsKeys.deploymentTimeHalfYearly,
    queryFn: () => fetchTotalHalfYearlyDeploymentTime(propertyIdentifier),
    select: (data) =>
      !applicationIdentifier
        ? data.averageTime
        : data.deploymentDetails.filter((m) => m.applicationIdentifier === applicationIdentifier)[0]
            .averageTime
  });

const fetchTotalYearlyDeploymentTime = async (
  propertyIdentifier?: string
): Promise<TSPADeploymentTime> => {
  const { data } = await orchestratorReq.get('analytics/deployment/time', {
    params: { propertyIdentifier, days: 365 }
  });
  return data.data;
};

export const useGetYearlyDeploymentsTime = (
  propertyIdentifier?: string,
  applicationIdentifier?: string
) =>
  useQuery({
    queryKey: analyticsKeys.deploymentTimeYearly,
    queryFn: () => fetchTotalYearlyDeploymentTime(propertyIdentifier),
    select: (data) =>
      !applicationIdentifier
        ? data.averageTime
        : data.deploymentDetails.filter((m) => m.applicationIdentifier === applicationIdentifier)[0]
            .averageTime
  });
