import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery, UseQueryResult } from '@tanstack/react-query';
import { TEnv } from './types';

const persistentEnvQueryKeys = {
  list: (webPropertyIdentifier: string) => ['persistent-env', webPropertyIdentifier] as const
};

const fetchPersistentEnvironments = async (propertyIdentifier: string): Promise<TEnv[]> => {
  const { data } = await orchestratorReq.get(`environment/${propertyIdentifier}`, {
    params: {
      isEph: false
    }
  });
  if (data.message) {
    return [];
  }
  return data.data;
};

export const useGetPersistentEnvList = (webPropertyIdentifier: string) =>
  useQuery(persistentEnvQueryKeys.list(webPropertyIdentifier), () =>
    fetchPersistentEnvironments(webPropertyIdentifier)
  );

const webPropertyKeys = {
  list: ['web-properties'] as const,
  id: (propertyIdentifier: string) => [...webPropertyKeys.list, propertyIdentifier, 'envs'] as const
};

type UseQuerySelect<K extends any> = {
  (webPropertyIdentifier: string): UseQueryResult<K>;
  <T extends unknown>(webPropertyIdentifier: string, select?: (data: K) => T): UseQueryResult<T>;
};

export const useGetEnvList: UseQuerySelect<TEnv[]> = <T extends any>(
  webPropertyIdentifier: string,
  select?: (data: TEnv[]) => T
) =>
  useQuery(
    webPropertyKeys.id(webPropertyIdentifier),
    () => fetchPersistentEnvironments(webPropertyIdentifier),
    {
      select
    }
  ) as UseQueryResult<T extends undefined ? TEnv[] : T>;

const groupWebPropertyByEnv = (webProperties: TEnv[]): Record<string, TEnv> => {
  const groupBy: Record<string, TEnv> = {};
  webProperties.forEach((prop) => {
    groupBy[prop.env] = prop;
  });

  return groupBy;
};

export const useGetWebPropertyGroupedByEnv = (webProperty: string) =>
  useGetEnvList(webProperty, groupWebPropertyByEnv);
