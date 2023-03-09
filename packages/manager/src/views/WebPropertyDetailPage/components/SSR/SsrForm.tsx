/* eslint-disable react/jsx-props-no-spreading */
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useAddSsrSpaProperty } from '@app/services/ssr';
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
  Tooltip
} from '@patternfly/react-core';
import { AddCircleOIcon, InfoCircleIcon, TimesCircleIcon } from '@patternfly/react-icons';
import { AxiosError } from 'axios';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

interface Props {
  onClose: () => void;
  propertyIdentifier: string;
}

const schema = yup.object({
  name: yup.string().required(),
  path: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  env: yup.string().required(),
  ref: yup.string(),
  imageUrl: yup.string().trim().min(1, 'Image URL must not be empty').required(),
  healthCheckPath: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),

  config: yup.array().of(
    yup.object({
      key: yup.string().trim().min(1, 'Key must not be empty'),
      value: yup.string().trim().min(1, 'Value must not be empty')
    })
  )
});

export type FormData = yup.InferType<typeof schema>;

export const SSRForm = ({ onClose, propertyIdentifier }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    formState: { isSubmitting }
  } = useForm<FormData>({
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'config' as const
  });

  const createSsrSpaProperty = useAddSsrSpaProperty(propertyIdentifier);
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const webPropertiesKeys = Object.keys(webProperties.data || {});

  const onSubmit = async (dataf: FormData) => {
    const newDataf = {
      ...dataf,
      path: dataf.path.trim().startsWith('/') ? dataf.path.trim() : `/${dataf.path.trim()}`,
      healthCheckPath: dataf.healthCheckPath.trim().startsWith('/')
        ? dataf.healthCheckPath.trim()
        : `/${dataf.healthCheckPath.trim()}`,
      config: dataf.config
        ? dataf.config.reduce((acc: Record<string, string>, cur: any) => {
            acc[cur.key.trim()] = cur.value.trim();
            return acc;
          }, {})
        : {},
      propertyIdentifier: propertyIdentifier.trim()
    };

    try {
      await createSsrSpaProperty.mutateAsync(newDataf);
      onClose();
      toast.success('Deployed SSR successfully');
    } catch (error) {
      if (error instanceof AxiosError && error.response && error.response.status === 403) {
        toast.error("You don't have access to perform this action");
        onClose();
      } else {
        toast.error('Failed to deploy conatinerized application');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Name"
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
        <SplitItem isFilled>
          <Controller
            control={control}
            name="path"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Path
                    <Tooltip content={<div>Please enter context path for your application.</div>}>
                      <span>
                        &nbsp; <InfoCircleIcon style={{ color: 'var(--pf-global--link--Color)' }} />
                      </span>
                    </Tooltip>
                  </>
                }
                isRequired
                fieldId="path"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput isRequired placeholder="Path" type="text" id="path" {...field} />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>

      <Split hasGutter>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="ref"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Ref"
                fieldId="ref"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput placeholder="Ref" type="text" id="ref" {...field} />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="imageUrl"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Image URL
                    <Tooltip
                      content={
                        <div>Please enter image (url) for the containerized deployment [SSR].</div>
                      }
                    >
                      <span>
                        &nbsp; <InfoCircleIcon style={{ color: 'var(--pf-global--link--Color)' }} />
                      </span>
                    </Tooltip>
                  </>
                }
                isRequired
                fieldId="imageUrl"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Enter Image URL"
                  type="text"
                  id="imageUrl"
                  {...field}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>

      <Split hasGutter>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="healthCheckPath"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Health Check Path
                    <Tooltip
                      content={<div>Please enter path for your application health checks.</div>}
                    >
                      <span>
                        &nbsp; <InfoCircleIcon style={{ color: 'var(--pf-global--link--Color)' }} />
                      </span>
                    </Tooltip>
                  </>
                }
                isRequired
                fieldId="healthCheckPath"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput
                  isRequired
                  placeholder="Enter health Check Path"
                  type="text"
                  id="healthCheckPath"
                  {...field}
                />
              </FormGroup>
            )}
          />
        </SplitItem>
        <SplitItem isFilled>
          <Controller
            control={control}
            name="env"
            render={({ field: { onChange, value }, fieldState: { error } }) => (
              <FormGroup
                label="Select Environment"
                fieldId="select-env"
                validated={error ? 'error' : 'default'}
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
      </Split>
      <Split hasGutter>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            fontSize: 'var(--pf-c-form__label--FontSize)',
            lineHeight: 'var(--pf-c-form__label--LineHeight)',
            fontFamily: 'RedHatDisplay',
            fontWeight: 'var(--pf-c-form__label-text--FontWeight)'
          }}
        >
          Configuration
          <Tooltip content={<div>Please enter configuration values for your application.</div>}>
            <span style={{ marginLeft: '5px' }}>
              <InfoCircleIcon style={{ color: 'var(--pf-global--link--Color)' }} />
            </span>
          </Tooltip>
        </div>
        <SplitItem
          isFilled
          style={{
            display: 'grid',
            justifyContent: 'right'
          }}
        >
          <Button variant="secondary" onClick={() => append({ key: '', value: '' })}>
            <AddCircleOIcon />
          </Button>
        </SplitItem>
      </Split>
      {fields.map((pair, index) => (
        <Split key={`key-${index + 1}`} hasGutter>
          <SplitItem key={`key-${index + 1}`} isFilled>
            <Controller
              control={control}
              name={`config.${index}.key`}
              defaultValue={pair.key}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormGroup
                  label="Key"
                  fieldId={`key-${index}`}
                  validated={error ? 'error' : 'default'}
                  helperTextInvalid={error?.message}
                >
                  <TextInput
                    id={`key-${index}`}
                    type="text"
                    placeholder="Config Key"
                    value={value}
                    onChange={(event) => {
                      onChange(event);
                    }}
                    onBlur={onBlur}
                  />
                </FormGroup>
              )}
            />
          </SplitItem>
          <SplitItem key={`value-${index + 1}`} isFilled>
            <Controller
              control={control}
              name={`config.${index}.value`}
              defaultValue={pair.value}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <FormGroup
                  label="Value"
                  fieldId={`value-${index}`}
                  validated={error ? 'error' : 'default'}
                  helperTextInvalid={error?.message}
                >
                  <TextInput
                    id={`value-${index}`}
                    type="text"
                    placeholder="Config Value"
                    value={value}
                    onChange={(event) => {
                      onChange(event);
                    }}
                    onBlur={onBlur}
                  />
                </FormGroup>
              )}
            />
          </SplitItem>
          <SplitItem
            key={`remove-${index + 1}`}
            style={{
              display: 'flex',
              alignItems: 'center',
              marginLeft: 'var(--pf-global--spacer--md)',
              marginTop: 'var(--pf-global--spacer--lg)'
            }}
          >
            <Button variant="link" icon={<TimesCircleIcon />} onClick={() => remove(index)} />
          </SplitItem>
        </Split>
      ))}
      <Button isLoading={isSubmitting} type="submit">
        Submit
      </Button>
    </Form>
  );
};
