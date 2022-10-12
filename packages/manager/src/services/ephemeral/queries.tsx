import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery } from '@tanstack/react-query';
import { TEphemeralEnv } from './types';

const ephemeralQueryKeys = {
  list: (webPropertyName: string) => ['ephemeral-env', webPropertyName] as const
};

const path = `/webproperty/eph/list?propertyName=`;

const fetchEphemeralEnvironments = async (propertyName: string): Promise<TEphemeralEnv[]> => {
  const { data } = await orchestratorReq.get(`${path}${propertyName}`);
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
      refetchInterval: 13000
    }
  );
