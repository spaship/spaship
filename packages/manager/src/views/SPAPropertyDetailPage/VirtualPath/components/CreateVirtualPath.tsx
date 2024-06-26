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

import { InfoCircleIcon } from '@patternfly/react-icons';

const envValidation = /^[a-zA-Z0-9-]+$/;

export const schema = yup.object({
  propertyIdentifier: yup.string().label('Web property').trim(),
  identifier: yup.string().label('Application Name').trim(),
  virtualPath: yup
    .string()
    .label('Source File Path')
    .trim()
    .required()
    .test(
      'no-leading-or-trailing-slashes',
      'Source File Path should not start or end with a slash',
      (value) => {
        if (value) {
          return !/^\/+|\/+$/.test(value);
        }
        return true;
      }
    ),
  basePath: yup
    .string()
    .label('Target File Path')
    .trim()
    .required()
    .test(
      'no-leading-or-trailing-slashes',
      'Target File Path should not start or end with a slash',
      (value) => {
        if (value) {
          return !/^\/+|\/+$/.test(value);
        }
        return true;
      }
    ),
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
  onSubmit: (data: FormData) => void;
  onClose: () => void;
  propertyIdentifier: string;
  identifier: string;
  env: string;
};

export const CreateVirtualPath = ({
  onSubmit,
  onClose,
  propertyIdentifier,
  identifier,
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
  const virtualPath = '';
  const basePath = '';

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
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
                  isDisabled
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
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
                  isDisabled
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
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
            name="virtualPath"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Virtual Path
                    <Tooltip content="Symlink virtualPath path should be /{spa-path}/{virtualPath-path}">
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
                  placeholder={virtualPath}
                  type="text"
                  id="virtualPath"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="basePath"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Base Path
                    <Tooltip content="Symlink basePath path should be /{spa-path}/{basePath-path}">
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
                  placeholder={basePath}
                  type="text"
                  id="basePath"
                  value={field.value}
                  onChange={field.onChange}
                  onBlur={field.onBlur}
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

      <ActionGroup>
        <Button
          variant="primary"
          type="submit"
          isLoading={isSubmitting}
          isDisabled={isSubmitting || Object.keys(errors).length !== 0}
        >
          Create
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};
