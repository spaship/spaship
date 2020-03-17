import React, { useState, useEffect } from "react";
import {
  ActionGroup,
  Button,
  Checkbox,
  Modal,
  Form,
  FormGroup,
  TextInput,
  InputGroup,
  InputGroupText
} from "@patternfly/react-core";
import * as uuid from "uuid";

interface IAPIKey {
  env: string;
  value: string;
}

interface IProps {
  isOpen: boolean;
  onClose: () => void;
}

export default (props: IProps) => {
  const { isOpen, onClose } = props;
  const [name, setName] = useState("");
  const [expired, setExpired] = useState("");
  const [scopes, setScopes] = useState<string[]>([]);
  const [apiKeys, setApiKeys] = useState<IAPIKey[]>([]);

  useEffect(() => {
    setName("");
    setExpired("");
    setApiKeys([]);
    setScopes([]);
  }, [isOpen]);

  const onSubmit = () => {
    // Todo call apiKey api
    setApiKeys(scopes.map(env => ({ env, value: uuid.v4() })));
  };

  const isValid = () => {
    if (name && name.trim().length > 0 && scopes.length > 0 && apiKeys.length === 0) {
      return true;
    }
    return false;
  };

  const onChangeScope = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const env = event.currentTarget.name;
    if (!checked) {
      setScopes(scopes.filter(scope => scope !== env));
    } else {
      setScopes([...scopes, env]);
    }
  };

  const envs = ["Dev", "QA", "Stage", "Prod"];

  const renderEnvironmentScopes = () =>
    envs.map(env => (
      <Checkbox
        key={`env-${env}`}
        label={env}
        id={`env-${env}`}
        name={env}
        onChange={onChangeScope}
        isChecked={!!scopes.find(scope => scope === env)}
      />
    ));

  const renderAPIKeys = () =>
    apiKeys.map(apiKey => (
      <InputGroup>
        <InputGroupText>{apiKey.env}</InputGroupText>
        <TextInput
          key={`api-key-${apiKey.env}`}
          value={apiKey.value}
          type="text"
          readOnly
          aria-describedby="api-key-helper"
          name="api-key"
        />
      </InputGroup>
    ));

  return (
    <Modal isLarge isOpen={isOpen} title="Create New API Key" ariaDescribedById="apiKey-generation" onClose={onClose}>
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
        <FormGroup label="Scopes" fieldId="api-key-scope">
          {renderEnvironmentScopes()}
        </FormGroup>

        <ActionGroup>
          <Button variant="primary" onClick={onSubmit} isDisabled={!isValid()}>
            Create API key
          </Button>
        </ActionGroup>
        {apiKeys && apiKeys.length > 0 && (
          <FormGroup label="Your New API Key" fieldId="api-key">
            {renderAPIKeys()}
          </FormGroup>
        )}
      </Form>
    </Modal>
  );
};
