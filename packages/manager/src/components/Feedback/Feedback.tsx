import React, { useEffect, Suspense } from 'react';
import { TFeedbackInput } from '@app/services/feedback/types';
import { useCreateFeedback } from '@app/services/feedback/queries';
import { toast } from 'react-hot-toast';
import { AxiosError } from 'axios';

export const Feedback = () => {
  const createFeedback = useCreateFeedback();

  useEffect(() => {
    const loadOpcFeedback = async () => {
      await import('@one-platform/opc-feedback/dist/opc-feedback');
    };
    const feedback = document.querySelector('#opc-feedback');
    if (feedback) {
      loadOpcFeedback();

      feedback.addEventListener('opc-feedback:submit', async (event: any) => {
        if (event.detail.submitted) {
          return;
        }
        const feedbackInput: TFeedbackInput = {
          description: event.detail.data.summary ?? 'NA',
          experience: event.detail.data.experience ?? 'NA',
          category: event.detail.data.category ?? 'NA',
          error: event.detail.data.error ?? 'NA'
        };
        try {
          await createFeedback.mutateAsync({
            ...feedbackInput
          });
          event.detail.submitted = true;

          toast.success('Feedback submitted suucessfully');
        } catch (error) {
          if (error instanceof AxiosError && error.response && error.response.status === 403) {
            toast.error("You don't have access to perform this action");
          } else {
            toast.error('Failed to submit feedback');
          }
        }
      });
    }
  }, [createFeedback]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <opc-feedback
          theme="blue"
          docs="/documents"
          id="opc-feedback"
          summaryLimit={300}
          style={{ zIndex: 1000 }}
        />
      </Suspense>
    </div>
  );
};
