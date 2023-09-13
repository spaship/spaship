import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery } from '@tanstack/react-query';
import { TEphemeralEnv } from './types';

const ephemeralQueryKeys = {
  list: (webPropertyIdentifier: string) => ['ephemeral-env', webPropertyIdentifier] as const
};

const fetchEphemeralEnvironments = async (propertyIdentifier: string): Promise<TEphemeralEnv[]> => {
  const { data } = await orchestratorReq.get(`environment/property/${propertyIdentifier}`, {
    params: {
      isEph: true
    }
  });
  if (data.message) {
    return [];
  }
  return data.data;
};

export const useGetEphemeralListForProperty = (webPropertyIdentifier: string) =>
  useQuery(
    ephemeralQueryKeys.list(webPropertyIdentifier),
    () => fetchEphemeralEnvironments(webPropertyIdentifier),
    {
      refetchInterval: 5000
    }
  );
