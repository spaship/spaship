import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orchestratorReq } from '@app/config/orchestratorReq';
import { TApiKey, TCreateApiKeyDTO, TCreateApiKeyRes, TDeleteApiKeyDTO } from './types';

const apiKeyQueryKeys = {
  list: (webPropertyIdentifier: string) => ['api-keys', webPropertyIdentifier] as const
};

// GET Operations
const fetchSpaProperties = async (propertyIdentifier: string): Promise<TApiKey[]> => {
  const { data } = await orchestratorReq.get(`/apikey/${propertyIdentifier}`);
  return data.data;
};

// TODO: Backend returns 404 not found error for empty list of api keys causing retry
export const useGetApiKeys = (webPropertyIdentifier: string) =>
  useQuery(apiKeyQueryKeys.list(webPropertyIdentifier), () =>
    fetchSpaProperties(webPropertyIdentifier)
  );

// POST Operations
export const createAPIKey = async (dto: TCreateApiKeyDTO): Promise<TCreateApiKeyRes> => {
  const { data } = await orchestratorReq.post('/applications/validate', dto);
  return data.data;
};

export const useCreateAPIKey = (property: string) => {
  const queryClient = useQueryClient();

  return useMutation(createAPIKey, {
    onSuccess: () => {
      queryClient.invalidateQueries(apiKeyQueryKeys.list(property));
    }
  });
};

// DELETE OPERATIONS
export const deleteAPIKey = async (dto: TDeleteApiKeyDTO) => {
  const { data } = await orchestratorReq.delete(
    `/apikey/${dto.propertyIdentifier}/${dto.shortKey}`
  );
  return data.data;
};

export const useDeleteAPIKey = (property: string) => {
  const queryClient = useQueryClient();

  return useMutation(deleteAPIKey, {
    onSuccess: () => {
      queryClient.invalidateQueries(apiKeyQueryKeys.list(property));
    }
  });
};
