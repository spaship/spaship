import { useQuery } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import { TDeploymentCount, TWebPropActivityStream } from './types';

const analyticsKeys = {
  deploy: ['deployment-count'] as const,
  propertyActivityStream: (id: string) => ['activity-stream', id] as const
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
  webProperty: string
): Promise<TWebPropActivityStream[]> => {
  const { data } = await orchestratorReq.post('/event/fetch/analytics/filter', {
    activities: {
      propertyName: webProperty
    }
  });
  return data.data;
};

export const useGetWebPropActivityStream = (webProperty: string) =>
  useQuery(analyticsKeys.propertyActivityStream(webProperty), () =>
    fetchWebPropertyActivityStream(webProperty)
  );
