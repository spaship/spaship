import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery } from '@tanstack/react-query';

const logKeys = {
  logs: ['logs'] as const,
  getPodList: ['getPodList'] as const
};
export const fetchLogsforSpa = async (
  propertyIdentifier: string,
  applicationIdentifier: string,
  env: string,
  type?: string | number,
  id?: string
): Promise<any> => {
  try {
    const { data } = await orchestratorReq.get(
      `/applications/log/${propertyIdentifier}/${env}/${applicationIdentifier}/`,
      {
        params: {
          type,
          id,
          lines: 2000
        }
      }
    );

    return data?.data || [];
  } catch (e) {
    return '';
  }
};

export const useGetLogsforSpa = (
  webPropertyIdentifier: string,
  applicationIdentifier: string,
  env: string,
  type?: string,
  id?: string
) => {
  const refetchInterval = 5000;

  return useQuery(
    logKeys.logs,
    () => fetchLogsforSpa(webPropertyIdentifier, applicationIdentifier, env, type, id),
    {
      refetchInterval
    }
  );
};

const fetchListOfPods = async (
  propertyIdentifier: string,
  spaName: string,
  env: string
): Promise<any> => {
  const { data } = await orchestratorReq.get(
    `/applications/pods/${propertyIdentifier}/${env}/${spaName}`
  );
  return data.data;
};

export const useListOfPods = (propertyIdentifier: string, spaName: string, env: string) =>
  useQuery(logKeys.getPodList, () => fetchListOfPods(propertyIdentifier, spaName, env));
