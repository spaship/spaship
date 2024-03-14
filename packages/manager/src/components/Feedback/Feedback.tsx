/* eslint no-param-reassign: "error" */

import { Suspense, useEffect } from 'react';
import { toast } from 'react-hot-toast';

export const Feedback = () => {
  useEffect(() => {
    const loadOpcFeedback = async () => {
      await import('@one-platform/opc-feedback/dist/opc-feedback');
    };

    const feedback = document.querySelector('#opc-feedback');
    if (feedback) {
      loadOpcFeedback();

      feedback.addEventListener('opc-feedback:submit', async (event: any) => {
        // NOTE: To prevent multiple API calls, a flag 'submitted' is used.
        // If 'submitted' is true, it means the feedback has already been submitted,
        // and there's no need to perform the submission again.
        if (event.detail.submitted) {
          return;
        }

        const { data } = event.detail;
        const variables = {
          summary: data.summary || 'NA',
          description: data.summary || 'NA',
          projectId: 'component:devex/spaship-manager',
          url: data.stackInfo?.path || 'NA',
          userAgent: data.stackInfo?.stack || 'NA',
          createdBy: 'user:redhat/nmore',
          feedbackType: data.category || 'NA',
          tag: data.category === 'BUG' ? data.error || 'NA' : data.experience || 'NA'
        };

        event.detail.submitted = true;

        try {
          const response = await fetch('/api/feedback', {
            method: 'POST',
            body: JSON.stringify(variables)
          });

          if (!response.ok) {
            throw new Error('Network response was not ok');
          }

          await response.json();
          toast.success('Feedback submitted successfully');
        } catch (error) {
          if (error instanceof Error && error.message.includes('403')) {
            toast.error("You don't have access to perform this action");
          } else {
            toast.error('Failed to submit feedback');
          }
        }
      });
    }
  }, []);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <opc-feedback
          theme="blue"
          docs="/documents"
          id="opc-feedback"
          summaryLimit={300}
          style={{ zIndex: 1000 }}
          app={JSON.stringify({ name: 'SPAship', url: '/' })}
        />
      </Suspense>
    </div>
  );
};
