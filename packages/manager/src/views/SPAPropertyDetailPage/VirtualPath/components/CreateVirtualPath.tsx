import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, useForm } from 'react-hook-form';
import * as yup from 'yup';

import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Split,
  SplitItem,
  TextInput,
  Tooltip
} from '@patternfly/react-core';

import { useAddVirtualPath } from '@app/services/spaProperty';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { AxiosError } from 'axios';
import toast from 'react-hot-toast';

const envValidation = /^[a-zA-Z0-9-]+$/;
const pathValidation = /^\/+|\/+$/;

export const schema = yup.object({
  propertyIdentifier: yup.string().label('Web property').trim(),
  identifier: yup.string().label('Application Name').trim(),
  virtualPath: yup
    .string()
    .label('Virtual Path')
    .trim()
    .required()
    .test(
      'no-leading-or-trailing-slashes',
      'Virtual Path should not start or end with a slash',
      (value) => {
        if (value) {
          return !pathValidation.test(value);
        }
        return true;
      }
    ),
  basePath: yup.string().label('Base Path').trim().required(),
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
  onClose: () => void;
  propertyIdentifier: string;
  identifier: string;
  env: string;
  basePath: string;
  refetch: () => void;
};

export const CreateVirtualPath = ({
  onClose,
  propertyIdentifier,
  identifier,
  env,
  basePath,
  refetch
}: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const virtualPath = '';

  const createVirtualPath = useAddVirtualPath();

  const handleVirtualPath = async (addData: any) => {
    if (!propertyIdentifier) return;

    try {
      await createVirtualPath
        .mutateAsync({
          ...addData
        })
        .then(() => {
          refetch();
        });

      toast.success('Virtual path created successfully');
      onClose();
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        onClose();
      } else {
        toast.error('Failed to create virtual path');
      }
    }
  };
  return (
    <Form onSubmit={handleSubmit(handleVirtualPath)}>
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
            name="basePath"
            defaultValue={basePath}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Base Path
                    <Tooltip content="Base path should be path of the application">
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
                  // onChange={field.onChange}
                  // onBlur={field.onBlur}
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
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Virtual Path"
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
      </Split>
      <SplitItem isFilled style={{ width: '100%' }}>
        <Controller
          control={control}
          name="env"
          defaultValue={env}
          render={({ field, fieldState: { error } }) => (
            <FormGroup
              label="Environment"
              isRequired
              fieldId="env"
              validated={error ? 'error' : 'default'}
              helperTextInvalid={error?.message}
            >
              <TextInput
                isRequired
                placeholder="Environment"
                type="text"
                id="env"
                value={field.value}
                onChange={field.onChange}
                onBlur={field.onBlur}
                isDisabled
              />
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
