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
  InputGroupText,
} from "@patternfly/react-core";
import config, { IEnvironment } from "../../config";
import { IAPIKey } from "../../models/APIKey";
import * as APIService from "../../services/APIService";

interface IProps {
  isOpen: boolean;
  onClose: () => void;
  afterCreated?: (apiKeys: IAPIKey[]) => void;
}

export default (props: IProps) => {
  const { isOpen, onClose } = props;
  const [label, setLabel] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [selectedEnvironments, setSelectedEnvironments] = useState<IEnvironment[]>([]);
  const [apiKeys, setApiKeys] = useState<IAPIKey[]>([]);

  useEffect(() => {
    setLabel("");
    setExpiredDate("");
    setApiKeys([]);
    setSelectedEnvironments([]);
  }, [isOpen]);

  const onSubmit = async () => {
    // Todo call apiKey api
    const apiKey: IAPIKey = {
      label,
    };

    if (expiredDate.trim() !== "") {
      apiKey.expiredDate = expiredDate;
    }

    const result = await Promise.all(selectedEnvironments.map((env) => APIService.createAPIKey(apiKey, env)));
    const keys: IAPIKey[] = [];
    result.forEach((r) => {
      if (r) {
        keys.push(r);
      }
    });
    setApiKeys(keys);
    props.afterCreated && props.afterCreated(keys);
  };

  const isValid = () => {
    if (label && label.trim().length > 0 && selectedEnvironments.length > 0 && apiKeys.length === 0) {
      return true;
    }
    return false;
  };

  const getExpiredMin = () => {
    const now = new Date();
    now.setDate(now.getDate() + 1);
    return now.toISOString().slice(0, 10); //YYYY-MM-DD
  };

  const onChangeEnvironments = (checked: boolean, event: React.FormEvent<HTMLInputElement>) => {
    const envName = event.currentTarget.name;

    if (!checked) {
      setSelectedEnvironments(selectedEnvironments.filter((env) => env.name !== envName));
    } else {
      const environment = environments.find((env) => env.name === envName);
      if (environment) {
        setSelectedEnvironments([...selectedEnvironments, environment]);
      }
    }
  };

  const environments = config.environments;

  const renderEnvironments = () =>
    environments.map((env) => (
      <Checkbox
        key={`env-${env.name}`}
        label={env.name}
        id={`env-${env.name}`}
        name={env.name}
        onChange={onChangeEnvironments}
        isChecked={!!selectedEnvironments.find((selected) => selected.name === env.name)}
      />
    ));

  const renderAPIKeys = () =>
    apiKeys.map((apiKey) => (
      <InputGroup>
        <InputGroupText>{apiKey.environment?.name}</InputGroupText>
        <TextInput
          key={`api-key-${apiKey.environment?.name}`}
          value={apiKey.key}
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
          label="Label"
          isRequired
          fieldId="api-key-label"
          helperText="Pick a label for the API Key, and we'll give you a unique personal access token."
        >
          <TextInput
            value={label}
            isRequired
            type="text"
            id="api-key-label"
            aria-describedby="api-key-label-helper"
            name="api-key-label"
            onChange={(value) => setLabel(value)}
          />
        </FormGroup>
        <FormGroup label="Expires at" fieldId="api-key-expired">
          <TextInput
            value={expiredDate}
            type="date"
            id="api-key-expired"
            aria-describedby="api-key-expired-helper"
            name="api-key-expired"
            min={getExpiredMin()}
            onChange={(value) => setExpiredDate(value)}
          />
        </FormGroup>
        <FormGroup label="Environments" fieldId="api-key-scope">
          {renderEnvironments()}
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
