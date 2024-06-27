import { orchestratorReq } from '@app/config/orchestratorReq';
import { THistoryData } from '@app/services/history/types';
import { useQuery } from '@tanstack/react-query';

const fetchHistoryData = async (
  propertyIdentifier: string,
  applicationIdentifier?: string
): Promise<THistoryData[]> => {
  const { data } = await orchestratorReq.get('analytics/history', {
    params: {
      propertyIdentifier,
      applicationIdentifier,
      actions: 'APIKEY_CREATED,APPLICATION_DEPLOYMENT_STARTED,APPLICATION_BUILD_STARTED'
    }
  });
  return data?.data;
};

export const useGetHistoryData = (propertyIdentifier: string, applicationIdentifier?: string) =>
  useQuery(['historyData', propertyIdentifier, applicationIdentifier], () =>
    fetchHistoryData(propertyIdentifier, applicationIdentifier)
  );
