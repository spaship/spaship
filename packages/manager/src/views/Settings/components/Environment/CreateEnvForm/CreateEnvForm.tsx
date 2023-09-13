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
  TextInput
} from '@patternfly/react-core';
import { CustomRadio, CustomRadioContainer } from '@app/components';

export const schema = yup.object({
  // TODO: change this to URL validation, after server supports http protocol append

  url: yup.string().label('Hostname URL').trim().required().max(250),
  env: yup
    .string()
    .label('Environment Name')
    .trim()
    .noWhitespace()
    .max(15)
    .matches(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and dashes are allowed')
    .required(),
  cluster: yup.string().label('Environment Type').oneOf(['preprod', 'prod']).required()
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
                helperText="Environment name shouldn't contain any space, special-character"
              >
                <TextInput
                  isRequired
                  placeholder="Default Environment Name"
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
            name="cluster"
            defaultValue="preprod"
            render={({ field: { onChange, value } }) => (
              <FormGroup
                role="radiogroup"
                label="Environment Type"
                isInline
                fieldId="property-env-type"
              >
                <CustomRadioContainer>
                  <CustomRadio
                    name="basic-inline-radio"
                    label="Pre-Prod"
                    id="pre-prod-radio"
                    isChecked={value === 'preprod'}
                    isSelected={value === 'preprod'}
                    onChange={() => onChange('preprod')}
                  />
                  <CustomRadio
                    name="basic-inline-radio"
                    label="Prod"
                    id="prod-radio"
                    isChecked={value === 'prod'}
                    isSelected={value === 'prod'}
                    onChange={() => onChange('prod')}
                  />
                </CustomRadioContainer>
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
