import React, { useEffect, Suspense } from 'react';

export function Feedback() {
  useEffect(() => {
    const loadOpcFeedback = async () => {
      const module = await import('@one-platform/opc-feedback/dist/opc-feedback');
    };
    loadOpcFeedback();
  }, []);

  return (
    <div>
      <Suspense fallback={<div>Loading...</div>}>
        <opc-feedback theme="blue" docs="/documents" id="opc-feedback" />
      </Suspense>
    </div>
  );
}
