import React, { useState, useEffect } from "react";
import { ActionGroup, Button, Modal, Form, FormGroup, TextInput } from "@patternfly/react-core";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}
export default (props: IProps) => {
  const { isOpen, onClose } = props;
  const [name, setName] = useState("");
  const [expired, setExpired] = useState("");
  const [apiKey, setApiKey] = useState("");

  useEffect(() => {
    setName("");
    setExpired("");
    setApiKey("");
  }, [isOpen]);

  const onSubmit = () => {
    setApiKey(
      Math.random()
        .toString(36)
        .substr(2)
    );
  };

  return (
    <Modal isSmall isOpen={isOpen} title="Create New API Key" ariaDescribedById="apiKey-generation" onClose={onClose}>
      <Form isHorizontal>
        <FormGroup
          label="Name"
          isRequired
          fieldId="api-key-name"
          helperText="Pick a name for the application, and we'll give you a unique personal access token."
        >
          <TextInput
            value={name}
            isRequired
            type="text"
            id="api-key-name"
            aria-describedby="api-key-name-helper"
            name="api-key-name"
            onChange={value => setName(value)}
          />
        </FormGroup>
        <FormGroup label="Expires at" fieldId="api-key-expired">
          <TextInput
            value={expired}
            type="date"
            id="api-key-expired"
            aria-describedby="api-key-expired-helper"
            name="api-key-expired"
            onChange={value => setExpired(value)}
          />
        </FormGroup>
        <ActionGroup>
          <Button variant="primary" onClick={onSubmit} isDisabled={name.trim() === "" || apiKey.trim().length > 0}>
            Create API key
          </Button>
        </ActionGroup>
        {apiKey && apiKey.trim() !== "" && (
          <FormGroup label="Your New API Key" fieldId="api-key">
            <TextInput
              value={apiKey}
              type="text"
              readOnly
              id="api-key"
              aria-describedby="api-key-helper"
              name="api-key"
            />
          </FormGroup>
        )}
      </Form>
    </Modal>
  );
};
