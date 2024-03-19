import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery, useQueryClient } from '@tanstack/react-query';

const logKeys = {
  logs: ['logs'] as const,
  getPodList: ['getPodList'] as const
};
export const fetchLogsforSpa = async (
  propertyIdentifier: string,
  applicationIdentifier: string,
  env: string,
  type?: string | number,
  id?: string,
  con?: string
): Promise<any> => {
  try {
    const { data } = await orchestratorReq.get(
      `/applications/log/${propertyIdentifier}/${env}/${applicationIdentifier}/`,
      {
        params: {
          type,
          id,
          con,
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
  type?: string | number,
  id?: string,
  con?: string
) => {
  const refetchInterval = 5000;
  const queryClient = useQueryClient();

  return useQuery(
    logKeys.logs,
    () => fetchLogsforSpa(webPropertyIdentifier, applicationIdentifier, env, type, id, con),
    {
      refetchInterval,
      initialData: () => {
        queryClient.prefetchQuery(logKeys.logs, () =>
          fetchLogsforSpa(webPropertyIdentifier, applicationIdentifier, env, type, id, con)
        );
      },
      enabled: id !== undefined,
      cacheTime: 0,
      staleTime: 0,
      onError: () => ({ data: '', isError: true })
    }
  );
};

const fetchListOfPods = async (
  propertyIdentifier: string,
  spaName: string,
  env: string,
  isStatic?: boolean
): Promise<any> => {
  let url = `/applications/pods/${propertyIdentifier}/${env}/${spaName}`;

  if (isStatic) {
    // If isStatic is true, include deploymentType in the URL
    const deploymentType = 'static';
    url += `/?deploymentType=${deploymentType}`;
  }

  const { data } = await orchestratorReq.get(url);
  console.log('>>>>>>', data);
  return data?.data || [];
};

// const fetchListOfPods = async (
//   propertyIdentifier: string,
//   spaName: string,
//   env: string,
//   isStatic?: boolean
//   // deploymentType?: string
// ): Promise<any> => {
//   const { data } = await orchestratorReq.get(
//     `/applications/pods/${propertyIdentifier}/${env}/${spaName}/?deploymentType=${deploymentType}`
//   );

//   return data?.data || [];
// };

export const useListOfPods = (
  propertyIdentifier: string,
  spaName: string,
  env: string,
  isStatic?: boolean
) =>
  useQuery(logKeys.getPodList, () => fetchListOfPods(propertyIdentifier, spaName, env, isStatic));
