import React, { useEffect, useState } from "react";
import { ActionGroup, Button, Form, FormGroup, Modal, TextInput } from "@patternfly/react-core";
import { IConfig, IEnvironment } from "../../config";
import NewPropertyEnvironment from "./NewPropertyEnvironment";
interface IProps {
  isModalOpen: boolean;
  onClose: () => void;
  onSubmit: (conf: IConfig) => void;
}

const configTemplate: IConfig = {
  name: "",
  environments: [
    {
      name: "",
      api: "",
      domain: "",
    },
  ],
};
export default (props: IProps) => {
  const { isModalOpen, onClose, onSubmit } = props;
  const [config, setConfig] = useState<IConfig>(configTemplate);
  const [validated, setValidated] = useState<"success" | "error" | "default">("default");

  const addEnvironment = () => {
    setConfig({
      ...config,
      environments: [
        ...config.environments,
        {
          name: "",
          api: "",
          domain: "",
        },
      ],
    });
  };

  const onEnvironmentChange = (index: number, environment: IEnvironment) => {
    const newConfig = { ...config };
    newConfig.environments[index] = environment;
    setConfig(newConfig);
  };

  const onEnvironmentRemove = (index: number) => {
    const newConfig = { ...config };
    newConfig.environments.splice(index, 1);
    setConfig(newConfig);
  };

  const handleNameChange = (value: string) => {
    const conf = {
      ...config,
      name: value,
    };
    setConfig(conf);
  };
  const handleConfirm = () => {
    try {
      onSubmit(config);
      setConfig(configTemplate);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setConfig(configTemplate);
    onClose();
  };

  useEffect(() => {
    const isValidEnvironments = () => {
      return !config.environments.find((env) => env.name === "" || env.api === "" || env.domain === "");
    };

    if (!config.name || typeof config.name !== "string" || !isValidEnvironments()) {
      setValidated("error");
    } else {
      setValidated("success");
    }
  }, [config]);

  return (
    <Modal
      variant="large"
      title="New Property"
      isOpen={isModalOpen}
      onClose={onClose}
      actions={[
        <Button key="add-property" variant="primary" onClick={handleConfirm} isDisabled={validated !== "success"}>
          Submit
        </Button>,
        <Button key="cancel-property" variant="link" onClick={handleClose}>
          Cancel
        </Button>,
      ]}
    >
      <Form isHorizontal>
        <FormGroup
          label="Name"
          isRequired
          fieldId="horizontal-form-name"
          helperText="Please provide your property name"
        >
          <TextInput
            value={config.name}
            isRequired
            type="text"
            id="horizontal-form-name"
            aria-describedby="horizontal-form-name-helper"
            name="horizontal-form-name"
            onChange={handleNameChange}
          />
        </FormGroup>
        <FormGroup label="Envrionments" fieldId="horizontal-form-exp">
          <ul>
            {config.environments.map((env, index) => (
              <li key={`env-${index}`}>
                <NewPropertyEnvironment
                  index={index}
                  environment={env}
                  onChange={onEnvironmentChange}
                  onRemove={onEnvironmentRemove}
                />
              </li>
            ))}
          </ul>
          <ActionGroup>
            <Button variant="primary" onClick={addEnvironment}>
              Add Environment
            </Button>
          </ActionGroup>
        </FormGroup>
      </Form>
    </Modal>
  );
};
