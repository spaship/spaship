import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Split,
  SplitItem,
  TextInput,
  Tooltip
} from '@patternfly/react-core';

import { useDeleteVirtualPath } from '@app/services/spaProperty';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const envValidation = /^[a-zA-Z0-9-]+$/;

export const schema = yup.object({
  propertyIdentifier: yup.string().label('Web property').trim(),
  identifier: yup.string().label('Application Name').trim(),
  basePath: yup.string().label('Source File Path').trim().required(),
  virtualPath: yup.string().label('Target File Path').trim().required(),
  env: yup
    .string()
    .label('Environment Name')
    .trim()
    .noWhitespace()
    .max(15)
    .matches(envValidation, 'Only letters, numbers, and dashes are allowed')
    .required()
});

export interface FormData extends yup.InferType<typeof schema> {}

type Props = {
  refetch: () => void;
  onClose: () => void;
  propertyIdentifier: string;
  identifier: string;
  env: string;
  data: any;
};

export const DeleteVirtualPath = ({
  refetch,
  onClose,
  propertyIdentifier,
  identifier,
  data,
  env
}: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const webPropertiesKeys = Object.keys(webProperties.data || {});
  const deleteVirtualPathData = useDeleteVirtualPath();

  const onSubmit = async (formData: any) => {
    try {
      await deleteVirtualPathData
        .mutateAsync({
          ...formData
        })
        .then(() => {
          refetch();
        });

      toast.success('Virtual path deleted successfully');
      onClose();
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        onClose();
      } else {
        toast.error('Failed to delete virtual path');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <p>Please confirm if you want to delete the virtual path with the following details.</p>
      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="propertyIdentifier"
            defaultValue={propertyIdentifier}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Web property"
                isRequired
                fieldId="propertyIdentifier"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Add web-property name"
                  type="text"
                  id="propertyIdentifier"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isDisabled
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="identifier"
            defaultValue={identifier}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Application Name"
                isRequired
                fieldId="identifier"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Add application name"
                  type="text"
                  id="identifier"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isDisabled
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="basePath"
            defaultValue={data?.basePath}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Base Path
                    <Tooltip content="Symlink virtualPath path should be /{spa-path}/{virtualPath-path}">
                      <span>
                        &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                      </span>
                    </Tooltip>
                  </>
                }
                isRequired
                fieldId="basePath"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Base path"
                  type="text"
                  id="basePath"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isDisabled
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="virtualPath"
            defaultValue={data.virtualPath}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Virtual Path
                    <Tooltip content="Symlink basePath path should be /{spa-path}/{basePath-path}">
                      <span>
                        &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                      </span>
                    </Tooltip>
                  </>
                }
                isRequired
                fieldId="virtualPath"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Virtual path"
                  type="text"
                  id="virtualPath"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                  isDisabled
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <SplitItem isFilled style={{ width: '100%' }}>
        <Controller
          control={control}
          name="env"
          defaultValue={env}
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
                isDisabled
              >
                <FormSelectOption key={1} label="Please select an environment" isDisabled />
                {webPropertiesKeys.map((envName) => (
                  <FormSelectOption key={envName} value={envName} label={envName} />
                ))}
              </FormSelect>
            </FormGroup>
          )}
        />
      </SplitItem>

      <ActionGroup>
        <Button
          variant="danger"
          type="submit"
          isLoading={isSubmitting}
          isDisabled={isSubmitting || Object.keys(errors).length !== 0}
        >
          Delete
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};
