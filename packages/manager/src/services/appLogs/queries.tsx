import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery } from '@tanstack/react-query';

const logsQueryKeys = {
  list: (webPropertyIdentifier: string) => ['ephemeral-env', webPropertyIdentifier] as const
};

export const fetchLogsforSpa = async (
  propertyIdentifier: string,
  applicationIdentifier: string,
  env: string,
  type?: string,
  id?: string
): Promise<any> => {
  const { data } = await orchestratorReq.get(
    `/applications/log/${propertyIdentifier}/${env}/${applicationIdentifier}/`,
    {
      params: {
        type,
        id,
        lines: 100
      }
    }
  );
  return data.data;
};

export const useGetLogsforSpa = async (
  webPropertyIdentifier: string,
  applicationIdentifier: string,
  env: string,
  type?: string,
  id?: string
) => {
  await useQuery(logsQueryKeys.list(webPropertyIdentifier), () =>
    fetchLogsforSpa(webPropertyIdentifier, applicationIdentifier, env, type, id)
  );
};
