import { useQuery } from '@tanstack/react-query';
import { orchestratorReq } from '@app/config/orchestratorReq';
import { TUniqueWebProperty, TWebProperty } from './types';

const webPropertyKeys = {
  list: ['web-properties'] as const
};

const fetchWebProperties = async (): Promise<TWebProperty[]> => {
  const { data } = await orchestratorReq.get('/webproperty/alias/list');
  return data.data;
};

export const useGetWebProperties = <T extends unknown>(select?: (data: TWebProperty[]) => T) =>
  useQuery(webPropertyKeys.list, fetchWebProperties, { select });

const transformAllToUniqueWebProperties = (webProperties: TWebProperty[]): TUniqueWebProperty[] => {
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

export const useGetUniqueWebProperties = () =>
  useGetWebProperties(transformAllToUniqueWebProperties);
