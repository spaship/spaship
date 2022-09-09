import { useQuery } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import { TSpaProperty } from './types';

const spaPropertyKeys = {
  list: (webProperyName: string) => ['spa-properties', webProperyName] as const
};

// GET Operations
const fetcSpaProperties = async (propertName: string) => {
  const { data } = await orchestratorReq.get(`/webproperty/get/applications/${propertName}`);
  return data.data;
};

export const useGetSPAProperties = <T extends unknown>(
  webProperyName: string,
  select?: (data: TSpaProperty[]) => T
) =>
  useQuery(spaPropertyKeys.list(webProperyName), () => fetcSpaProperties(webProperyName), {
    select
  });

const groupSpaPropertyByName = (spaProperty: TSpaProperty[]) => {
  const groupBy: Record<string, TSpaProperty[]> = {};
  spaProperty.forEach((prop) => {
    if (groupBy?.[prop.name]) {
      groupBy[prop.name].push(prop);
    } else {
      groupBy[prop.name] = [prop];
    }
  });

  return groupBy;
};

export const useGetSPAPropGroupByName = (webProperyName: string) =>
  useGetSPAProperties(webProperyName, groupSpaPropertyByName);
