/* eslint-disable react/jsx-props-no-spreading */
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useAddSsrSpaProperty, useValidateSsrSpaProperty } from '@app/services/ssr';
import { yupResolver } from '@hookform/resolvers/yup';
import { Base64 } from 'js-base64';
import {
  Alert,
  Button,
  Checkbox,
  Form,
  FormGroup,
  FormSelect,
  FormSelectOption,
  Grid,
  GridItem,
  Split,
  SplitItem,
  TextInput,
  Tooltip
} from '@patternfly/react-core';
import { ExclamationCircleIcon, InfoCircleIcon, TimesCircleIcon } from '@patternfly/react-icons';
import { AxiosError } from 'axios';
import { useEffect, useState } from 'react';
import { Controller, useFieldArray, useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import * as yup from 'yup';
import './workflow.css';

const schema = yup.object({
  name: yup.string().required().label('Application Name'),
  path: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  contextDir: yup
    .string()
    .required()
    .notOneOf([' '], 'Invalid value. Cannot be only spaces.')
    .label('Context Directory'),
  gitRef: yup.string().required().trim().label('Branch'),
  dockerFileName: yup
    .string()
    .required()
    .matches(
      /^[a-zA-Z0-9._-]+$/,
      'Invalid dockerfile name. Dockerfile name must consist of alphanumeric characters, dots, underscores, or hyphens.'
    )
    .label('Dockerfile Name'),
  ref: yup.string(),
  repoUrl: yup.string().trim().required().label('Repository URL'),
  env: yup.string().required().label('Environment'),
  healthCheckPath: yup
    .string()
    .matches(/^[a-zA-Z0-9/-]+$/, 'Only letters, numbers, forward slash and dashes are allowed')
    .required(),
  config: yup.array().of(
    yup.object({
      key: yup.string().trim().required().label('Configuration Key'),
      value: yup.string().trim().required().label('Configuration Value')
    })
  ),
  secret: yup.array().of(
    yup.object({
      key: yup.string().trim().required().label('Configuration Key'),
      value: yup.string().trim().required().label('Configuration Value'),
      isSecret: yup.boolean().label('isSecret')
    })
  ),
  buildArgs: yup.array().of(
    yup.object({
      key: yup.string().trim().required().label('Key'),
      value: yup.string().trim().required().label('Value')
    })
  ),
  port: yup
    .number()
    .transform((value, originalValue) => (originalValue === '' ? undefined : value))
    .typeError('Port must be a number')
    .integer('Port must be an integer')
    .positive('Port must be a positive number')
    .test('port', 'Port must contain only numbers', (value) =>
      /^\d+$/.test(value?.toString() || '')
    )
    .min(1, 'Port is required')
    .max(99999, 'Port must be less than or equal to 5 digits')
    .test('port', 'Port must be less than or equal to 65536', (value) => {
      const portNumber = parseInt(value?.toString() || '', 10);
      return portNumber <= 65536;
    })
    .label('Port')
});

interface Props {
  onClose: () => void;
  propertyIdentifier: string;
  onSubmitWorkflow: (submit: boolean) => void;
}
export type FormData = yup.InferType<typeof schema>;
export const Workflow3 = ({
  onClose,
  propertyIdentifier,
  onSubmitWorkflow
}: Props): JSX.Element => {
  const {
    control,
    handleSubmit,
    setValue,
    getValues,
    trigger,
    formState: { errors }
  } = useForm<FormData>({
    defaultValues: {
      healthCheckPath: '/',
      path: '/',
      gitRef: 'main',
      contextDir: '/',
      port: 3000,
      dockerFileName: 'Dockerfile'
    },
    mode: 'onBlur',
    resolver: yupResolver(schema)
  });
  const [step, setStep] = useState<number>(1);
  const createSsrSpaProperty = useAddSsrSpaProperty();
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const webPropertiesKeys = Object.keys(webProperties.data || {});

  const validateSsrSpaProperty = useValidateSsrSpaProperty();
  const [repoValidateMessage, setRepoValidateMessage] = useState('');
  const [appValidateMessage, setAppValidateMessage] = useState('');

  const onSubmit = async (data: FormData) => {
    if (step === 5) {
      const toastId = toast.loading('Submitting form...');
      const newdata = {
        ...data,
        path: data.path.trim().startsWith('/') ? data.path.trim() : `/${data.path.trim()}`,
        healthCheckPath: data.healthCheckPath.trim().startsWith('/')
          ? data.healthCheckPath.trim()
          : `/${data.healthCheckPath.trim()}`,
        config: data.config
          ? data.config.reduce((acc: Record<string, any>, item) => {
              acc[item.key] = item.value;
              return acc;
            }, {})
          : {},
        secret: data.secret
          ? data.secret.reduce((acc: Record<string, any>, item) => {
              acc[item.key] = Base64.encode(item.value);

              return acc;
            }, {})
          : {},
        buildArgs: data.buildArgs
          ? data.buildArgs.map((obj) => ({ name: obj.key, value: obj.value }))
          : [],
        propertyIdentifier: propertyIdentifier.trim()
      };
      onSubmitWorkflow(true);
      onClose();

      try {
        await createSsrSpaProperty.mutateAsync(newdata);
        onClose();
        toast.success('Deployed Containerized Application successfully', { id: toastId });
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 403) {
          toast.error("You don't have access to perform this action", { id: toastId });
          onClose();
        } else if (error instanceof AxiosError && error.response && error.response.status === 400) {
          toast.error(error.response.data.message, {
            style: {
              maxWidth: '400px',
              overflowWrap: 'break-word',
              wordBreak: 'break-all'
            }
          });
        } else {
          toast.error('Failed to deploy containerized application', { id: toastId });
        }
      }
    }
  };

  const handleNext = async () => {
    const formData = getValues();
    if (step !== 3 && step !== 4 && formData.repoUrl && formData.contextDir && formData.gitRef) {
      const validateDTO = {
        propertyIdentifier,
        identifier: formData.name,
        repoUrl: formData.repoUrl,
        gitRef: formData.gitRef,
        contextDir: formData.contextDir,
        dockerFileName: formData.dockerFileName
      };
      try {
        const response = await validateSsrSpaProperty.mutateAsync(validateDTO);
        if (Object.keys(response).includes('port')) {
          if (formData.port !== 3000 && formData.port !== response?.port) {
            setValue('port', formData.port);
          } else {
            setValue('port', response?.port);
          }
          setAppValidateMessage('');
          setRepoValidateMessage('');
        } else if (Object.keys(response).includes('warning')) {
          setRepoValidateMessage(response?.warning);
          toast.error(response?.warning, {
            style: {
              maxWidth: '400px',
              overflowWrap: 'break-word',
              wordBreak: 'break-all'
            }
          });
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 403) {
          toast.error("You don't have access to perform this action", {
            style: {
              maxWidth: '400px',
              overflowWrap: 'break-word',
              wordBreak: 'break-all'
            }
          });
        } else if (error instanceof AxiosError && error.response && error.response.status === 400) {
          toast.error(error.response.data.message, {
            style: {
              maxWidth: '400px',
              overflowWrap: 'break-word',
              wordBreak: 'break-all'
            }
          });
          const updatedMessage = error.response.data.message;
          if (updatedMessage.includes('registered')) {
            setAppValidateMessage(error.response.data.message);
            setRepoValidateMessage('');
          } else {
            setRepoValidateMessage(error.response.data.message);
            setAppValidateMessage('');
          }
        } else {
          toast.error('Failed to validate the containerized application');
        }
      }
    }
    try {
      const formErrors = await trigger();

      if (Object.keys(formErrors).length === 0) {
        setStep(step + 1);
      }
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error(error);
    }
  };

  const handleBack = () => {
    setStep(step - 1);
  };

  const {
    fields: configFields,
    append: appendConfig,
    remove: removeConfig
  } = useFieldArray({
    control,
    name: 'config'
  });
  const {
    fields: buildArgsFields,
    append: appendBuildArgs,
    remove: removeBuildArgs
  } = useFieldArray({
    control,
    name: 'buildArgs'
  });
  const {
    fields: secretFields,
    append: appendSecret,
    remove: removeSecret
  } = useFieldArray({
    control,
    name: 'secret'
  });
  const handleAddConfig = () => {
    appendConfig({ key: '', value: '' });
  };
  const handleAddSecret = () => {
    appendSecret({ key: '', value: '', isSecret: true });
  };
  const handleAddBuildArgs = () => {
    appendBuildArgs({ key: '', value: '' });
  };
  const handleClick = async (stepNumber: number) => {
    setStep(stepNumber);
    const formData = getValues();
    if (step !== 3 && step !== 4 && formData.repoUrl && formData.contextDir && formData.gitRef) {
      const validateDTO = {
        propertyIdentifier,
        identifier: formData.name,
        repoUrl: formData.repoUrl,
        gitRef: formData.gitRef,
        contextDir: formData.contextDir,
        dockerFileName: formData.dockerFileName
      };
      try {
        const response = await validateSsrSpaProperty.mutateAsync(validateDTO);
        if (Object.keys(response).includes('port')) {
          if (formData.port !== 3000 && formData.port !== response?.port) {
            setValue('port', formData.port);
          } else {
            setValue('port', response?.port);
          }
          setAppValidateMessage('');
          setRepoValidateMessage('');
        } else if (Object.keys(response).includes('warning')) {
          setRepoValidateMessage(response?.warning);
        }
      } catch (error) {
        if (error instanceof AxiosError && error.response && error.response.status === 403) {
          toast.error("You don't have access to perform this action", {
            style: {
              maxWidth: '400px',
              overflowWrap: 'break-word',
              wordBreak: 'break-all'
            }
          });
        } else if (error instanceof AxiosError && error.response && error.response.status === 400) {
          const updatedMessage = error.response.data.message;
          if (updatedMessage.includes('registered')) {
            setAppValidateMessage(error.response.data.message);
            setRepoValidateMessage('');
          } else {
            setRepoValidateMessage(error.response.data.message);
            setAppValidateMessage('');
          }
        } else {
          toast.error('Failed to validate the containerized application');
        }
      }
    }
  };

  const [enabledStates, setEnabledStates] = useState(secretFields.map((pair) => pair.isSecret));
  useEffect(() => {
    setEnabledStates(secretFields.map((pair) => pair.isSecret));
  }, [secretFields]);
  return (
    <Form onSubmit={handleSubmit(onSubmit)}>
      <Grid>
        <GridItem span={3}>
          <ul className="step-list">
            <li>
              <Button
                variant="link"
                onClick={() => handleClick(1)}
                style={{ color: step === 1 ? '#FDB716' : 'black' }}
              >
                <span
                  className="step-number"
                  style={{ backgroundColor: step === 1 ? '#FDB716' : '#ccc', color: '#000' }}
                >
                  1
                </span>
                Repository Details
                {repoValidateMessage !== '' && (
                  <span>
                    &nbsp;
                    <ExclamationCircleIcon style={{ color: '#c9190b' }} />
                  </span>
                )}
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                onClick={() => handleClick(2)}
                style={{ color: step === 2 ? '#FDB716' : 'black' }}
              >
                <span
                  className="step-number"
                  style={{ backgroundColor: step === 2 ? '#FDB716' : '#ccc', color: '#000' }}
                >
                  2
                </span>
                Application Details
                {appValidateMessage !== '' && (
                  <span>
                    &nbsp;
                    <ExclamationCircleIcon style={{ color: '#c9190b' }} />
                  </span>
                )}
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                onClick={() => handleClick(3)}
                style={{ color: step === 3 ? '#FDB716' : 'black' }}
              >
                <span
                  className="step-number"
                  style={{ backgroundColor: step === 3 ? '#FDB716' : '#ccc', color: '#000' }}
                >
                  3
                </span>
                Application Configuration
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                onClick={() => handleClick(4)}
                style={{ color: step === 4 ? '#FDB716' : 'black' }}
              >
                <span
                  className="step-number"
                  style={{ backgroundColor: step === 4 ? '#FDB716' : '#ccc', color: '#000' }}
                >
                  4
                </span>
                Build Arguments
              </Button>
            </li>
            <li>
              <Button
                variant="link"
                onClick={() => handleClick(5)}
                style={{ color: step === 5 ? '#FDB716' : 'black' }}
              >
                <span
                  className="step-number"
                  style={{ backgroundColor: step === 5 ? '#FDB716' : '#ccc', color: '#000' }}
                >
                  5
                </span>
                Review
              </Button>
            </li>
          </ul>
        </GridItem>
        <GridItem span={9} style={{ borderLeft: '1px solid grey', paddingLeft: '20px' }}>
          {step === 1 && (
            <>
              <div>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }}>
                    <Controller
                      control={control}
                      name="repoUrl"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label={
                            <>
                              Repository URL
                              <Tooltip
                                content={
                                  <div>
                                    Public gitlab/github repository URL of the application, for
                                    example:&nbsp;
                                    <em>https://github.com/spaship/spaship</em>
                                  </div>
                                }
                              >
                                <span>
                                  &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                                </span>
                              </Tooltip>
                            </>
                          }
                          isRequired
                          fieldId="repoUrl"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            isRequired
                            placeholder="Enter Repository URL"
                            type="text"
                            id="repoUrl"
                            {...field}
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="contextDir"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label={
                            <>
                              Context Directory
                              <Tooltip
                                content={
                                  <div>
                                    For mono repo, specify the name of the directory where the
                                    application exists example, <b>package/home</b> default will be{' '}
                                    <b>/</b>
                                  </div>
                                }
                              >
                                <span>
                                  &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                                </span>
                              </Tooltip>
                            </>
                          }
                          isRequired
                          fieldId="contextDir"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            isRequired
                            placeholder="Enter Context Directory"
                            type="text"
                            id="contextDir"
                            {...field}
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="gitRef"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label="Git Branch"
                          fieldId="gitRef"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                          isRequired
                        >
                          <TextInput placeholder="Git Branch" type="text" id="branch" {...field} />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="dockerFileName"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label="Enter Dockerfile name"
                          fieldId="dockerFileName"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                          isRequired
                        >
                          <TextInput
                            placeholder="dockerfile name"
                            type="text"
                            id="dockerFileName"
                            {...field}
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
              </div>
              {repoValidateMessage !== '' && (
                <Alert
                  variant="danger"
                  isInline
                  title={repoValidateMessage}
                  timeout={5000}
                  className="pf-u-mt-lg"
                />
              )}

              <div style={{ bottom: '0px', position: 'absolute', width: '100%' }}>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleNext}
                  style={{ margin: '10px 10px 10px 0px' }}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 2 && (
            <>
              <div>
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
                            placeholder="Please enter application name"
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
                      render={({ field }) => (
                        <FormGroup
                          label="Select Environment"
                          fieldId="select-env"
                          validated={errors.env ? 'error' : 'default'}
                          isRequired
                          helperTextInvalid={errors.env?.message}
                        >
                          <FormSelect
                            label="Select Environment"
                            aria-label="FormSelect Input"
                            {...field}
                          >
                            <FormSelectOption
                              key={1}
                              label="Please select an environment"
                              isDisabled
                            />
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
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
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
                            style={{ color: '#000' }}
                            label={
                              <>
                                Path
                                <Tooltip
                                  content={
                                    <div>
                                      This will be the context path is your application.
                                      <br /> Please note that this should match the homepage
                                      attribute of the package.json file.
                                    </div>
                                  }
                                >
                                  <span>
                                    &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
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
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="healthCheckPath"
                      rules={{ required: 'Health Check Path is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label={
                            <>
                              Health Check Path
                              <Tooltip
                                content={
                                  <div>
                                    By default, it will pick the value of the Path attribute, used
                                    for application liveness checking for monitoring and auto
                                    redeployment on failure.
                                  </div>
                                }
                              >
                                <span>
                                  &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
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
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="ref"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label="Reference"
                          fieldId="ref"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput placeholder="Reference" type="text" id="ref" {...field} />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>

                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="port"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          label={
                            <>
                              Port
                              <Tooltip
                                content={
                                  <div>
                                    Specify the port number mentioned in your Dockerfile&apos;s
                                    EXPOSE instruction, on which the container accepts incoming HTTP
                                    requests.
                                  </div>
                                }
                              >
                                <span>
                                  &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                                </span>
                              </Tooltip>
                            </>
                          }
                          isRequired
                          fieldId="port"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            isRequired
                            placeholder="Enter port"
                            type="text"
                            id="port"
                            {...field}
                            defaultValue={3000}
                            onChange={(e) => {
                              const value = parseInt(e, 10);
                              if (!Number.isNaN(value)) {
                                setValue('port', value);
                              } else {
                                setValue('port', 0);
                              }
                            }}
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
              </div>
              {appValidateMessage !== '' && (
                <Alert
                  variant="danger"
                  isInline
                  title={appValidateMessage}
                  timeout={5000}
                  className="pf-u-mt-lg"
                />
              )}
              <div style={{ bottom: '0px', position: 'absolute', width: '100%' }}>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleBack}
                  style={{ margin: '10px 10px 10px 0px' }}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleNext}
                  style={{ margin: '10px 10px 10px 0px' }}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 3 && (
            <>
              <div>
                <div className="form-header">
                  Configuration
                  <Tooltip
                    content={
                      <div>
                        This will store the configuration map in key-value pairs, which will be
                        required during the application runtime, for example, if your app reads a
                        value of some env variable to configure itself during start-up.
                      </div>
                    }
                  >
                    <span style={{ marginLeft: '5px' }}>
                      <InfoCircleIcon style={{ color: '#6A6E73' }} />
                    </span>
                  </Tooltip>
                </div>
                <Split hasGutter>
                  <SplitItem
                    isFilled
                    style={{
                      display: 'grid',
                      justifyContent: 'right'
                    }}
                  >
                    <Button variant="link" style={{ color: '#6A6E73' }} onClick={handleAddConfig}>
                      Add Key Value
                    </Button>
                  </SplitItem>
                </Split>
                {configFields.map((pair, index) => (
                  <Split key={pair.id} hasGutter>
                    <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
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
                    <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
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
                      key={`remove-config-${pair.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 'var(--pf-global--spacer--md)'
                      }}
                    >
                      <Button
                        variant="link"
                        icon={<TimesCircleIcon />}
                        onClick={() => removeConfig(index)}
                      />
                    </SplitItem>
                  </Split>
                ))}
              </div>
              <div>
                <div className="form-header">
                  Secret
                  <Tooltip
                    content={
                      <div>
                        This will store the secret map in key-value pairs, these values can be
                        accessed internally from the applications.
                      </div>
                    }
                  >
                    <span style={{ marginLeft: '5px' }}>
                      <InfoCircleIcon style={{ color: '#6A6E73' }} />
                    </span>
                  </Tooltip>
                </div>
                <Split hasGutter>
                  <SplitItem
                    isFilled
                    style={{
                      display: 'grid',
                      justifyContent: 'right'
                    }}
                  >
                    <Button variant="link" style={{ color: '#6A6E73' }} onClick={handleAddSecret}>
                      Add Secret
                    </Button>
                  </SplitItem>
                </Split>
                {secretFields.map((pair, index) => (
                  <Split key={pair.id} hasGutter>
                    <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                      <Controller
                        control={control}
                        name={`secret.${index}.key`}
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
                              placeholder="Secret Key"
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
                    <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                      <Controller
                        control={control}
                        name={`secret.${index}.value`}
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
                              type={enabledStates[index] ? 'password' : 'text'}
                              placeholder="Secret Value"
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
                    <SplitItem style={{ paddingTop: 'var(--pf-global--spacer--lg)' }}>
                      <Controller
                        control={control}
                        name={`secret.${index}.isSecret`}
                        defaultValue={!enabledStates[index]}
                        render={({ field: { onChange, value } }) => (
                          <Checkbox
                            id={`enabled-${index}`}
                            isChecked={!value}
                            onChange={(checked) => {
                              const updatedEnabledStates = [...enabledStates];
                              updatedEnabledStates[index] = !checked;
                              setEnabledStates(updatedEnabledStates);
                              onChange(!checked);
                            }}
                            label="Show Secret"
                          />
                        )}
                      />
                    </SplitItem>
                    <SplitItem
                      key={`remove-secret-${pair.id}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 'var(--pf-global--spacer--md)'
                      }}
                    >
                      <Button
                        variant="link"
                        icon={<TimesCircleIcon />}
                        onClick={() => removeSecret(index)}
                      />
                    </SplitItem>
                  </Split>
                ))}
              </div>
              <div style={{ bottom: '0px', position: 'absolute', width: '100%' }}>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleBack}
                  style={{ margin: '10px 10px 10px 0px' }}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleNext}
                  style={{ margin: '10px 10px 10px 0px' }}
                >
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 4 && (
            <>
              <div>
                <div className="form-header">
                  Build Arugments
                  <Tooltip
                    content={
                      <div>
                        This will store the build arguments in key-value pairs, which will be
                        required during the building an application.
                      </div>
                    }
                  >
                    <span style={{ marginLeft: '5px' }}>
                      <InfoCircleIcon style={{ color: '#6A6E73' }} />
                    </span>
                  </Tooltip>
                </div>
                <Split hasGutter>
                  <SplitItem
                    isFilled
                    style={{
                      display: 'grid',
                      justifyContent: 'right'
                    }}
                  >
                    <Button
                      variant="link"
                      style={{ color: '#6A6E73' }}
                      onClick={handleAddBuildArgs}
                    >
                      Add Key Value
                    </Button>
                  </SplitItem>
                </Split>
                {buildArgsFields.map((pair, index) => (
                  <Split key={pair.id} hasGutter>
                    <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                      <Controller
                        control={control}
                        name={`buildArgs.${index}.key`}
                        defaultValue={pair.key}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <FormGroup
                            label="Key"
                            fieldId={`buildArgskey-${index}`}
                            validated={error ? 'error' : 'default'}
                            helperTextInvalid={error?.message}
                          >
                            <TextInput
                              id={`buildArgskey-${index}`}
                              type="text"
                              placeholder="Key"
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
                    <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                      <Controller
                        control={control}
                        name={`buildArgs.${index}.value`}
                        defaultValue={pair.value}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <FormGroup
                            label="Value"
                            fieldId={`buildArgsvalue-${index}`}
                            validated={error ? 'error' : 'default'}
                            helperTextInvalid={error?.message}
                          >
                            <TextInput
                              id={`buildArgsvalue-${index}`}
                              type="text"
                              placeholder="Value"
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
                      key={`buildArgsremove-${index + 1}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        marginLeft: 'var(--pf-global--spacer--md)',
                        marginTop: 'var(--pf-global--spacer--lg)'
                      }}
                    >
                      <Button
                        variant="link"
                        icon={<TimesCircleIcon />}
                        onClick={() => removeBuildArgs(index)}
                      />
                    </SplitItem>
                  </Split>
                ))}
              </div>
              <div style={{ bottom: '0px', position: 'absolute', width: '100%' }}>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleBack}
                  style={{ margin: '10px 10px 10px 0px' }}
                >
                  Back
                </Button>
                <Button
                  variant="primary"
                  type="button"
                  onClick={handleNext}
                  style={{ margin: '10px 10px 10px 0px' }}
                >
                  Next
                </Button>
              </div>
            </>
          )}
          {step === 5 && (
            <>
              <div>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }}>
                    <Controller
                      control={control}
                      name="repoUrl"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label={
                            <>
                              Repository URL
                              <Tooltip
                                content={
                                  <div>
                                    Public gitlab/github repository URL of the application, for
                                    example:&nbsp;
                                    <em>https://github.com/spaship/spaship</em>
                                  </div>
                                }
                              >
                                <span>
                                  &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                                </span>
                              </Tooltip>
                            </>
                          }
                          isRequired
                          fieldId="repoUrl"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            isRequired
                            placeholder="Enter Repository URL"
                            type="text"
                            id="repoUrl"
                            {...field}
                            isDisabled
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="contextDir"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label={
                            <>
                              Context Directory
                              <Tooltip
                                content={
                                  <div>
                                    For mono repo, specify the name of the directory where the
                                    application exists example, <b>package/home</b> default will be{' '}
                                    <b>/</b>
                                  </div>
                                }
                              >
                                <span>
                                  &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                                </span>
                              </Tooltip>
                            </>
                          }
                          isRequired
                          fieldId="contextDir"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            isRequired
                            placeholder="Enter Context Directory"
                            type="text"
                            id="contextDir"
                            {...field}
                            isDisabled
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="gitRef"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label="Git Branch"
                          fieldId="gitRef"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            placeholder="Git Branch"
                            type="text"
                            id="branch"
                            {...field}
                            isDisabled
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="dockerFileName"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label="Enter Dockerfile name"
                          fieldId="dockerFileName"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                          isRequired
                        >
                          <TextInput
                            placeholder="dockerfile name"
                            type="text"
                            id="dockerFileName"
                            {...field}
                            isDisabled
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
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
                            placeholder="Please enter application name"
                            type="text"
                            id="property-name"
                            {...field}
                            isDisabled
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="env"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          label="Select Environment"
                          fieldId="select-env"
                          validated={error ? 'error' : 'default'}
                          isRequired
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            isRequired
                            placeholder="Please select an environment"
                            type="text"
                            id="path"
                            {...field}
                            style={{ marginRight: '0px' }}
                            isDisabled
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
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
                            style={{ color: '#000' }}
                            label={
                              <>
                                Path
                                <Tooltip
                                  content={
                                    <div>
                                      This will be the context path is your application.
                                      <br /> Please note that this should match the homepage
                                      attribute of the package.json file.
                                    </div>
                                  }
                                >
                                  <span>
                                    &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
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
                              isDisabled
                            />
                          </FormGroup>
                        );
                      }}
                    />
                  </SplitItem>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="healthCheckPath"
                      rules={{ required: 'Health Check Path is required' }}
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label={
                            <>
                              Health Check Path
                              <Tooltip
                                content={
                                  <div>
                                    By default, it will pick the value of the Path attribute, used
                                    for application liveness checking for monitoring and auto
                                    redeployment on failure.
                                  </div>
                                }
                              >
                                <span>
                                  &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
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
                            isDisabled
                            onBlur={() => trigger('healthCheckPath')}
                            style={{ marginRight: '0px' }}
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>
                <Split hasGutter>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="ref"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          style={{ color: '#000' }}
                          label="Reference"
                          fieldId="ref"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            placeholder="Reference"
                            type="text"
                            id="ref"
                            {...field}
                            isDisabled
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                  <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
                    <Controller
                      control={control}
                      name="port"
                      render={({ field, fieldState: { error } }) => (
                        <FormGroup
                          label={
                            <>
                              Port
                              <Tooltip
                                content={
                                  <div>
                                    Specify the port number mentioned in your Dockerfile&apos;s
                                    EXPOSE instruction, on which the container accepts incoming HTTP
                                    requests.
                                  </div>
                                }
                              >
                                <span>
                                  &nbsp; <InfoCircleIcon style={{ color: '#6A6E73' }} />
                                </span>
                              </Tooltip>
                            </>
                          }
                          isRequired
                          fieldId="port"
                          validated={error ? 'error' : 'default'}
                          helperTextInvalid={error?.message}
                        >
                          <TextInput
                            isRequired
                            placeholder="Enter port"
                            type="text"
                            id="port"
                            {...field}
                            isDisabled
                          />
                        </FormGroup>
                      )}
                    />
                  </SplitItem>
                </Split>

                {configFields.length !== 0 && (
                  <Split hasGutter>
                    <div className="form-header">
                      Configuration
                      <Tooltip
                        content={
                          <div>
                            This will store the configuration map in key-value pairs, which will be
                            required during the application runtime, for example, if your app reads
                            a value of some env variable to configure itself during start-up.
                          </div>
                        }
                      >
                        <span style={{ marginLeft: '5px' }}>
                          <InfoCircleIcon style={{ color: '#6A6E73' }} />
                        </span>
                      </Tooltip>
                    </div>
                  </Split>
                )}
                {configFields &&
                  configFields.map((pair, index) => (
                    <Split key={pair.id} hasGutter>
                      <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                        <Controller
                          control={control}
                          name={`config.${index}.key`}
                          defaultValue={pair.key}
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error }
                          }) => (
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
                                isDisabled
                              />
                            </FormGroup>
                          )}
                        />
                      </SplitItem>
                      <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                        <Controller
                          control={control}
                          name={`config.${index}.value`}
                          defaultValue={pair.value}
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error }
                          }) => (
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
                                isDisabled
                              />
                            </FormGroup>
                          )}
                        />
                      </SplitItem>
                    </Split>
                  ))}
                {secretFields.length !== 0 && (
                  <Split>
                    Secret
                    <Tooltip
                      content={
                        <div>
                          This will store the secret map in key-value pairs, these values can be
                          accessed internally from the applications.
                        </div>
                      }
                    >
                      <span style={{ marginLeft: '5px' }}>
                        <InfoCircleIcon style={{ color: '#6A6E73' }} />
                      </span>
                    </Tooltip>
                  </Split>
                )}
                {secretFields &&
                  secretFields.map((pair, index) => (
                    <Split key={pair.id} hasGutter>
                      <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                        <Controller
                          control={control}
                          name={`secret.${index}.key`}
                          defaultValue={pair.key}
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error }
                          }) => (
                            <FormGroup
                              label="Key"
                              fieldId={`key-${index}`}
                              validated={error ? 'error' : 'default'}
                              helperTextInvalid={error?.message}
                            >
                              <TextInput
                                id={`key-${index}`}
                                type="text"
                                placeholder="Secret Key"
                                value={value}
                                onChange={(event) => {
                                  onChange(event);
                                }}
                                onBlur={onBlur}
                                isDisabled
                              />
                            </FormGroup>
                          )}
                        />
                      </SplitItem>
                      <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                        <Controller
                          control={control}
                          name={`secret.${index}.value`}
                          defaultValue={pair.value}
                          render={({
                            field: { onChange, onBlur, value },
                            fieldState: { error }
                          }) => (
                            <FormGroup
                              label="Value"
                              fieldId={`value-${index}`}
                              validated={error ? 'error' : 'default'}
                              helperTextInvalid={error?.message}
                            >
                              <TextInput
                                id={`value-${index}`}
                                type="password"
                                placeholder="Secret Value"
                                value={value}
                                onChange={(event) => {
                                  onChange(event);
                                }}
                                onBlur={onBlur}
                                isDisabled
                              />
                            </FormGroup>
                          )}
                        />
                      </SplitItem>
                    </Split>
                  ))}

                {buildArgsFields.length !== 0 && (
                  <Split hasGutter>
                    <div className="form-header">
                      Build Arugments
                      <Tooltip
                        content={
                          <div>
                            This will store the configuration map in key-value pairs, which will be
                            required during the application runtime, for example, if your app reads
                            a value of some env variable to configure itself during start-up.
                          </div>
                        }
                      >
                        <span style={{ marginLeft: '5px' }}>
                          <InfoCircleIcon style={{ color: '#6A6E73' }} />
                        </span>
                      </Tooltip>
                    </div>
                  </Split>
                )}
                {buildArgsFields.map((pair, index) => (
                  <Split key={pair.id} hasGutter>
                    <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                      <Controller
                        control={control}
                        name={`buildArgs.${index}.key`}
                        defaultValue={pair.key}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <FormGroup
                            label="Key"
                            fieldId={`buildArgskey-${index}`}
                            validated={error ? 'error' : 'default'}
                            helperTextInvalid={error?.message}
                          >
                            <TextInput
                              id={`buildArgskey-${index}`}
                              type="text"
                              placeholder="Key"
                              value={value}
                              onChange={(event) => {
                                onChange(event);
                              }}
                              onBlur={onBlur}
                              isDisabled
                            />
                          </FormGroup>
                        )}
                      />
                    </SplitItem>
                    <SplitItem key={pair.id} isFilled className="pf-u-mr-md pf-u-mb-lg">
                      <Controller
                        control={control}
                        name={`buildArgs.${index}.value`}
                        defaultValue={pair.value}
                        render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                          <FormGroup
                            label="Value"
                            fieldId={`buildArgsvalue-${index}`}
                            validated={error ? 'error' : 'default'}
                            helperTextInvalid={error?.message}
                          >
                            <TextInput
                              id={`buildArgsvalue-${index}`}
                              type="text"
                              placeholder="Value"
                              value={value}
                              onChange={(event) => {
                                onChange(event);
                              }}
                              onBlur={onBlur}
                              isDisabled
                            />
                          </FormGroup>
                        )}
                      />
                    </SplitItem>
                  </Split>
                ))}
              </div>
              <Button
                variant="primary"
                type="button"
                onClick={handleBack}
                style={{ margin: '10px 10px 10px 0px' }}
              >
                Back
              </Button>
              <Button
                variant="primary"
                type="submit"
                isDisabled={
                  Object.keys(errors).length > 0 ||
                  repoValidateMessage !== '' ||
                  appValidateMessage !== ''
                }
              >
                Submit
              </Button>
            </>
          )}
        </GridItem>
      </Grid>
    </Form>
  );
};
