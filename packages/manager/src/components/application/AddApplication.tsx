import React, { useState, useEffect } from "react";
import {
  ActionGroup,
  Alert,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  InputGroup,
  InputGroupText,
  TextInput,
  Card,
  CardBody,
  Spinner,
  FileUpload,
} from "@patternfly/react-core";
import FileUploadIcon from "@patternfly/react-icons/dist/js/icons/file-upload-icon";
import { withRouter } from "react-router";
import { IApplicationPayload } from "../../models/Application";
import Page from "../../layout/Page";
import { deployApplication } from "../../services/ApplicationService";
import { IEnvironment } from "../../config";
import useConfig from "../../hooks/useConfig";
import useNotify from "../../hooks/useNotify";

export default withRouter(({ history }) => {
  const [form, setForm] = useState<IApplicationPayload>({
    name: "",
    path: "",
    ref: "",
    upload: "",
  });
  const { selected } = useConfig();
  const [environment, setEnvironment] = useState<IEnvironment>();
  const [isUploading, setUploading] = useState(false);

  const { send } = useNotify();

  const selectedEnvs = selected?.environments || [];
  const environments = selectedEnvs;

  useEffect(() => {
    if (environments && environments.length > 0) {
      setEnvironment(environments[0]);
    }
  }, [environments]);

  const handleChange = (value: string, event: React.FormEvent<HTMLInputElement>) => {
    setForm({
      ...form,
      [event.currentTarget.name]: value,
    });
  };

  const handleEnvironmentChange = (value: string) => {
    const match = environments.find((env) => env.name === value);
    if (match) {
      setEnvironment(match);
    }
  };

  const handleFileChange = (
    value: string | File,
    filename: string,
    event:
      | React.DragEvent<HTMLElement>
      | React.ChangeEvent<HTMLTextAreaElement>
      | React.MouseEvent<HTMLButtonElement, MouseEvent>
  ) => {
    const upload = value;
    setForm({
      ...form,
      upload,
    });
  };

  const isValid = () => {
    if (form.name !== "" && environment !== null && form.path !== "" && form.upload !== "") {
      return true;
    }
    return false;
  };

  const onSubmit = async () => {
    setUploading(true);
    if (environment) {
      const application = await deployApplication(environment, form);
      if (application) {
        setUploading(false);
        send("success", "Success", <p>Application created</p>, {
          autoClose: 3000,
          onClose: () => {
            history.push("/applications");
          },
        });
      }
    }
  };

  const onCancel = () => {
    history.goBack();
  };

  return (
    <Page title="Upload to deploy">
      <Alert variant="warning" isInline title="Warning">
        This form is not the recommended way of deploying an application. Please go through the SPAship
        <a href="https://github.com/spaship/spaship/blob/master/packages/cli/README.md"> CLI </a>and
        <a href="https://github.com/spaship/spaship/blob/master/packages/api/README.md"> API </a> documentation for the
        recommended method of deploying your application.
      </Alert>
      <Card>
        <CardBody>
          <Form>
            <FormGroup label="Name" isRequired fieldId="name" helperText="Please provide app name">
              <TextInput
                isRequired
                type="text"
                id="name"
                name="name"
                aria-describedby="name-helper"
                placeholder="Name"
                value={form.name}
                onChange={handleChange}
              />
            </FormGroup>
            <FormGroup label="Environment" isRequired fieldId="environment" helperText="Please provide app name">
              <FormSelect value={environment?.name} onChange={handleEnvironmentChange} aria-label="FormSelect Input">
                {environments.map((env, index) => (
                  <FormSelectOption key={index} value={env.name} label={env.name} />
                ))}
              </FormSelect>
            </FormGroup>

            <FormGroup label="Path" isRequired fieldId="path" helperText="Please provide app path">
              <InputGroup>
                <InputGroupText id="site-host">{environment?.domain}</InputGroupText>
                <TextInput
                  isRequired
                  type="text"
                  id="path"
                  name="path"
                  placeholder="/path-name"
                  aria-describedby="path-helper"
                  value={form.path}
                  onChange={handleChange}
                />
              </InputGroup>
            </FormGroup>

            <FormGroup label="Git Ref" isRequired fieldId="ref" helperText="Please provide Git Ref">
              <TextInput
                isRequired
                type="text"
                id="ref"
                name="ref"
                placeholder="Tag or Branch"
                aria-describedby="ref-helper"
                value={form.ref}
                onChange={handleChange}
              />
            </FormGroup>

            <FormGroup
              label="File"
              isRequired
              fieldId="upload"
              helperText="Supports uploading of .tar,.tar.bz2,.tar.gz, and.zip."
            >
              <FileUpload id="upload" value={form.upload} onChange={handleFileChange} hideDefaultPreview>
                {form.upload && (
                  <div className="pf-u-m-md">
                    <FileUploadIcon size="lg" />
                    {(form.upload as File).size}-byte file named {(form.upload as File).name}
                  </div>
                )}
              </FileUpload>
            </FormGroup>

            <ActionGroup>
              <Button variant="primary" onClick={onSubmit} isDisabled={!isValid() || isUploading}>
                {isUploading && (
                  <>
                    <Spinner size="md" />
                    <span> </span>
                  </>
                )}
                Submit
              </Button>
              <Button variant="secondary" onClick={onCancel}>
                Cancel
              </Button>
            </ActionGroup>
          </Form>
        </CardBody>
      </Card>
    </Page>
  );
});
