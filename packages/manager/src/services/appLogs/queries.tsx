import { orchestratorReq } from '@app/config/orchestratorReq';

export const fetchLogsforSpa = async (
  propertyIdentifier: string,
  applicationIdentifier: string,
  env: string,
  type?: string,
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
