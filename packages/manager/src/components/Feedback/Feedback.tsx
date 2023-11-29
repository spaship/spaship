import React, { useEffect, Suspense } from 'react';
import { useSession } from 'next-auth/react';
import { useCreateFeedback } from '@app/services/feedback';

export const Feedback = () => {
  const { data: session } = useSession();
  const createFeedback = useCreateFeedback();
  useEffect(() => {
    const loadOpcFeedback = async () => {
      const module = await import('@one-platform/opc-feedback/dist/opc-feedback');
    };

    const feedback = document.querySelector('#opc-feedback');

    if (feedback) {
      loadOpcFeedback();

      feedback.addEventListener('opc-feedback:submit', async (event: any) => {
        event.detail.data.stackInfo.path = window.location.pathname;
        const username = session?.user?.email.split('@')[0];
        const variables: any = {
          projectId: 'SPAship',
          summary: event.detail.data.summary,
          experience: event.detail.data.experience,
          category: event.detail.data.category,
          stackInfo: event.detail.data.stackInfo,
          // userId: session?.user?.email,
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
  }, [session]);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <opc-feedback theme="blue" docs="/documents" spa="/feedback" id="opc-feedback" />
      </Suspense>
    </div>
  );
};
