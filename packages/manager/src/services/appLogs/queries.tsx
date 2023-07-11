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
  id?: string
): Promise<any> => {
  // console.log('fetchLogsforSpa', propertyIdentifier, applicationIdentifier, env, type, id);
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
  type?: string | number,
  id?: string
) => {
  const refetchInterval = 5000;
  const queryClient = useQueryClient();

  return useQuery(
    logKeys.logs,
    () => fetchLogsforSpa(webPropertyIdentifier, applicationIdentifier, env, type, id),
    {
      refetchInterval,
      initialData: () => {
        queryClient.prefetchQuery(logKeys.logs, () =>
          fetchLogsforSpa(webPropertyIdentifier, applicationIdentifier, env, type, id)
        );
      },
      enabled: id !== undefined, // Only enable the query when id is defined
      cacheTime: 0, // Disable cache for immediate updates
      staleTime: 0 // Disable cache for immediate updates
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
  console.log('>>>>fetch', propertyIdentifier, spaName, env, data.data);

  return data.data;
};

export const useListOfPods = (propertyIdentifier: string, spaName: string, env: string) =>
  useQuery(logKeys.getPodList, () => fetchListOfPods(propertyIdentifier, spaName, env));

// const fetchListOfPods = async (
//   propertyIdentifier: string,
//   spaName: string,
//   env: string
// ): Promise<any> => {
//   const { data } = await orchestratorReq.get(
//     `/applications/pods/${propertyIdentifier}/${env}/${spaName}`
//   );
//   console.log('>>>>fetch', propertyIdentifier, spaName, env, data.data);

//   return data.data;
// };

// export const useListOfPods = (propertyIdentifier: string, spaName: string, env: string) => {
//   console.log('useListOfPods', propertyIdentifier, spaName, env);
//   return useQuery(logKeys.getPodList, () => fetchListOfPods(propertyIdentifier, spaName, env));
// };

// export const useListOfPods = async (propertyIdentifier: string, spaName: string, env: string) => {
//   try {
//     const result = await fetchListOfPods(propertyIdentifier, spaName, env);
//     console.log('>>fetch', result);
//     return result;
//   } catch (error) {
//     console.log('error', error.response.data);
//   }
// };

// export const useListOfPods = (propertyIdentifier: string, spaName: string, env: string) => {
//   const queryClient = useQueryClient();

//   return queryClient.fetchQuery(logKeys.getPodList, () =>
//     fetchListOfPods(propertyIdentifier, spaName, env)
//   );
// };
