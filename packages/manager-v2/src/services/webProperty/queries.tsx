import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { orchestratorReq } from '@app/config/orchestratorReq';
import { TCreateWebPropertyDTO, TUniqueWebProperty, TWebProperty } from './types';

const webPropertyKeys = {
  list: ['web-properties'] as const
};

// GET Operations
const fetchWebProperties = async (): Promise<TWebProperty[]> => {
  const { data } = await orchestratorReq.get('/webproperty/alias/list');
  return data.data;
};

export const useGetWebProperties = <T extends unknown>(select?: (data: TWebProperty[]) => T) =>
  useQuery(webPropertyKeys.list, fetchWebProperties, { select });

const transformAllToUniqueWebProperties = (webProperties: TWebProperty[]): TUniqueWebProperty[] => {
  const hasSeenWebProperty: Record<string, boolean> = {};
  const uniqueWebProperties: TUniqueWebProperty[] = [];
  webProperties.forEach(({ createdBy, propertyName, propertyTitle, url }) => {
    if (!hasSeenWebProperty?.[propertyName]) {
      uniqueWebProperties.push({ createdBy, propertyName, url, propertyTitle });
      hasSeenWebProperty[propertyName] = true;
    }
  });

  return uniqueWebProperties;
};

export const useGetUniqueWebProperties = () =>
  useGetWebProperties(transformAllToUniqueWebProperties);

// POST OPERATIONS

const createAWebProperty = async (dto: TCreateWebPropertyDTO): Promise<TWebProperty> => {
  const { data } = await orchestratorReq.post('/webproperty/alias', dto);
  return data.data;
};

export const useAddWebPropery = () => {
  const queryClient = useQueryClient();

  return useMutation(createAWebProperty, {
    onSuccess: () => {
      queryClient.invalidateQueries(webPropertyKeys.list);
    }
  });
};
