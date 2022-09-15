/* eslint-disable react/jsx-props-no-spreading */
import {
  Button,
  FormGroup,
  Label,
  Modal,
  ModalProps,
  Split,
  SplitItem,
  Stack,
  StackItem,
  TextInput
} from '@patternfly/react-core';
import { ReactNode, useEffect, useState } from 'react';

type Props = {
  confirmationToken?: string;
  onSubmit: () => void;
  isLoading?: boolean;
  children?: ReactNode;
};

export const DeleteConfirmationModal = ({
  confirmationToken,
  onSubmit,
  isLoading,
  children,
  ...props
}: Props & Omit<ModalProps, 'children' | 'ref'>): JSX.Element => {
  const [field, setField] = useState('');

  useEffect(() => {
    if (!props.isOpen) {
      setField('');
    }
  }, [props.isOpen]);

  return (
    <Modal {...props} aria-label="delete conformation modal">
      <Stack hasGutter>
        <StackItem>
          {children || (
            <FormGroup
              label={
                <>
                  Type <Label color="blue">{confirmationToken}</Label> to delete
                </>
              }
              isRequired
              fieldId="horizontal-form-name"
              helperText="Include your middle name if you have one."
            >
              <TextInput
                value={field}
                isRequired
                type="text"
                className="pf-u-my-md"
                id="delete-component-name"
                aria-describedby="delete-component-name"
                name="delete-component-name"
                onChange={(val) => setField(val)}
              />
            </FormGroup>
          )}
        </StackItem>
        <StackItem>
          <Split hasGutter>
            <SplitItem>
              <Button
                variant="danger"
                type="submit"
                isLoading={isLoading}
                isDisabled={!children || isLoading || field !== confirmationToken}
                onClick={onSubmit}
              >
                Delete
              </Button>
            </SplitItem>
            <SplitItem>
              <Button variant="link" onClick={props.onClose}>
                Cancel
              </Button>
            </SplitItem>
          </Split>
        </StackItem>
      </Stack>
    </Modal>
  );
};

DeleteConfirmationModal.defaultProps = {
  isLoading: false,
  children: null,
  confirmationToken: ''
};
