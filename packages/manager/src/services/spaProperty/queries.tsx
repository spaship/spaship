import { useQuery } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import { TSpaProperty } from './types';

const spaPropertyKeys = {
  list: (webProperyName: string) => ['spa-properties', webProperyName] as const
};

// GET Operations
const fetchSpaProperties = async (propertName: string) => {
  const { data } = await orchestratorReq.get(`/webproperty/get/applications/${propertName}`);
  return data.data;
};

export const useGetSPAProperties = <T extends unknown>(
  webProperyName: string,
  select?: (data: TSpaProperty[]) => T
) =>
  useQuery(spaPropertyKeys.list(webProperyName), () => fetchSpaProperties(webProperyName), {
    select
  });

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

export const useGetSPAPropGroupByName = (webProperyName: string) =>
  useGetSPAProperties(webProperyName, groupSpaPropertyByName);
