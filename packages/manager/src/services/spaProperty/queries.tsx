import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { orchestratorReq } from '@app/config/orchestratorReq';
import { TAutoEnableSymlinkDTO, TSpaProperty, TSymlinkDTO } from './types';
import { TEnv } from '../persistent/types';
import { TCmdbValidation } from '../webProperty/types';

export const spaPropertyKeys = {
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

const createSymlink = async (dto: TSymlinkDTO): Promise<TEnv> => {
  const { data } = await orchestratorReq.post('/applications/symlink', dto);
  return data.data;
};

export const useAddSymlink = () => useMutation(createSymlink);

const deleteSymlink = async (dto: TSymlinkDTO): Promise<TEnv> => {
  const { data } = await orchestratorReq.delete(`/applications/symlink`, {
    data: dto
  });
  return data.data;
};

export const useDeleteSymlink = () => useMutation(deleteSymlink);

const autoEnableSymlink = async (dto: TAutoEnableSymlinkDTO): Promise<TEnv> => {
  const { data } = await orchestratorReq.post('applications/auto-symlink', dto);
  return data.data;
};

export const useAutoEnableSymlink = () => useMutation(autoEnableSymlink);

export const fetchEditCmdbDetailsForApplication = async (dto: any): Promise<TCmdbValidation[]> => {
  const { data } = await orchestratorReq.post('/sot/cmdb/applications', dto);
  return data.data;
};

export const useGetEditCmdbDetailsForApplication = (webPropertyIdentifier: string) => {
  const queryClient = useQueryClient();

  return useMutation(fetchEditCmdbDetailsForApplication, {
    onSuccess: () => {
      if (webPropertyIdentifier) {
        queryClient.invalidateQueries(spaPropertyKeys.list(webPropertyIdentifier, ''));
      }
    }
  });
};
