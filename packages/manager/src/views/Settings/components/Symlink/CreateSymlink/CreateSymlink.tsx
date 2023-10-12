/* eslint-disable react/jsx-props-no-spreading */
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  ActionGroup,
  Button,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Split,
  SplitItem,
  TextInput
} from '@patternfly/react-core';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';

export const schema = yup.object({
  // TODO: change this to URL validation, after server supports http protocol append

  source: yup
    .string()
    .label('Source Directory')
    .trim()
    .required()
    .test('source', 'Source directory entered is incorrect', (value) =>
      /^[_.a-zA-Z0-9/-]+$/.test(value?.toString() || '')
    ),
  target: yup
    .string()
    .label('Target Directory')
    .trim()
    .required()
    .test('target', 'Target directory entered is incorrect', (value) =>
      /^[_.a-zA-Z0-9/-]+$/.test(value?.toString() || '')
    ),
  env: yup
    .string()
    .label('Environment Name')
    .trim()
    .noWhitespace()
    .max(15)
    .matches(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and dashes are allowed')
    .required()
});

export interface FormData extends yup.InferType<typeof schema> {}

type Props = {
  onSubmit: (data: FormData) => void;
  onClose: () => void;
  propertyIdentifier: string;
};

export const CreateSymlink = ({ onSubmit, onClose, propertyIdentifier }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const webPropertiesKeys = Object.keys(webProperties.data || {});
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="source"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Source Directory"
                isRequired
                fieldId="source"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
                helperText="Source directory shouldn't contain any space, special-character"
              >
                <TextInput
                  isRequired
                  placeholder="Default Source Directory Name"
                  type="text"
                  id="source"
                  {...field}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="target"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Target Directory"
                isRequired
                fieldId="target"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
                helperText="Target directory name shouldn't contain any space, special-character"
              >
                <TextInput
                  isRequired
                  placeholder="Default Target Directory"
                  type="text"
                  id="target"
                  {...field}
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
                onChange={(event) => {
                  onChange(event);
                }}
                value={value}
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
