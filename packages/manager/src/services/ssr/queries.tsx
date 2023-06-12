/* eslint-disable no-underscore-dangle */
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

export const useAddSsrSpaProperty = () => {
  const queryClient = useQueryClient();

  return useMutation(createSsrSpaProperty, {
    onSuccess: (data: any) => {
      const intervalId = setInterval(() => {
        queryClient.invalidateQueries({
          queryKey: [data._id]
        });
      }, 10000); // 10 seconds in milliseconds
      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, 600000); // 10 minutes in milliseconds

      return () => {
        clearInterval(intervalId);
        clearTimeout(timeoutId);
      };
    }
  });
};
const configureSsrSpaProperty = async (
  dto: TSSRConfigure
): Promise<TSSRResponse | TWorkflowResponse> => {
  const { data } = await orchestratorReq.post('/applications/config', dto);
  return data.data;
};

export const useConfigureSsrSpaProperty = () => useMutation(configureSsrSpaProperty);

const validateSsrSpaProperty = async (dto: TSSRValidate): Promise<TSSRValidateResponse> => {
  const { data } = await orchestratorReq.post('/applications/git/validate', dto);
  return data.data;
};

export const useValidateSsrSpaProperty = () => useMutation(validateSsrSpaProperty);
