import { Button, GridItem } from '@patternfly/react-core';
import { ExclamationCircleIcon } from '@patternfly/react-icons';

const StepNavigation = ({
  currentStep,
  handleClick,
  repoValidateMessage,
  appValidateMessage,
  errors
}: {
  currentStep: number;
  handleClick: (step: number) => void;
  repoValidateMessage: string;
  appValidateMessage: string;
  errors: any;
}) => {
  const steps = [
    {
      step: 1,
      label: 'Repository Details',
      hasError: !!repoValidateMessage
    },
    {
      step: 2,
      label: 'Application Details',
      hasError: !!appValidateMessage
    },
    {
      step: 3,
      label: 'Application Configuration',
      hasError: false
    },
    {
      step: 4,
      label: 'Build Arguments',
      hasError: false
    },
    {
      step: 5,
      label: 'MP+ Configuration',
      hasError: errors.limitCpu || errors.limitMemory || errors.replicas
    },
    {
      step: 6,
      label: 'Review',
      hasError: false
    }
  ];

  return (
    <GridItem span={3}>
      <ul className="step-list">
        {steps.map(({ step, label, hasError }) => (
          <li key={step}>
            <Button
              variant="link"
              onClick={() => handleClick(step)}
              style={{ color: currentStep === step ? '#FDB716' : 'black' }}
            >
              <span
                className="step-number"
                style={{
                  backgroundColor: currentStep === step ? '#FDB716' : '#ccc',
                  color: '#000'
                }}
              >
                {step}
              </span>
              {label}
              {hasError && (
                <span>
                  &nbsp;
                  <ExclamationCircleIcon style={{ color: '#c9190b' }} />
                </span>
              )}
            </Button>
          </li>
        ))}
      </ul>
    </GridItem>
  );
};

export default StepNavigation;
