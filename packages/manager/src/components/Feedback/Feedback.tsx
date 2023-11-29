import React, { useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useCreateFeedback } from '@app/services/feedback';

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
        const eventData = { ...event.detail.data };
        eventData.stackInfo.path = window.location.pathname;
        const username = session?.user?.email ? session.user.email.split('@')[0] : '';
        const variables: any = {
          projectId: 'SPAship',
          summary: eventData.detail.data.summary,
          experience: eventData.detail.data.experience,
          category: eventData.detail.data.category,
          stackInfo: eventData.detail.data.stackInfo,
          userId: `user:redhat/${username}`,
          error: eventData.detail.data.error
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
        <opc-feedback theme="blue" docs="/documents" spa="/feedback" id="opc-feedback" />
      </Suspense>
    </div>
  );
};
