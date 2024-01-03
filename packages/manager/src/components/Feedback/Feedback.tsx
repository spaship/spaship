import React, { useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useCreateFeedback } from '@app/services/feedback';
import { FeedbackInput } from '@app/services/feedback/types';

export const Feedback = () => {
  const { data: session } = useSession();
  const createFeedback = useCreateFeedback();
  useEffect(() => {
    const loadOpcFeedback = async () => {
      await import('@one-platform/opc-feedback/dist/opc-feedback');
    };

    const feedback = document.querySelector('#opc-feedback');

    if (feedback) {
      loadOpcFeedback();
      feedback.addEventListener('opc-feedback:submit', async (event: any) => {
        const stackInfoData = { ...event.detail.data.stackInfo };
        stackInfoData.path = window.location.pathname;
        const username = session?.user?.email ? session?.user?.email.split('@')[0] : '';
        const variables: FeedbackInput = {
          projectId: 'SPAship',
          summary: event.detail.data.summary,
          experience: event.detail.data.experience,
          category: event.detail.data.category,
          stackInfo: stackInfoData,
          userId: `user:redhat/${username}`,
          error: event.detail.data.error
        };

        try {
          await createFeedback.mutateAsync({ ...variables });
        } catch (mutationError) {
          console.error('Mutation error:', mutationError);
        }
      });
    }
  }, [createFeedback, session?.user?.email]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <opc-feedback theme="blue" docs="/documents" id="opc-feedback" summaryLimit={300} />
      </Suspense>
    </div>
  );
};
