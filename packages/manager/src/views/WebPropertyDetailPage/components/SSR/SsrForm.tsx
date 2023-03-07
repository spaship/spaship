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
  TextInput
} from '@patternfly/react-core';
import { AddCircleOIcon, TimesCircleIcon } from '@patternfly/react-icons';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import { toast } from 'react-hot-toast';
import * as yup from 'yup';

interface Props {
  onClose: () => void;
  propertyIdentifier: string;
}

const schema = yup.object({
  name: yup.string().required(),
  path: yup.string().required(),
  env: yup.string().required(),
  ref: yup.string().required(),
  imageUrl: yup.string().required(),
  healthCheckPath: yup.string().required(),
  config: yup
    .array(yup.object({ key: yup.string().required(), value: yup.string().required() }))
    .required()
});

export type FormData = yup.InferType<typeof schema>;

export const SSRForm = ({ onClose, propertyIdentifier }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    register,
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

  const handleKeyValuePairChange = (index: number, field: string, value: string) => {
    const updatedField = { ...fields[index], [field]: value };
    fields[index] = updatedField;
  };

  const onSubmit = async (dataf: FormData) => {
    const newDataf = {
      ...dataf,
      path: dataf.path.startsWith('/') ? dataf.path : `/${dataf.path}`,
      healthCheckPath: dataf.healthCheckPath.startsWith('/')
        ? dataf.healthCheckPath
        : `/${dataf.healthCheckPath}`,
      config: dataf.config
        ? dataf.config.reduce((acc: Record<string, string>, cur: any) => {
            acc[cur.key] = cur.value;
            return acc;
          }, {})
        : {},
      propertyIdentifier
    };

    try {
      await createSsrSpaProperty.mutateAsync(newDataf);
      onClose();
      toast.success('Deployed SSR successfully');
    } catch (error) {
      toast.error('Failed to deploy SSR');
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
                label="Path"
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
                isRequired
                fieldId="ref"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput isRequired placeholder="Ref" type="text" id="ref" {...field} />
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
                label="Image URL"
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
                label="Health Check Path"
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
        <SplitItem isFilled>Config</SplitItem>
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
              name="config"
              render={({ fieldState: { error } }) => (
                <FormGroup
                  label="Key"
                  isRequired
                  fieldId="key"
                  validated={error ? 'error' : 'default'}
                  helperTextInvalid={error?.message}
                >
                  <TextInput
                    id={`key-${index}`}
                    type="text"
                    isRequired
                    placeholder="Config Key"
                    {...register(`config.${index}.key`)}
                    defaultValue={pair.key}
                    onChange={(event) => handleKeyValuePairChange(index, 'key', event)}
                  />
                </FormGroup>
              )}
            />
          </SplitItem>
          <SplitItem key={`value-${index + 1}`} isFilled>
            <Controller
              control={control}
              name="config"
              render={({ fieldState: { error } }) => (
                <FormGroup
                  label="Value"
                  isRequired
                  fieldId="value"
                  validated={error ? 'error' : 'default'}
                  helperTextInvalid={error?.message}
                >
                  <TextInput
                    id={`value-${index}`}
                    type="text"
                    isRequired
                    placeholder="Config Value"
                    {...register(`config.${index}.value`)}
                    defaultValue={pair.value}
                    onChange={(event) => handleKeyValuePairChange(index, 'value', event)}
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
