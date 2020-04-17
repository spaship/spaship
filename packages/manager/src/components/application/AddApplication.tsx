import React, { useState } from "react";
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
} from "@patternfly/react-core";
import { Spinner } from "@patternfly/react-core/dist/js/experimental";
import { withRouter } from "react-router";
import { IApplication } from "../../models/Application";
import Page from "../../layout/Page";
import config, { IEnvironment } from "../../config";

export default withRouter(({ history }) => {
  const [form, setForm] = useState<IApplication>({
    name: "",
    path: "",
    ref: "",
    upload: "",
    environments: [],
  });
  const [environment, setEnvironment] = useState<IEnvironment>(config.environments[0]);
  const [isUploading, setUploading] = useState(false);

  function handleChange(value: string, event: React.FormEvent<HTMLInputElement>) {
    setForm({
      ...form,
      [event.currentTarget.name]: value,
    });
  }

  function handleEnvironmentChange(value: string) {
    const match = config.environments.find((env) => env.name === value);
    if (match) {
      setEnvironment(match);
    }
  }

  function handleFileChange(event: React.FormEvent<HTMLInputElement>) {
    const upload = (event.currentTarget.files && event.currentTarget.files[0]) || "";
    setForm({
      ...form,
      upload,
    });
  }

  function onSubmit() {
    setUploading(true);
    const data = new FormData();
    data.append("name", form.name);
    data.append("path", form.path);
    data.append("ref", form.ref);
    form.upload && data.append("upload", form.upload);

    fetch(`${environment?.api}/applications/deploy`, {
      method: "POST",
      body: data,
    })
      .then((res) => res.json())
      .then((json) => {
        setUploading(false);
        history.push("/applications");
      });
  }

  function onCancel() {
    history.goBack();
  }

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
              <FormSelect value={form.environments} onChange={handleEnvironmentChange} aria-label="FormSelect Input">
                {config.environments.map((env, index) => (
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
              <input
                onChange={handleFileChange}
                required
                type="file"
                id="upload"
                name="upload"
                placeholder="Supports uploading of .tar,.tar.bz2,.tar.gz, and.zip."
                aria-describedby="upload-helper"
              />
              <div>
                <Button component="label" variant="tertiary" htmlFor={`upload`}>
                  Choose File
                </Button>
              </div>
            </FormGroup>

            <ActionGroup>
              <Button variant="primary" onClick={onSubmit} isDisabled={isUploading}>
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
