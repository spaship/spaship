import { useQuery } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import { TSpaProperty } from './types';

const spaPropertyKeys = {
  list: (webPropertyIdentifier: string, env: string = '') =>
    ['spa-properties', webPropertyIdentifier, env] as const
};

// GET Operations
const fetchAppsForProperties = async (propertyIdentifier: string, env: string) => {
  const { data } = await orchestratorReq.get(`/applications/property/${propertyIdentifier}`, {
    params: {
      env
    }
  });
  // TODO: To be removed after backend revamp
  if (data.data) {
    data.data = data.data.filter((spa: any) => !spa.env.startsWith('ephemeral'));
  }
  return data.data || [];
};

export const useGetSPAProperties = <T,>(
  webPropertyIdentifier: string,
  env: string,
  select?: (data: TSpaProperty[]) => T
) =>
  useQuery(
    spaPropertyKeys.list(webPropertyIdentifier, env),
    () => fetchAppsForProperties(webPropertyIdentifier, env),
    {
      select,
      refetchInterval: 10000
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

export const useGetSPAPropGroupByName = (webPropertyIdentifier: string, env: string) =>
  useGetSPAProperties(webPropertyIdentifier, env, groupSpaPropertyByName);

const fetchStatusForAnApplication = async (link: string): Promise<boolean> => {
  try {
    await orchestratorReq.get(`/applications/status?accessUrl=${link}`);
    return true;
  } catch (err) {
    return false;
  }
};

export const useGetStatusForAnApplication = (link: string, _id: string) =>
  useQuery([`${link}_${_id}`], () => fetchStatusForAnApplication(link));
