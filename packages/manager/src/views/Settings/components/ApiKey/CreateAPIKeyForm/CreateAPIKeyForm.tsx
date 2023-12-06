/* eslint-disable react/jsx-props-no-spreading */
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

import {
  ActionGroup,
  Button,
  Checkbox,
  ClipboardCopy,
  DatePicker,
  Form,
  FormGroup,
  Split,
  SplitItem,
  TextInput
} from '@patternfly/react-core';
import { useState } from 'react';

export const schema = yup.object({
  label: yup.string().label('Label').trim().max(50).required(),
  env: yup
    .array(
      yup
        .string()
        .label('Environment')
        .trim()
        .noWhitespace()
        .matches(/^[a-zA-Z0-9-]+$/, 'Only letters, numbers, and dashes are allowed')
        .required()
    )
    .label('Environments')
    .min(1)
    .required(),
  expiresIn: yup
    .mixed()
    .test(
      'valid-value',
      'Invalid value',
      (value) => value === 'NA' || value === '' || yup.date().isValidSync(value)
    )
    .test('is-valid-date', 'Date selected is expired', (value) => {
      if (value !== 'NA' && value !== '') {
        const present = new Date();
        const expiry = new Date(value);
        return present < expiry;
      }
      return true;
    })
    .test('is-invalid-range', 'Expiry should not be more than 1 year', (value) => {
      if (value !== 'NA' && value !== '') {
        const maxDate = new Date();
        maxDate.setDate(maxDate.getDate() + 365);
        const expiry = new Date(value);
        return maxDate > expiry;
      }
      return true;
    })
});

export interface FormData extends yup.InferType<typeof schema> {}

type Props = {
  onSubmit: (data: FormData) => void;
  onClose: () => void;
  envs: string[];
  token?: string;
};

export const CreateAPIKeyForm = ({ onSubmit, onClose, envs = [], token }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting, errors }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });
  const [isChecked, setisChecked] = useState<boolean>(false);

  const handleChange = (checked: boolean) => {
    setisChecked(checked);
  };
  const hasErrors = Object.keys(errors).length > 0;

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="label"
            defaultValue=""
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Label"
                fieldId="key-label"
                isRequired
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  placeholder="Add a label for your key"
                  type="text"
                  id="property-label"
                  {...field}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem>
          <Controller
            control={control}
            name="expiresIn"
            // defaultValue={!isChecked ? '' : 'NA'}
            render={({ field: { onChange, value, onBlur }, fieldState: { error } }) => (
              <FormGroup
                label="API Key Expiry"
                fieldId="property-env-expiry"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
                isRequired
              >
                <DatePicker
                  value={!isChecked ? value : 'NA'}
                  onBlur={(str) => {
                    onBlur();
                    onChange(str);
                  }}
                  appendTo={() => document.body}
                  popoverProps={
                    {
                      position: 'left'
                      // TODO: This is a ts type bug in Pfe asking for body content. Will raise it in PFE
                    } as any
                  }
                  onChange={(str) => {
                    if (!isChecked) {
                      onChange(str);
                    }
                    onBlur();
                  }}
                  isDisabled={isChecked}
                />
                <Checkbox
                  className="pf-u-mt-md"
                  label="Never Expire"
                  isChecked={isChecked}
                  onChange={(checked) => {
                    if (checked) {
                      onChange('NA');
                    } else {
                      onChange('');
                    }
                    handleChange(checked);
                  }}
                  id="controlled-check-1"
                  name="Never Expire"
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Controller
        control={control}
        defaultValue={[]}
        name="env"
        render={({ field: { value, onChange }, fieldState: { error } }) => (
          <FormGroup
            label="Environments"
            isRequired
            fieldId="property-env"
            validated={error ? 'error' : 'default'}
            helperTextInvalid={error?.message}
            helperText="Select at least 1 environment"
          >
            <Split hasGutter isWrappable className="pf-u-mb-md">
              {envs.map((env) => (
                <SplitItem key={env}>
                  <Checkbox
                    label={env}
                    aria-label={env}
                    isChecked={(value || [])?.includes(env)}
                    id={env}
                    onChange={(checked) => {
                      if (checked) {
                        onChange([...(value || []), env]);
                      } else {
                        onChange(value?.filter((val) => val !== env));
                      }
                    }}
                  />
                </SplitItem>
              ))}
            </Split>
          </FormGroup>
        )}
      />
      <ClipboardCopy hoverTip="Copy" clickTip="Copied" isReadOnly>
        {token}
      </ClipboardCopy>

      <ActionGroup>
        {token ? (
          <Button variant="primary" onClick={onClose}>
            Close
          </Button>
        ) : (
          <>
            <Button
              variant="primary"
              type="submit"
              isLoading={isSubmitting}
              isDisabled={hasErrors} // Disable if submitting or if there are validation errors
            >
              Create
            </Button>
            <Button variant="link" onClick={onClose}>
              Cancel
            </Button>
          </>
        )}
      </ActionGroup>
    </Form>
  );
};

CreateAPIKeyForm.defaultProps = {
  token: ''
};
