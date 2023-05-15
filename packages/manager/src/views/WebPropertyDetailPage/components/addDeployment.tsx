/* eslint-disable @typescript-eslint/no-unused-vars */
import { Switch, Tooltip } from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
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
        label="Workflow 3.0"
        labelOff="Workflow 2.0"
        isChecked={isChecked}
        onChange={handleChange}
        className="pf-u-mr-md pf-u-mb-md"
      />
      <Tooltip
        content={
          !isChecked ? (
            <div>
              2.0 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat augue,
              nec fringilla turpis.
            </div>
          ) : (
            <div>
              3.0 Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam id feugiat augue,
              nec fringilla turpis.
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
