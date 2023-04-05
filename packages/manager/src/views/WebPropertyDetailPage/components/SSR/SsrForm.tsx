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
  name: yup.string().required().label('Application Name'),
  path: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  env: yup.string().required().label('Environment'),
  port: yup
    .string()
    .matches(/^\d+$/, { message: 'Port must contain only numbers', excludeEmptyString: true })
    .min(1, 'Port is required')
    .max(5, 'Port must be less than or equal to 5 digits')
    .trim()
    .label('Port'),
  ref: yup.string(),
  imageUrl: yup.string().trim().required().label('Image URL'),
  healthCheckPath: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  config: yup.array().of(
    yup.object({
      key: yup.string().trim().required().label('Configuration Key'),
      value: yup.string().trim().required().label('Configuration Value')
    })
  )
});

export type FormData = yup.InferType<typeof schema>;

export const SSRForm = ({ onClose, propertyIdentifier }: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { isSubmitting }
  } = useForm<FormData>({
    defaultValues: { healthCheckPath: '/', path: '/', port: '3000' },
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
      } else if (error instanceof AxiosError && error.response && error.response.status === 400) {
        toast.error(
          "Given Image URL doesn't exists on the source registry, please provide a valid imageUrl."
        );
      } else {
        toast.error('Failed to deploy containerized application');
      }
    }
  };

  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label="Application Name"
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
      </Split>

      <Split hasGutter>
        <SplitItem isFilled style={{ width: '100%' }}>
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
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="port"
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Port
                    <Tooltip content={<div>Kindly put port for your application.</div>}>
                      <span>
                        &nbsp; <InfoCircleIcon style={{ color: 'var(--pf-global--link--Color)' }} />
                      </span>
                    </Tooltip>
                  </>
                }
                isRequired
                fieldId="port"
                validated={error ? 'error' : 'default'}
                helperTextInvalid={error?.message}
              >
                <TextInput isRequired placeholder="Enter port" type="text" id="port" {...field} />
              </FormGroup>
            )}
          />
        </SplitItem>
      </Split>
      <Split>
        <SplitItem isFilled style={{ width: '100%' }}>
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
                        <div>
                          The registry URL of the application you want to deploy. for example,
                          Sample URL : quay.io/spaship/sample-ssr-app
                        </div>
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
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="path"
            rules={{ required: 'Path is required' }}
            render={({ field, fieldState: { error } }) => {
              const handleChange = (e: string) => {
                const pathValue = e;
                const healthCheckPathValue = getValues('healthCheckPath');
                if (healthCheckPathValue === field.value) {
                  setValue('healthCheckPath', pathValue);
                  trigger('healthCheckPath');
                }
                field.onChange(e);
              };
              return (
                <FormGroup
                  label={
                    <>
                      Path
                      <Tooltip
                        content={
                          <div>
                            This will be the context path is your application.
                            <br /> Please note that this should match the homepage attribute of the
                            package.json file.
                          </div>
                        }
                      >
                        <span>
                          &nbsp;{' '}
                          <InfoCircleIcon style={{ color: 'var(--pf-global--link--Color)' }} />
                        </span>
                      </Tooltip>
                    </>
                  }
                  isRequired
                  fieldId="path"
                  validated={error ? 'error' : 'default'}
                  helperTextInvalid={error?.message}
                >
                  <TextInput
                    isRequired
                    placeholder="Path"
                    type="text"
                    id="path"
                    value={field.value}
                    onChange={handleChange}
                    onBlur={() => trigger('path')}
                    style={{ marginRight: '0px' }}
                  />
                </FormGroup>
              );
            }}
          />
        </SplitItem>
        <SplitItem isFilled style={{ width: '100%' }}>
          <Controller
            control={control}
            name="healthCheckPath"
            rules={{ required: 'Health Check Path is required' }}
            render={({ field, fieldState: { error } }) => (
              <FormGroup
                label={
                  <>
                    Health Check Path
                    <Tooltip
                      content={
                        <div>
                          By default, it will pick the value of the Path attribute, used for
                          application liveness checking for monitoring and auto redeployment on
                          failure.
                        </div>
                      }
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
                  onBlur={() => trigger('healthCheckPath')}
                  style={{ marginRight: '0px' }}
                />
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
          <Tooltip
            content={
              <div>
                This will store the configuration map in key-value pairs, which will be required
                during the application runtime, for example, if your app reads a value of some env
                variable to configure itself during start-up.
              </div>
            }
          >
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
                    placeholder="Configuration Key"
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
                    placeholder="Configuration Value"
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
      <Button isLoading={isSubmitting} isDisabled={isSubmitting} type="submit">
        Submit
      </Button>
    </Form>
  );
};
