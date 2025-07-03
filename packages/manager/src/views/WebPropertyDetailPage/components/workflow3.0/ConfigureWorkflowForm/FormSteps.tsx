/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  Button,
  FormGroup,
  TextInput,
  Tooltip,
  Split,
  SplitItem,
  FormSelect,
  FormSelectOption,
  Alert
} from '@patternfly/react-core';
import { Controller, useFormContext } from 'react-hook-form';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { TFieldConfig, TFormStepProps } from './types';
import { fieldsConfig } from './FieldsConfig';

const InfoTooltip: React.FC<{ content: string }> = ({ content }) => (
  <Tooltip content={<div>{content}</div>}>
    <span>
      &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
    </span>
  </Tooltip>
);

export const FormField: React.FC<TFieldConfig> = ({
  name,
  label,
  placeholder,
  tooltip,
  isRequired,
  type = 'text',
  defaultValue,
  disabled = false,
  options = [] // Optional field for select options
}) => {
  const { control, trigger, getValues, setValue } = useFormContext();

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState: { error } }) => (
        <FormGroup
          label={
            <>
              {label}
              {tooltip && <InfoTooltip content={tooltip} />}
            </>
          }
          fieldId={name}
          validated={error ? 'error' : 'default'}
          helperTextInvalid={error?.message}
          isRequired={isRequired}
        >
          {type === 'select' ? (
            <FormSelect
              {...field}
              aria-label={`Select ${label}`}
              id={name}
              isDisabled={disabled}
              onChange={(value) => field.onChange(value)}
              value={field.value || defaultValue}
            >
              {options.map((option) => (
                <FormSelectOption
                  key={option.value}
                  value={option.value}
                  label={option.label}
                  isDisabled={option.disabled}
                />
              ))}
            </FormSelect>
          ) : (
            <TextInput
              {...field}
              placeholder={placeholder}
              type={type === 'secret' ? 'password' : 'text'}
              id={name}
              defaultValue={defaultValue}
              isDisabled={disabled}
              onChange={(value: string) => {
                if (name === 'path') {
                  const healthCheckPath = getValues('healthCheckPath');
                  if (healthCheckPath === field.value) {
                    setValue('healthCheckPath', value);
                    trigger('healthCheckPath');
                  }
                }
                field.onChange(value);
              }}
            />
          )}
        </FormGroup>
      )}
    />
  );
};

const FormStep: React.FC<TFormStepProps> = ({ step, onNext, onBack, validateMessage }) => {
  const stepFields = fieldsConfig.find((config) => config.step === step)?.fields || [];

  return (
    <>
      <div>
        <Split hasGutter>
          {stepFields.map((field: any) => (
            <SplitItem key={field.name} isFilled>
              <FormField {...field} />
            </SplitItem>
          ))}
        </Split>
        {validateMessage && (
          <Alert
            variant="danger"
            isInline
            title={validateMessage}
            timeout={5000}
            className="pf-u-mt-lg"
          />
        )}
      </div>
      <div style={{ bottom: '0px', position: 'absolute', width: '100%' }}>
        {onBack && (
          <Button
            variant="primary"
            type="button"
            onClick={onBack}
            style={{ margin: '10px 10px 10px 0px' }}
          >
            Back
          </Button>
        )}
        <Button
          variant="primary"
          type="button"
          onClick={onNext}
          style={{ margin: '10px 10px 10px 0px' }}
        >
          Next
        </Button>
      </div>
    </>
  );
};
export default FormStep;
