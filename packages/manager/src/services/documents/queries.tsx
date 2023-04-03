import { orchestratorReq } from '@app/config/orchestratorReq';
import { useQuery } from '@tanstack/react-query';
import { TDocument } from './types';

const documentKeys = {
  list: () => ['document-keys'] as const
};

// GET Operations
const fetchDocumentPage = async (): Promise<TDocument> => {
  const { data } = await orchestratorReq.get(`/documentation`);
  return data.data;
};

// TODO: Backend returns 404 not found error for empty list of api keys causing retry
export const useGetDocumentPage = () => useQuery(documentKeys.list(), () => fetchDocumentPage());
