import { orchestratorReq } from '@app/config/orchestratorReq';
import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { TCreateEnvDTO, TEnv } from './types';

const persistentEnvQueryKeys = {
  list: (webPropertyIdentifier: string) => ['persistent-env', webPropertyIdentifier] as const
};

const fetchPersistentEnvironments = async (propertyIdentifier: string): Promise<TEnv[]> => {
  const { data } = await orchestratorReq.get(`environment/property/${propertyIdentifier}`, {
    params: {
      isEph: false
    }
  });
  if (data.message) {
    return [];
  }
  return data.data;
};

/**
 * Get a list of persistent envs
 * @param webPropertyIdentifier property-identifier
 * @returns Promise - List of envs for a specific property
 */
export const useGetPersistentEnvList = (webPropertyIdentifier: string) =>
  useQuery(persistentEnvQueryKeys.list(webPropertyIdentifier), () =>
    fetchPersistentEnvironments(webPropertyIdentifier)
  );

const webPropertyKeys = {
  list: ['persistent-env'] as const,
  id: (propertyIdentifier: string) =>
    [...webPropertyKeys.list, propertyIdentifier, 'persistent-env'] as const
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

// POST OPERATIONS
const createEnv = async (dto: TCreateEnvDTO): Promise<TEnv> => {
  const { data } = await orchestratorReq.post('environment', dto);
  return data.data;
};

export const useAddEnv = (propertyIdentifier?: string) => {
  const queryClient = useQueryClient();

  return useMutation(createEnv, {
    onSuccess: () => {
      queryClient.invalidateQueries(webPropertyKeys.list);
      if (propertyIdentifier) {
        queryClient.invalidateQueries(webPropertyKeys.id(propertyIdentifier));
      }
    }
  });
};
