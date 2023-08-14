import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery } from '@tanstack/react-query';
import { THoursSaved } from './types';

const developerMetricsKeys = {
  developerMetrics: ['developer-metrics-keys'] as const
};

const fetchTotalSavingsByDevelopers = async (month?: string): Promise<THoursSaved> => {
  const { data } = await orchestratorReq.get('analytics/developer', {
    params: { month, averageDeploymentTimeInSecs: 1800 }
  });
  return data.data;
};

export const useGeTotalSavingsByDevelopers = (month?: string) =>
  useQuery(developerMetricsKeys.developerMetrics, () => fetchTotalSavingsByDevelopers(month));

const fetchTotalSavingsByDevelopersForAdmin = async (month?: string): Promise<THoursSaved> => {
  const { data } = await orchestratorReq.get('analytics/developer', {
    params: { month, mode: 'spaship-admin', averageDeploymentTimeInSecs: 1800 }
  });
  return data.data;
};

export const useGeTotalSavingsByDevelopersForAdmin = (month?: string) =>
  useQuery(developerMetricsKeys.developerMetrics, () =>
    fetchTotalSavingsByDevelopersForAdmin(month)
  );
