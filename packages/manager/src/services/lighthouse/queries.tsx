import { orchestratorReq } from '@app/config/orchestratorReq';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TCreateApiKeyRes } from '../apiKeys/types';
import { TLighthouseGenerateDTO } from './types';
import { TSpaProperty } from '../spaProperty/types';

const lighthouseKeys = {
  list: (webPropertyIdentifier: string, applicationIdentifier: string, env: string = '') =>
    ['lighthouse', webPropertyIdentifier, applicationIdentifier, env] as const
};

// TODO:  change the any to interface later

const fetchLighthouseReportForGivenBuildId = async (
  propertyIdentifier: string,
  identifier: string,
  env: string,
  selected: string,
  isGit?: boolean,
  isContainerized?: boolean
): Promise<any> => {
  const { data } = await orchestratorReq.get(
    `/lighthouse/${propertyIdentifier}/${env}/${identifier}/${selected}`,
    {
      params: {
        skip: 'lhBuildId',
        isGit,
        isContainerized
      }
    }
  );

  return data?.data[0] || {}; // Handle potential undefined data
};

export const useLighthouseReportForGivenBuildId = (
  webPropertyIdentifier: string,
  identifier: string,
  env: string,
  selected: string,
  isGit?: boolean,
  isContainerized?: boolean
) =>
  useQuery(
    [lighthouseKeys.list(webPropertyIdentifier, env), selected], // Combine keys for uniqueness
    () =>
      fetchLighthouseReportForGivenBuildId(
        webPropertyIdentifier,
        identifier,
        env,
        selected,
        isGit,
        isContainerized
      ),
    {
      enabled: selected !== 'Select build-id', // Disable query for "Select build-id"
      staleTime: Infinity // Prevent automatic refetching
    }
  );

const fetchLhIdentifierList = async (
  propertyIdentifier: string,
  applicationIdentifier: string,
  env: string,
  isGit: boolean,
  isContainerized: boolean
) => {
  try {
    const { data } = await orchestratorReq.get(`/applications/property/${propertyIdentifier}`, {
      params: {
        applicationIdentifier,
        env
      }
    });
    const pipelineDetails =
      data.data && data.data.length > 0
        ? data.data.filter(
            (item: TSpaProperty) =>
              item?.isGit === isGit && item?.isContainerized === isContainerized
          )[0].pipelineDetails
        : [];

    // TODO: To be removed after backend revamp
    // pipeline array will be empty for new spa, for existing sopa if no report is generated then key pipelineDetails won't be there

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
  env: string,
  isGit: boolean,
  isContainerized: boolean
) =>
  useQuery(lighthouseKeys.list(webPropertyIdentifier, applicationIdentifier, env), () =>
    fetchLhIdentifierList(webPropertyIdentifier, applicationIdentifier, env, isGit, isContainerized)
  );

// POST Operations
export const generateLighthouseReport = async (
  dto: TLighthouseGenerateDTO
): Promise<TCreateApiKeyRes> => {
  const { data } = await orchestratorReq.post('/lighthouse/generate', dto);
  return data.data;
};

export const useGenerateLighthouseReport = () => useMutation(generateLighthouseReport);
