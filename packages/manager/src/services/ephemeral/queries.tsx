import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery } from '@tanstack/react-query';
import { TEphemeralEnv } from './types';

const ephemeralQueryKeys = {
  list: (webPropertyName: string) => ['ephemeral-env', webPropertyName] as const
};

const fetchEphemeralEnvironments = async (propertyName: string): Promise<TEphemeralEnv[]> => {
  const { data } = await orchestratorReq.get(`/webproperty/eph/list`, {
    params: {
      propertyName
    }
  });
  if (data.message) {
    return [];
  }
  return data.data;
};

export const useGetEphemeralList = (webPropertyName: string) =>
  useQuery(
    ephemeralQueryKeys.list(webPropertyName),
    () => fetchEphemeralEnvironments(webPropertyName),
    {
      refetchInterval: 5000
    }
  );
