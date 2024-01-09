import { feedbackReq } from '@app/config/feedbackReq';
import { useMutation } from '@tanstack/react-query';
import { FeedbackInput, FeedbackResponse } from './types';

const body = (variables: FeedbackInput) => {
  const query = `
    mutation (
      $projectId: String
      $summary: String
      $experience: String
      $category: FeedbackCategory
      $stackInfo: StackInfoInput
      $userId: String
      $error: String
    ) {
      createFeedback(
        input: {
          projectId: $projectId
          summary: $summary
          experience: $experience
          category: $category
          createdBy: $userId
          stackInfo: $stackInfo
          error: $error
        }
      ) {
        summary
        ticketUrl
        error
        stackInfo {
          path
          stack
        }
      }
    }
  `;
  return JSON.stringify({
    query,
    variables
  });
};

const createFeedback = async (variables: FeedbackInput): Promise<FeedbackResponse> => {
  const { data } = await feedbackReq.post(``, body(variables));
  return data.data;
};

export const useCreateFeedback = () => useMutation(createFeedback, {});
