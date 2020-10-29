import React, { useState, useEffect } from "react";
import {
  Alert,
  ActionGroup,
  Button,
  Checkbox,
  Modal,
  ModalVariant,
  Form,
  FormAlert,
  FormGroup,
  TextInput,
  InputGroup,
  InputGroupText,
  ClipboardCopy,
} from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { IEnvironment } from "../../config";
import { IAPIKey, IAPIKeyPayload, IAPIKeyEnvironment } from "../../models/APIKey";
import { createMultiAPIKeys } from "../../services/APIKeyService";
import useConfig from "../../hooks/useConfig";

interface IProps {
  apiKeys: IAPIKey[];
  isOpen: boolean;
  onClose: () => void;
  afterCreated?: (apiKey: IAPIKey) => void;
}

export default (props: IProps) => {
  const { apiKeys, isOpen, onClose } = props;
  const { selected } = useConfig();
  const [isSubmiting, setSubmiting] = useState(false);
  const [label, setLabel] = useState("");
  const [expiredDate, setExpiredDate] = useState("");
  const [isLabelValidated, setLabelValidated] = useState<"default" | "success" | "error">("default");
  const [labelInvalidText, setLabelInvalidText] = useState("");
  const [selectedEnvironments, setSelectedEnvironments] = useState<IEnvironment[]>([]);
  const [apiKeyEnvironments, setAPIKeyEnvironments] = useState<IAPIKeyEnvironment[]>([]);
  const environments = selected?.environments || [];

  useEffect(() => {
    setLabel("");
    setExpiredDate("");
    setLabelValidated("default");
    setLabelInvalidText("");
    setAPIKeyEnvironments([]);
    setSelectedEnvironments([]);
  }, [isOpen]);

  const handleLabelChange = (value: string) => {
    setLabel(value);
    if (!value || value.trim().length === 0) {
      setLabelValidated("error");
      setLabelInvalidText("Label is required");
    } else if (apiKeys.find((apiKey) => apiKey.label === value)) {
      setLabelValidated("error");
      setLabelInvalidText("Duplicate Label");
    } else {
      setLabelValidated("success");
      setLabelInvalidText("");
    }
  };

  const onSubmit = async () => {
    setSubmiting(true);
    const payload: IAPIKeyPayload = {
      label,
    };

    if (expiredDate.trim() !== "") {
      payload.expiredDate = expiredDate;
    }

    const apiKey = await createMultiAPIKeys(selectedEnvironments, payload);
    setAPIKeyEnvironments(apiKey.environments);
    setSubmiting(false);
    props.afterCreated && props.afterCreated(apiKey);
  };

  const isValid = () => {
    if (
      !isSubmiting &&
      apiKeyEnvironments.length === 0 &&
      selectedEnvironments.length > 0 &&
      isLabelValidated === "success"
    ) {
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
    apiKeyEnvironments.map((apiKeyEnv) => (
      <InputGroup key={`apiKey-${apiKeyEnv.name}`}>
        <InputGroupText>{apiKeyEnv.name}</InputGroupText>
        <ClipboardCopy isReadOnly style={{ width: "80%" }}>
          {apiKeyEnv.key}
        </ClipboardCopy>
      </InputGroup>
    ));

  return (
    <Modal variant={ModalVariant.large} isOpen={isOpen} title="Create New API Key" onClose={onClose}>
      <Form isHorizontal>
        <FormGroup
          label="Label"
          isRequired
          fieldId="api-key-label"
          validated={isLabelValidated}
          helperTextInvalid={labelInvalidText}
          helperTextInvalidIcon={<ExclamationCircleIcon />}
          helperText="Pick a label for the API Key, and we'll give you a unique personal access token."
        >
          <TextInput
            value={label}
            isRequired
            validated={isLabelValidated}
            type="text"
            id="api-key-label"
            aria-describedby="api-key-label-helper"
            name="api-key-label"
            autoComplete="off"
            onChange={handleLabelChange}
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
        <FormGroup label="Environments" fieldId="api-key-scope" isRequired>
          {renderEnvironments()}
        </FormGroup>

        <ActionGroup>
          <Button variant="primary" onClick={onSubmit} isDisabled={!isValid()}>
            Create API key
          </Button>
        </ActionGroup>
        {apiKeyEnvironments && apiKeyEnvironments.length > 0 && (
          <FormGroup label="Your New API Key" fieldId="api-key">
            <FormAlert>
              <Alert
                variant="danger"
                title="Please Note: You can see the API key only once at the time of creation, so please copy them for your reference."
                aria-live="polite"
                isInline
              />
            </FormAlert>
            {renderAPIKeys()}
          </FormGroup>
        )}
      </Form>
    </Modal>
  );
};
