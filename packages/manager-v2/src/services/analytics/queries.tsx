import { useQuery } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import { TDeploymentCount } from './types';

const webPropertyKeys = {
  deploy: ['deployment-count'] as const
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
  useQuery(webPropertyKeys.deploy, fetchDeploymentCounts, {
    select: groupDeploymentCountByPropertyName
  });
