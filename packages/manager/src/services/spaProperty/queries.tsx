import { useQuery } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import { TSpaProperty } from './types';

const spaPropertyKeys = {
  list: (webPropertyIdentifier: string) => ['spa-properties', webPropertyIdentifier] as const
};
const LIMIT = 10;
// GET Operations
const fetchAppsForProperties = async (propertyIdentifier: string, env: String, skip?: number) => {
  const { data } = await orchestratorReq.get(`/applications/property/${propertyIdentifier}`, {
    params: {
      env,
      limit: LIMIT,
      skip
    }
  });
  // TODO: To be removed after backend revamp
  if (data.data) {
    data.data = data.data.filter((spa: any) => !spa.env.startsWith('ephemeral'));
  }
  return data.data || [];
};

export const useGetSPAProperties = <T extends unknown>(
  webPropertyIdentifier: string,
  env: string,
  skip?: number,
  select?: (data: TSpaProperty[]) => T
) =>
  useQuery(
    spaPropertyKeys.list(webPropertyIdentifier),
    () => fetchAppsForProperties(webPropertyIdentifier, env, skip),
    {
      select,
      refetchInterval: 20
    }
  );

const groupSpaPropertyByName = (spaProperty: TSpaProperty[]) => {
  const groupBy: Record<string, TSpaProperty[]> = {};
  spaProperty.forEach((prop) => {
    if (groupBy?.[prop.identifier]) {
      groupBy[prop.identifier].push(prop);
    } else {
      groupBy[prop.identifier] = [prop];
    }
  });

  return groupBy;
};

export const useGetSPAPropGroupByName = (
  webPropertyIdentifier: string,
  env: string,
  skip?: number
) => useGetSPAProperties(webPropertyIdentifier, env, skip, groupSpaPropertyByName);
