/* eslint-disable react/jsx-props-no-spreading */
import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import {
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Split,
  SplitItem,
  TextInput,
  FileUpload
} from '@patternfly/react-core';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import { useGetWebPropertyGroupedByEnv, useCreateStaticApp } from '@app/services/persistent';

interface CreateStaticAppProps {
  onClose: () => void;
  propertyIdentifier: string;
}

const schema = yup.object({
  name: yup.string().required().label('Application Name'),
  path: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  env: yup.string().required().label('Environment'),
  ref: yup.string().required().label('Reference'),
  upload: yup
    .mixed()
    .required('A file is required')
    .test('fileType', 'Invalid file type', (value) => {
      const allowedExtensions = ['zip', 'tgz', 'gzip', 'gz', 'rar', 'tar'];
      if (value && value.length > 0) {
        const fileExtension = value[0]?.name.split('.').pop();
        return allowedExtensions.includes(fileExtension);
      }
      return false;
    })
});

type FormData = yup.InferType<typeof schema>;

export const CreateStaticApp: React.FC<CreateStaticAppProps> = ({
  onClose,
  propertyIdentifier
}) => {
  const [fileValue, setFileValue] = useState<File | string>('');
  const [filename, setFilename] = useState('');

  const {
    control,
    handleSubmit,
    setValue,
    formState: { isSubmitting, errors },
    trigger
  } = useForm<FormData>({
    defaultValues: { path: '/', upload: null },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const webPropertiesKeys = Object.keys(webProperties.data || {});
  const createStaticSpa = useCreateStaticApp();

  const onSubmit = async (data: FormData) => {
    try {
      const formData = new FormData();
      formData.append('propertyIdentifier', propertyIdentifier);
      formData.append('name', data.name);
      formData.append('path', data.path);
      formData.append('env', data.env);
      formData.append('ref', data.ref);

      if (data.upload && data.upload[0]) {
        formData.append('upload', data.upload[0], data.upload[0].name);
      }

      await createStaticSpa.mutateAsync(formData);
      onClose();
      toast.success('Deployed application successfully');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        onClose();
      } else if (error instanceof AxiosError && error.response && error.response.status === 400) {
        toast.error(
          "Given Image URL doesn't exist on the source registry, please provide a valid image URL."
        );
      } else {
        toast.error('Failed to deploy application');
      }
    }
  };

  const handleFileChange = async (value: File | string, fileName: string) => {
    setValue('upload', [value], { shouldValidate: true });
    setFileValue(value);
    setFilename(fileName);
    await trigger('upload'); // Manually trigger validation on file change
  };

  // const watchAllFields = watch(); // Watch all fields

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <h1>Create a Static App Deployment</h1>
      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Application Name"
                isRequired
                fieldId="property-name"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Application Name"
                  type="text"
                  id="property-name"
                  {...field}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="env"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormGroup
                label="Select Environment"
                fieldId="select-env"
                validated={error ? 'error' : 'default'}
                isRequired
                helperTextInvalid={error?.message}
              >
                <FormSelect
                  label="Select Environment"
                  aria-label="FormSelect Input"
                  onChange={onChange}
                  value={value}
                >
                  <FormSelectOption key="default" label="Please select an environment" isDisabled />
                  {webPropertiesKeys.map((envName) => (
                    <FormSelectOption key={envName} value={envName} label={envName} />
                  ))}
                </FormSelect>
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>

      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="ref"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Reference"
                fieldId="ref"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput placeholder="Reference" type="text" id="ref" {...field} />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="path"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Path"
                fieldId="path"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput placeholder="Path" type="text" id="path" {...field} />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>

      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="upload"
            render={({ fieldState: { error } }) => (
              <FormGroup
                label="Upload file"
                fieldId="file-upload"
                helperText="Allowed file types: zip, tgz, gzip, gz, rar, tar"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <FileUpload
                  id="file-upload"
                  value={fileValue}
                  filename={filename}
                  onChange={handleFileChange}
                  dropzoneProps={{
                    accept: '.zip,.tgz,.gzip,.gz,.rar,.tar'
                  }}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Button
        isLoading={isSubmitting}
        isDisabled={isSubmitting || Object.keys(errors).length > 0}
        type="submit"
        style={{ width: '20%' }}
      >
        Submit
      </Button>
    </Form>
  );
};
