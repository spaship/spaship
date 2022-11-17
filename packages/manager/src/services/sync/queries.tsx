import { orchestratorReq } from '@app/config/orchestratorReq';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { TCreateSync, TSyncResponse } from './types';

const syncKeys = {
  list: ['persistent-env'] as const,
  id: (propertyIdentifier: string) => [propertyIdentifier, 'persistent-env'] as const
};

// POST Operation
const updateSync = async (dto: TCreateSync): Promise<TSyncResponse> => {
  const { data } = await orchestratorReq.post(`environment/sync/`, dto);
  return data.data;
};

export const useUpdateSync = (propertyIdentifier: string) => {
  const queryClient = useQueryClient();

  return useMutation(updateSync, {
    onSuccess: () => {
      queryClient.invalidateQueries(syncKeys.list);
      if (propertyIdentifier) {
        queryClient.invalidateQueries(syncKeys.id(propertyIdentifier));
      }
    }
  });
};
