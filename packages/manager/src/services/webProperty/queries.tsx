import { useMutation, useQuery, useQueryClient, UseQueryResult } from '@tanstack/react-query';
import { orchestratorReq } from '@app/config/orchestratorReq';
import { TCreateWebPropertyDTO, TUniqueWebProperty, TWebProperty } from './types';

const webPropertyKeys = {
  list: ['web-properties'] as const,
  id: (propertyName: string) => [...webPropertyKeys.list, propertyName, 'envs'] as const
};

// GET Operations
const fetchWebProperties = async (): Promise<TWebProperty[]> => {
  const { data } = await orchestratorReq.get('/webproperty/alias/list');
  return data.data;
};

export const useGetWebProperties = <T extends unknown>(select?: (data: TWebProperty[]) => T) =>
  useQuery(webPropertyKeys.list, fetchWebProperties, { select });

const getUniqueWebProperties = (webProperties: TWebProperty[]): TUniqueWebProperty[] => {
  const hasSeenWebProperty: Record<string, boolean> = {};
  const uniqueWebProperties: TUniqueWebProperty[] = [];
  webProperties.forEach(({ createdBy, propertyName, propertyTitle, url }) => {
    if (!hasSeenWebProperty?.[propertyName]) {
      uniqueWebProperties.push({ createdBy, propertyName, url, propertyTitle });
      hasSeenWebProperty[propertyName] = true;
    }
  });

  return uniqueWebProperties;
};

export const useGetUniqueWebProperties = () => useGetWebProperties(getUniqueWebProperties);

// webproperty list filterest by propertyName
const fetchEnvList = async (propertyName: string): Promise<TWebProperty[]> => {
  const { data } = await orchestratorReq.get(`/webproperty/alias/list/${propertyName}`);
  // TODO: To be removed after backend revamp
  if (data.data) {
    data.data = data.data.filter((spa: any) => !spa.env.startsWith('ephemeral'));
  }
  return data.data;
};

type UseQuerySelect<K extends any> = {
  (webPropertyName: string): UseQueryResult<K>;
  <T extends unknown>(webPropertyName: string, select?: (data: K) => T): UseQueryResult<T>;
};

export const useGetEnvList: UseQuerySelect<TWebProperty[]> = <T extends any>(
  webProperyName: string,
  select?: (data: TWebProperty[]) => T
) =>
  useQuery(webPropertyKeys.id(webProperyName), () => fetchEnvList(webProperyName), {
    select
  }) as UseQueryResult<T extends undefined ? TWebProperty[] : T>;

const groupWebPropertyByEnv = (webProperties: TWebProperty[]): Record<string, TWebProperty> => {
  const groupBy: Record<string, TWebProperty> = {};
  webProperties.forEach((prop) => {
    groupBy[prop.env] = prop;
  });

  return groupBy;
};

export const useGetWebPropertyGroupedByEnv = (webProperty: string) =>
  useGetEnvList(webProperty, groupWebPropertyByEnv);

// POST OPERATIONS
const createAWebProperty = async (dto: TCreateWebPropertyDTO): Promise<TWebProperty> => {
  const { data } = await orchestratorReq.post('/webproperty/alias', dto);
  return data.data;
};

export const useAddWebPropery = (propertyName?: string) => {
  const queryClient = useQueryClient();

  return useMutation(createAWebProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries(webPropertyKeys.list);
      if (propertyName) {
        queryClient.invalidateQueries(webPropertyKeys.id(propertyName));
      }
    }
  });
};
