import React, { useState } from "react";
import { Button, Modal, ButtonVariant, ModalVariant } from "@patternfly/react-core";
interface IProps {
  title: string;
  label: string;
  variant: ButtonVariant;
  children: React.ReactNode;
  onConfirm: () => void;
  onCancel?: () => void;
}

export default (props: IProps) => {
  const { title, variant, onConfirm, onCancel, label, children } = props;
  const [isOpen, setOpen] = useState(false);

  const onClickConfirm = () => {
    setOpen(false);
    onConfirm();
  };

  const onClickCancel = () => {
    setOpen(false);
    onCancel && onCancel();
  };
  return (
    <>
      <Button variant={variant} onClick={() => setOpen(true)}>
        {label}
      </Button>
      <Modal
        variant={ModalVariant.small}
        title={title}
        isOpen={isOpen}
        onClose={() => setOpen(false)}
        actions={[
          <Button id="confrim-modal-yes" key="confirm" variant={variant} onClick={onClickConfirm}>
            Confirm
          </Button>,
          <Button id="confirm-modal-cancel" key="cancel" variant="link" onClick={onClickCancel}>
            Cancel
          </Button>,
        ]}
      >
        {children}
      </Modal>
    </>
  );
};
