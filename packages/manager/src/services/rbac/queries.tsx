import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orchestratorReq } from '@app/config/orchestratorReq';
import toast from 'react-hot-toast';
import {
  TCreateApiKeyRes,
  TIndividualRole,
  TUserList,
  TRoverGroupList,
  TMemberforSPA,
  TAddPermissionDTO,
  TDeletePermissionDTO,
  TRoleforMember
} from './types';

const rbacKeyQueryKeys = {
  list: (webPropertyIdentifier: string) => ['rbac-keys', webPropertyIdentifier] as const
};
// fetches userlist from rover from name string
export const fetchUserlist = async (name: string): Promise<TUserList[]> => {
  const { data } = await orchestratorReq.get(`/sot/rover/user/${name}`);
  return data.data;
};
// fetches rover group from rover
export const fetchRoverGroup = async (groupName: string): Promise<TRoverGroupList[]> => {
  const { data } = await orchestratorReq.get(`/sot/rover/group/${groupName}`);
  return data.data;
};
// fetches details from individual
export const fetchRoleForIndividual = async (
  propertyIdentifier: string,
  name: string
): Promise<TIndividualRole[]> => {
  const { data } = await orchestratorReq.get(
    `/permission?propertyIdentifier=${propertyIdentifier}&name=${name}`
  );
  return data.data;
};
export const useGetRoleForIndividual = (webPropertyIdentifier: string, name: string) =>
  useQuery(rbacKeyQueryKeys.list(webPropertyIdentifier), () =>
    fetchRoleForIndividual(webPropertyIdentifier, name)
  );
export const fetchRoleForRoverGroup = async (
  propertyIdentifier: string,
  name: string
): Promise<TIndividualRole[]> => {
  const { data } = await orchestratorReq.get(
    `/permission?propertyIdentifier=${propertyIdentifier}&name=${name}`
  );
  return data.data;
};
export const fetchRoleforMember = async (): Promise<TRoleforMember[]> => {
  const { data } = await orchestratorReq.get(`/role`);
  return data.data;
};
// fetches role for a given spa --GET Operations
export const fetchMemberforSPA = async (propertyIdentifier: string): Promise<TMemberforSPA[]> => {
  const { data } = await orchestratorReq.get(
    `/permission?propertyIdentifier=${propertyIdentifier}&group=email`
  );
  return data.data;
};
// TODO: Backend returns 404 not found error for empty list of api keys causing retry
export const useGetMemberforSPA = (webPropertyIdentifier: string) =>
  useQuery(rbacKeyQueryKeys.list(webPropertyIdentifier), () =>
    fetchMemberforSPA(webPropertyIdentifier)
  );
// Adds permission for the user POST Operations
export const addPermission = async (dto: TAddPermissionDTO): Promise<TCreateApiKeyRes> => {
  const { data } = await orchestratorReq.post('/permission', dto);
  return data.data;
};
export const useAddPermission = (property: string) => {
  const queryClient = useQueryClient();
  return useMutation(addPermission, {
    onSuccess: () => {
      queryClient.invalidateQueries(rbacKeyQueryKeys.list(property));
    },
    onError: (error: any) => {
      if (error.response.status === 403) {
        toast.error("You don't have access to perform this action");
      }
    }
  });
};
// Deletes permission for the user
export const useDeletePermission = async (dto: TDeletePermissionDTO): Promise<TUserList[]> => {
  const { data } = await orchestratorReq.delete('/permission', { data: dto });
  return data.data;
};
export const useDeleteMember = (property: string) => {
  const queryClient = useQueryClient();
  return useMutation(useDeletePermission, {
    onSuccess: () => {
      queryClient.invalidateQueries(rbacKeyQueryKeys.list(property));
    }
  });
};
