import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery } from '@tanstack/react-query';
import { THoursSaved } from './types';

const developerMetricsKeys = {
  developerMetrics: ['developer-metrics-keys'] as const
};

const fetchTotalSavingsByDevelopers = async (month?: string): Promise<THoursSaved[]> => {
  const { data } = await orchestratorReq.get('analytics/developer', {
    params: { month }
  });

  return data.data;
};

export const useGeTotalSavingsByDevelopers = (month?: string) =>
  useQuery(developerMetricsKeys.developerMetrics, () => fetchTotalSavingsByDevelopers(month));
