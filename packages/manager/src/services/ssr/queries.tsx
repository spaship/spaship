import { orchestratorReq } from '@app/config/orchestratorReq';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import {
  TSSRProperty,
  TSSRResponse,
  TSSRConfigure,
  TSSRValidate,
  TSSRValidateResponse,
  TWorkflowResponse
} from './types';

const spaSsrPropertyKeys = {
  list: ['ssr-spa-properties'] as const,
  id: (propertyIdentifier: string) =>
    [...spaSsrPropertyKeys.list, propertyIdentifier, 'envs'] as const
};

const createSsrSpaProperty = async (
  dto: TSSRProperty
): Promise<TSSRResponse | TWorkflowResponse> => {
  const { propertyIdentifier, env, ...newObject } = dto;
  const { data } = await orchestratorReq.post(
    `/applications/deploy/${propertyIdentifier}/${env}`,
    newObject
  );
  return data.data;
};

export const useAddSsrSpaProperty = (propertyIdentifier?: string) => {
  const queryClient = useQueryClient();

  return useMutation(createSsrSpaProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries(spaSsrPropertyKeys.list);
      if (propertyIdentifier) {
        queryClient.invalidateQueries(spaSsrPropertyKeys.id(propertyIdentifier));
      }
    }
  });
};

const configureSsrSpaProperty = async (
  dto: TSSRConfigure
): Promise<TSSRResponse | TWorkflowResponse> => {
  const { data } = await orchestratorReq.post('/applications/config', dto);
  return data.data;
};

export const useConfigureSsrSpaProperty = (propertyIdentifier?: string) => {
  const queryClient = useQueryClient();

  return useMutation(configureSsrSpaProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries(spaSsrPropertyKeys.list);
      if (propertyIdentifier) {
        queryClient.invalidateQueries(spaSsrPropertyKeys.id(propertyIdentifier));
      }
    }
  });
};

const validateSsrSpaProperty = async (dto: TSSRValidate): Promise<TSSRValidateResponse> => {
  const { data } = await orchestratorReq.post('/applications/git/validate', dto);
  return data.data;
};

export const useValidateSsrSpaProperty = (propertyIdentifier?: string) => {
  const queryClient = useQueryClient();

  return useMutation(validateSsrSpaProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries(spaSsrPropertyKeys.list);
      if (propertyIdentifier) {
        queryClient.invalidateQueries(spaSsrPropertyKeys.id(propertyIdentifier));
      }
    }
  });
};
