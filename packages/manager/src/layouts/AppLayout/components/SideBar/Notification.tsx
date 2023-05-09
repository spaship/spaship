import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionToggle
} from '@patternfly/react-core';
import { useState } from 'react';

const data1 = {
  data: []
};

export const Notification = (): JSX.Element => {
  const [state, setState] = useState({
    step: 0,
    totalSteps: 5,
    action: ''
  });

  const steps = [
    { action: 'FORM_UPLOADED', step: 1 },
    { action: 'BUILD_STARTED', step: 2 },
    { action: 'BUILD_FINISHED', step: 3 },
    { action: 'APPLICATION_DEPLOYMENT_STARTED', step: 4 },
    { action: 'APPLICATION_DEPLOYED', step: 5 }
  ];
  const [expanded, setExpanded] = useState('def-list-toggle2');

  const onToggle = (id: string) => {
    if (id === expanded) {
      setExpanded('');
    } else {
      setExpanded(id);
    }
  };
  return (
    <div
      style={{
        position: 'absolute',
        bottom: 0,
        width: '-webkit-fill-available',
        backgroundColor: '#de1d1d'
      }}
    >
      <Accordion asDefinitionList style={{ backgroundColor: '#212427', color: '#fff' }}>
        <AccordionItem>
          <AccordionToggle
            onClick={() => {
              onToggle('def-list-toggle4');
            }}
            isExpanded={expanded === 'def-list-toggle4'}
            id="def-list-toggle4"
          >
            Item four
          </AccordionToggle>
          <AccordionContent id="def-list-expand4" isHidden={expanded !== 'def-list-toggle4'}>
            {data1.data.map((v, k) => (
              <div key={k}>
                {steps.map((v1, k1) => {
                  if (v.action === v1.action) {
                    return (
                      <p style={{ color: '#f00' }} key={k1}>
                        {v1.action} - {v1.step}/5
                      </p>
                    );
                  }
                  return null;
                })}
              </div>
            ))}
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
