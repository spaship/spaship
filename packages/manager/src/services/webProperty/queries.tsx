import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orchestratorReq } from '@app/config/orchestratorReq';
import { TCreateWebPropertyDTO, TWebProperty } from './types';

const webPropertyKeys = {
  list: ['web-properties'] as const,
  id: (propertyIdentifier: string) => [...webPropertyKeys.list, propertyIdentifier, 'envs'] as const
};

// GET Operations
const fetchWebProperties = async (): Promise<TWebProperty[]> => {
  const { data } = await orchestratorReq.get('property');
  return data.data;
};

export const useGetWebProperties = <T extends unknown>(select?: (data: TWebProperty[]) => T) =>
  useQuery(webPropertyKeys.list, fetchWebProperties, { select });

// POST OPERATIONS
const createAWebProperty = async (dto: TCreateWebPropertyDTO): Promise<TWebProperty> => {
  const { data } = await orchestratorReq.post('/property', dto);
  return data.data;
};

export const useAddWebProperty = (propertyIdentifier?: string) => {
  const queryClient = useQueryClient();

  return useMutation(createAWebProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries(webPropertyKeys.list);
      if (propertyIdentifier) {
        queryClient.invalidateQueries(webPropertyKeys.id(propertyIdentifier));
      }
    }
  });
};
