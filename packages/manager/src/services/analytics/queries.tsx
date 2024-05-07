import { orchestratorReq } from '@app/config/orchestratorReq';
import { QueryKey, useInfiniteQuery, useQuery } from '@tanstack/react-query';
import {
  TDeploymentCount,
  TSPADeploymentCount,
  TSPADeploymentTime,
  TSPAMonthlyDeploymentChart,
  TSPAMonthlyDeploymentCount,
  TWebPropActivityStream,
  TTotalTimeSaved,
  TUserWebProperties
} from './types';

type IDeploymentData = {
  env: string;
  count: number;
  startDate: string;
  endDate: string;
};
type ITransformedInputDataItem = {
  propertyIdentifier?: string;
  env: string;
  count: number;
  startDate: string;
  endDate: string;
};

type TransformedInput = {
  [key: string]: ITransformedInputDataItem[];
};

type TransformedOutput = {
  [key: string]: ITransformedInputDataItem[];
};
export const analyticsKeys = {
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
    [...analyticsKeys.propertyActivityStream(propertyId), spaID, 'monthly-chart'] as const,
  timeSaved: ['time-saved'] as const,
  userAnalytics: ['user-analytics'] as const
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
      refetchOnWindowFocus: true,
      refetchInterval: 10000,

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
  useQuery(
    analyticsKeys.spaDeployments(webProperty, spaName),
    () => fetchTotalDeploymentForApps(webProperty, spaName),
    {
      refetchOnWindowFocus: true
    }
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
  useQuery(
    analyticsKeys.spaMonthyDeploymentChart(webProperty, spaName),
    () => fetchMonthlyDeploymentChart(webProperty, spaName),
    {
      refetchOnWindowFocus: true
    }
  );

const fetchMonthlyDeploymentChartWithEphemeral = async (
  propertyIdentifier?: string,
  applicationIdentifier?: string,
  previous?: string
): Promise<Record<string, TSPAMonthlyDeploymentChart[]>> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/env/month', {
    params: {
      propertyIdentifier,
      applicationIdentifier,
      previous
    }
  });

  return data.data;
};

function transformInput(input: TransformedInput): TransformedOutput {
  const environments = ['dev', 'qa', 'prod', 'stage'];
  const output: TransformedOutput = {};

  environments.forEach((env) => {
    output[env] =
      input[env] ||
      input.dev.map((devItem) => ({
        ...devItem,
        env,
        count: 0
      }));
  });

  return output;
}

export const useGetMonthlyDeploymentChartWithEphemeral = (
  propertyIdentifier?: string,
  applicationIdentifier?: string,
  previous?: string
) =>
  useQuery({
    queryKey: analyticsKeys.spaMonthyDeploymentChartWithEphemeral,
    queryFn: () =>
      fetchMonthlyDeploymentChartWithEphemeral(propertyIdentifier, applicationIdentifier, previous),
    select: (data: {
      qa?: IDeploymentData[];
      stage?: IDeploymentData[];
      dev?: IDeploymentData[];
      prod?: IDeploymentData[];
      ephemeral?: IDeploymentData[];
    }) => {
      if (!Object.keys(data).length) {
        // Return an empty object if data is empty
        return {};
      }

      const monthlyDelpoymentData: {
        qa?: IDeploymentData[];
        prod?: IDeploymentData[];
        dev?: IDeploymentData[];
        stage?: IDeploymentData[];
        minDeploymentCount?: number;
        maxDeploymentCount?: number;
        lastMonthEphemeral?: number;
      } = {};

      monthlyDelpoymentData.lastMonthEphemeral =
        data.ephemeral?.reduce((acc, obj) => acc + obj.count, 0) ?? 0;
      monthlyDelpoymentData.minDeploymentCount = Math.min(
        data.qa?.reduce((acc, obj) => Math.min(acc, obj.count), data?.qa?.[0]?.count) ?? 0,
        data.stage?.reduce((acc, obj) => Math.min(acc, obj.count), data?.stage?.[0]?.count) ?? 0,
        data.dev?.reduce((acc, obj) => Math.min(acc, obj.count), data?.dev?.[0]?.count) ?? 0,
        data.prod?.reduce((acc, obj) => Math.min(acc, obj.count), data?.prod?.[0]?.count) ?? 0
      );
      monthlyDelpoymentData.maxDeploymentCount = Math.max(
        data.qa?.reduce((acc, obj) => Math.max(acc, obj.count), 0) ?? 0,
        data.stage?.reduce((acc, obj) => Math.max(acc, obj.count), 0) ?? 0,
        data.dev?.reduce((acc, obj) => Math.max(acc, obj.count), 0) ?? 0,
        data.prod?.reduce((acc, obj) => Math.max(acc, obj.count), 0) ?? 0
      );

      const result = {
        ...transformInput(data),
        ...monthlyDelpoymentData
      };
      return result;
    }
  });

const fetchTotalDeployment = async (
  propertyIdentifier?: string,
  applicationIdentifier?: string
): Promise<TSPADeploymentCount[]> => {
  const { data } = await orchestratorReq.get('analytics/deployment/env', {
    params: { propertyIdentifier, applicationIdentifier }
  });

  return data.data;
};

export const useGetTotalDeployments = (
  propertyIdentifier?: string,
  applicationIdentifier?: string
) =>
  useQuery(
    analyticsKeys.spaDeployments(''),
    () => fetchTotalDeployment(propertyIdentifier, applicationIdentifier),
    {
      refetchOnWindowFocus: true
    }
  );

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

const fetchTotalTimeSaved = async (): Promise<TTotalTimeSaved> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/time?save=true', {
    params: { averageDeploymentTimeInSecs: 1800 }
  });
  return data.data;
};
export const useGetTotalTimeSaved = () => useQuery(analyticsKeys.timeSaved, fetchTotalTimeSaved);

const fetchTotalTimeSavedForLogin = async (): Promise<TTotalTimeSaved> => {
  const { data } = await orchestratorReq.get('/analytics/deployment/time-saved', {
    params: { averageDeploymentTimeInSecs: 1800 }
  });
  return data.data;
};
export const useGetTotalTimeSavedForLogin = () =>
  useQuery(analyticsKeys.timeSaved, fetchTotalTimeSavedForLogin);

const fetchUserWebProperties = async (email: string): Promise<TUserWebProperties[]> => {
  const { data } = await orchestratorReq.get(`/analytics/user/${email}`);
  return data.data;
};
export const userGetUserWebProperties = (email: string) =>
  useQuery(analyticsKeys.userAnalytics as QueryKey, () => fetchUserWebProperties(email));

// export const userGetUserWebProperties = (email: string) => fetchUserWebProperties(email);
