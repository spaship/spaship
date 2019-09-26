import React, { useState } from 'react';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  TextInput
} from '@patternfly/react-core';
import Page from '../../layout/Page';
import { withRouter } from 'react-router';
import Spinner from '../general/Spinner';

interface IForm {
  name: string;
  path: string;
  ref: string;
  upload: File | string;
}
export default withRouter(({ history }) => {
  const [form, setForm] = useState<IForm>({
    name: '',
    path: '',
    ref: '',
    upload: ''
  });
  const [isUploading, setUploading] = useState(false);

  function handleChange(
    value: string,
    event: React.FormEvent<HTMLInputElement>
  ) {
    setForm({
      ...form,
      [event.currentTarget.name]: value
    });
  }

  function handleFileChange(event: React.FormEvent<HTMLInputElement>) {
    const upload =
      (event.currentTarget.files && event.currentTarget.files[0]) || '';
    setForm({
      ...form,
      upload
    });
  }

  function onSubmit() {
    setUploading(true);
    console.log(form);
    const data = new FormData();
    data.append('name', form.name);
    data.append('path', form.path);
    data.append('ref', form.ref);
    data.append('upload', form.upload);

    fetch('http://spandx.gsslab.rdu2.redhat.com:8008/deploy', {
      method: 'POST',
      body: data
    })
      .then(res => res.text())
      .then(text => {
        console.log(text);
        setUploading(false);
        history.push('/applications');
      });
  }

  function onCancel() {
    history.goBack();
  }

  return (
    <Page title="Upload to deploy">
      <Form>
        <FormGroup
          label="Name"
          isRequired
          fieldId="name"
          helperText="Please provide app name"
        >
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

        <FormGroup
          label="Path"
          isRequired
          fieldId="path"
          helperText="Please provide app path"
        >
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
        </FormGroup>

        <FormGroup
          label="Git Ref"
          isRequired
          fieldId="ref"
          helperText="Please provide Git Ref"
        >
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
        </FormGroup>

        <ActionGroup>
          <Button variant="primary" onClick={onSubmit} isDisabled={isUploading}>
            Submit
          </Button>
          <Button variant="secondary" onClick={onCancel}>
            Cancel
          </Button>
        </ActionGroup>
        <Spinner />
      </Form>
    </Page>
  );
});
