import { orchestratorReq } from '@app/config/orchestratorReq';
import { THistoryData } from '@app/services/history/types';
import { useQuery } from '@tanstack/react-query';

const fetchHistoryData = async (
  propertyIdentifier: string,
  applicationIdentifier?: string
): Promise<THistoryData[]> => {
  const params: { propertyIdentifier: string; actions: string; applicationIdentifier?: string } = {
    propertyIdentifier,
    actions:
      'APIKEY_CREATED,APPLICATION_DEPLOYMENT_STARTED,APPLICATION_BUILD_STARTED,APIKEY_DELETED'
  };

  if (applicationIdentifier) {
    params.applicationIdentifier = applicationIdentifier;
  }

  const { data } = await orchestratorReq.get('analytics/history', {
    params
  });

  return data?.data;
};

export const useGetHistoryData = (propertyIdentifier: string, applicationIdentifier?: string) =>
  useQuery(['historyData', propertyIdentifier, applicationIdentifier], () =>
    fetchHistoryData(propertyIdentifier, applicationIdentifier)
  );
