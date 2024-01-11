import { orchestratorReq } from '@app/config/orchestratorReq';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TCreateApiKeyRes } from '../apiKeys/types';
import { TLighthouseGenerateDTO } from './types';

const lighthouseKeys = {
  list: (webPropertyIdentifier: string, applicationIdentifier: string, env: string = '') =>
    ['lighthouse', webPropertyIdentifier, applicationIdentifier, env] as const
};

const fetchLighthouseReportForGivenBuildId = async (
  propertyIdentifier: string,
  identifier: string,
  env: string,
  buildId: string
): Promise<any> => {
  const { data } = await orchestratorReq.get(
    `/lighthouse/${propertyIdentifier}/${env}/lighthouse/${buildId}`,
    {
      params: {
        skip: 'lhBuildId'
      }
    }
  );

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

const fetchLhIdentifierList = async (
  propertyIdentifier: string,
  applicationIdentifier: string,
  env: string
) => {
  try {
    const { data } = await orchestratorReq.get(`/applications/property/${propertyIdentifier}`, {
      params: {
        applicationIdentifier,
        env
      }
    });
    const pipelineDetails = data.data && data.data.length > 0 ? data.data[0].pipelineDetails : [];
    // TODO: To be removed after backend revamp
    // pipeline array will be empty for new spa, for existing sopa if no report is generated then key xpipelineDetails won't be there

    return pipelineDetails || [];
  } catch (error) {
    // Handle errors or return an empty array if necessary
    // eslint-disable-next-line no-console
    console.error('Error fetching LH identifier list:', error);
    return [];
  }
};

export const useGetLhIdentifierList = (
  webPropertyIdentifier: string,
  applicationIdentifier: string,
  env: string
) =>
  useQuery(lighthouseKeys.list(webPropertyIdentifier, applicationIdentifier, env), () =>
    fetchLhIdentifierList(webPropertyIdentifier, applicationIdentifier, env)
  );

// POST Operations
export const generateLighthouseReport = async (
  dto: TLighthouseGenerateDTO
): Promise<TCreateApiKeyRes> => {
  const { data } = await orchestratorReq.post('/lighthouse/generate', dto);
  return data.data;
};

export const useGenerateLighthouseReport = () => useMutation(generateLighthouseReport);
