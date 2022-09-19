/* eslint-disable react/jsx-props-no-spreading */
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  Split,
  SplitItem,
  Switch,
  TextInput
} from '@patternfly/react-core';

export const schema = yup.object({
  // TODO: change this to URL validation, after server supports http protocol append
  url: yup.string().label('Hostname URL').trim().required().max(250),
  env: yup
    .string()
    .label('Environement Name')
    .noWhitespace()
    .trim()
    .max(50)
    .alphabetsOnly()
    .required(),
  deploymentConnectionType: yup.bool().required()
});

export interface FormData extends yup.InferType<typeof schema> {}

type Props = {
  onSubmit: (data: FormData) => void;
  onClose: () => void;
};

export const CreateEnvForm = ({ onSubmit, onClose }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="env"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Environment Name"
                isRequired
                fieldId="property-env"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
                helperText="Env shouldn't contain any space, numbers, special-character "
              >
                <TextInput
                  isRequired
                  placeholder="Default Environement Name"
                  type="text"
                  id="property-env"
                  {...field}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem>
          <Controller
            control={control}
            name="deploymentConnectionType"
            defaultValue={false}
            render={({ field: { onChange, value } }) => (
              <FormGroup label="Environment Type" fieldId="property-env-type">
                <Switch
                  id="property-deployconnection"
                  label="Pre-production"
                  isChecked={value}
                  onChange={onChange}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Controller
        control={control}
        defaultValue=""
        name="url"
        render={({ field, fieldState: { error } }) => (
          <FormGroup
            label="Hostname"
            isRequired
            fieldId="property-host"
            validated={error ? 'error' : 'default'}
            helperTextInvalid={error?.message}
            helperText="Hostname should be a valid url (eg: one.redhat.com)"
          >
            <TextInput
              isRequired
              placeholder="Enter URL of property"
              type="text"
              id="property-host"
              {...field}
            />
          </FormGroup>
        )}
      />
      <ActionGroup>
        <Button variant="primary" type="submit" isLoading={isSubmitting} isDisabled={isSubmitting}>
          Create
        </Button>
        <Button variant="link" onClick={onClose}>
          Cancel
        </Button>
      </ActionGroup>
    </Form>
  );
};
