import { useQuery } from '@tanstack/react-query';
import { orchestratorReq } from '@app/config/orchestratorReq';
import { TBuildIdForLighthouse } from './types';

const lighthouseKeys = {
  list: (webPropertyIdentifier: string, env: string = '') =>
    ['lighthouse', webPropertyIdentifier, env] as const
};

type LighthouseData = {
  data?: {
    lhIdentifier: string;
  }[];
};

const fetchLhIdentifierForLighthouse = async (
  propertyIdentifier: string,
  identifier: string,
  env: string
): Promise<string[]> => {
  const { data } = await orchestratorReq.get(
    `/lighthouse/spaship-manager/dev/lighthouse/lighthouse_dev_static_2`
  );

  console.log('fetchLighthouseReportForGivenBuildId', data.data[0]);

  return data.data[0] || [];
};

export const useGetLhIdentifierForLighthouse = (
  webPropertyIdentifier: string,
  identifier: string,
  env: string
) =>
  useQuery(lighthouseKeys.list(webPropertyIdentifier, env), () =>
    fetchLhIdentifierForLighthouse(webPropertyIdentifier, identifier, env)
  );

const fetchLighthouseReportForGivenBuildId = async (
  propertyIdentifier: string,
  identifier: string,
  env: string,
  buildId: string
): Promise<string[]> => {
  const { data } = await orchestratorReq.get(
    `/lighthouse/spaship-manager/dev/lighthouse/lighthouse_dev_static_2`,
    {
      params: {
        skip: 'lhBuildId'
      }
    }
  );

  console.log('fetchLighthouseReportForGivenBuildId', data.data[0]);

  return data.data[0] || [];
};

export const useLighthouseReportForGivenBuildId = (
  webPropertyIdentifier: string,
  identifier: string,
  env: string,
  buildId: string
) =>
  useQuery(lighthouseKeys.list(webPropertyIdentifier, env), () =>
    fetchLighthouseReportForGivenBuildId(webPropertyIdentifier, identifier, env, buildId)
  );
