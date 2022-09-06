import { useQuery } from '@tanstack/react-query';
import { orchestratorReq } from '@app/config/orchestratorReq';
import { OrchServerRes } from '@app/types';

import { TWebPropertyList } from './types';

const fetchWebProperties = async (): Promise<OrchServerRes<TWebPropertyList>> => {
  const { data } = await orchestratorReq.get('/webproperty/alias/list');
  return data;
};

export const useGetWebProperties = () => useQuery(['web-properties'], fetchWebProperties);
