import React, { useState } from "react";
import { Button, Form, FormHelperText, Modal, FormGroup, TextArea } from "@patternfly/react-core";
import { ExclamationCircleIcon } from "@patternfly/react-icons";
import { IConfig } from "../../config";
import useConfig from "../../hooks/useConfig";
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
  const [config, setConfig] = useState(JSON.stringify(configTemplate, null, 2));
  const [validated, setValidated] = useState<"success" | "error" | "default">("default");
  const [invalidText, setInvalidText] = useState("Invalid config");
  const { configs, setSPAshipConfigs } = useConfig();

  const handleConfirm = () => {
    try {
      const conf = JSON.parse(config) as IConfig;
      onSubmit(conf);
      setSPAshipConfigs([...configs, conf]);
    } catch (err) {
      console.error(err);
    }
  };

  const handleClose = () => {
    setConfig(JSON.stringify(configTemplate, null, 2));
    onClose();
  };

  const handleConfigChange = (value: string, event: React.ChangeEvent<HTMLTextAreaElement>) => {
    try {
      const conf = JSON.parse(value) as IConfig;
      if (!conf.name || typeof conf.name !== "string") {
        setValidated("error");
        setInvalidText("Property name is invalid");
      } else if (!Array.isArray(conf.environments)) {
        setValidated("error");
        setInvalidText("environments is invalid");
      } else {
        setValidated("success");
      }
    } catch (error) {
      setValidated("error");
      setInvalidText("Invalid config, it should be a JSON string");
    }
    setConfig(value);
  };
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
      <Form>
        <FormGroup
          label="Config"
          fieldId="config-textarea"
          validated={validated}
          helperText={
            <FormHelperText icon={<ExclamationCircleIcon />} isHidden={validated !== "default"}>
              Please enter your config
            </FormHelperText>
          }
          helperTextInvalid={invalidText}
          helperTextInvalidIcon={<ExclamationCircleIcon />}
        >
          <TextArea
            validated={validated}
            rows={10}
            value={config}
            onChange={handleConfigChange}
            name="config-textarea"
            id="config-textarea"
          />
        </FormGroup>
      </Form>
    </Modal>
  );
};
