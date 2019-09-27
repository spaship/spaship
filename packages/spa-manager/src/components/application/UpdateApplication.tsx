import React, { useState } from 'react';
import { IApplication } from '../../models/Application';
import { Button, Text, TextVariants } from '@patternfly/react-core';
import config from '../../config';
import { Spinner } from '@patternfly/react-core/dist/js/experimental';

interface IProps {
  application: IApplication;
}
export default (props: IProps) => {
  const [application, setApplication] = useState(props.application);
  const [isFileChange, setFileChange] = useState(false);
  const [isUploading, setUploading] = useState(false);

  function handleFileChange(event: React.FormEvent<HTMLInputElement>) {
    if (!event.currentTarget.files || !event.currentTarget.files[0]) {
      return;
    }
    setApplication({
      ...application,
      upload: event.currentTarget.files[0]
    });
    setFileChange(true);
  }

  function onSubmit() {
    setUploading(true);
    const data = new FormData();
    data.append('name', application.name);
    data.append('path', application.path);
    data.append('ref', application.ref);
    data.append('upload', application.upload);

    fetch(`${config.apiHost}/deploy`, {
      method: 'POST',
      body: data
    })
      .then(res => res.text())
      .then(text => {
        console.log(text);
        setUploading(false);
        setFileChange(false);
      });
  }
  function onCancel() {
    setFileChange(false);
  }
  function renderNoFile() {
    return (
      <>
        <input
          onChange={handleFileChange}
          type="file"
          id={`upload-${application.name}`}
          aria-describedby="upload-helper"
        />
        <Button
          component="label"
          variant="secondary"
          htmlFor={`upload-${application.name}`}
        >
          Deploy New File
        </Button>
      </>
    );
  }

  function renderFileUpdated() {
    return (
      <>
        <Text component={TextVariants.h6}>
          {(application.upload as File).name}
        </Text>
        <Button onClick={onSubmit} variant="primary">
          Submit
        </Button>
        <Button onClick={onCancel} variant="secondary">
          Cancel
        </Button>
      </>
    );
  }

  if (isUploading) {
    return <Spinner size="md"/>;
  }

  return isFileChange ? renderFileUpdated() : renderNoFile();
};
