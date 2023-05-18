/* eslint-disable @typescript-eslint/no-unused-vars */
import { Switch, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import Link from 'next/link';
import React from 'react';
import { SSRForm } from './SSR/SsrForm';
import { Workflow3 } from './workflow3.0';

interface Props {
  onClose: () => void;
  propertyIdentifier: string;
}

export const AddDeplyoment = ({ onClose, propertyIdentifier }: Props): JSX.Element => {
  const [isChecked, setIsChecked] = React.useState<boolean>(true);
  const [isWorkflowSubmitted, setIsWorkflowSubmitted] = React.useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    setIsChecked(checked);
  };

  return (
    <div>
      <Switch
        id="simple-switch"
        label="From Git Repo"
        labelOff="From Container"
        isChecked={isChecked}
        onChange={handleChange}
        className="pf-u-mr-md pf-u-mb-md"
      />
      <Tooltip
        content={
          !isChecked ? (
            <div>
              Containerized deployment for Supporting the SSR capability. It is assumed the
              container for this app is already available. For a more direct and interactive
              deployment experience,toggle the switch to From Git Repo
            </div>
          ) : (
            <div>
              Provide your application&apos;s repository details, and SPAship will handle the entire
              build and deployment process. No more external CIs are needed! Enjoy a more direct and
              interactive deployment experience. To know more check spasip get started section{' '}
              <Link href="/documents">here</Link>
            </div>
          )
        }
      >
        <InfoCircleIcon style={{ marginLeft: '10px', color: '#6A6E73' }} />
      </Tooltip>
      {!isChecked ? (
        <SSRForm propertyIdentifier={propertyIdentifier} onClose={() => onClose()} />
      ) : (
        <Workflow3
          propertyIdentifier={propertyIdentifier}
          onClose={() => onClose()}
          onSubmitWorkflow={() => setIsWorkflowSubmitted(true)}
        />
      )}
    </div>
  );
};
