import { orchestratorReq } from '@app/config/orchestratorReq';
import { useMutation, useQuery } from '@tanstack/react-query';
import { TFeedbackInput, TCreateFeedbackRes, TFeedbackResponse } from './types';

const feedbackKeys = {
  feedback: ['feedback'] as const
};

export const createFeedback = async (dto: TFeedbackInput): Promise<TCreateFeedbackRes> => {
  const { data } = await orchestratorReq.post('/feedback/', dto);
  return data.data;
};

export const useCreateFeedback = () => useMutation(createFeedback);

const fetchGetUserFeedback = async (): Promise<TFeedbackResponse[]> => {
  const { data } = await orchestratorReq.get('/feedback');
  return data.data;
};

export const useGetUserFeedback = () =>
  useQuery(feedbackKeys.feedback, () => fetchGetUserFeedback());
