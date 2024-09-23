import React, { FC } from 'react';
import {
  Split,
  SplitItem,
  FormGroup,
  Tooltip,
  TextInput,
  Button,
  FormSelect,
  FormSelectOption
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';

interface KeyValuePair {
  key: string;
  value: string;
}

interface FormValues {
  repoUrl: string;
  contextDir: string;
  gitRef: string;
  dockerFileName: string;
  name: string;
  env: string;
  path: string;
  healthCheckPath: string;
  ref?: string;
  port?: number;
  config?: KeyValuePair[];
  secret?: KeyValuePair[];
  buildArgs?: KeyValuePair[];
  replicas?: string;
  requiredCpu?: string;
  requiredMemory?: string;
  limitCpu?: string;
  limitMemory?: string;
}

interface ReplicaOption {
  value: string;
  label: string;
  disabled?: boolean;
}

interface FormErrors {
  [key: string]: {
    message?: string;
  };
}

interface ReviewSectionProps {
  formValues: FormValues;
  handleBack: () => void;
  repoValidateMessage: string;
  appValidateMessage: string;
  errors: FormErrors;
}

const ReviewSection: FC<ReviewSectionProps> = ({
  formValues,
  handleBack,
  repoValidateMessage,
  appValidateMessage,
  errors
}) => {
  const isSubmitDisabled =
    Object.keys(errors).length > 0 || repoValidateMessage !== '' || appValidateMessage !== '';

  return (
    <>
      <div>
        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }}>
            <FormGroup
              label={
                <>
                  Repository URL
                  <Tooltip
                    content={
                      <div>
                        Public GitLab/GitHub repository URL of the application, for example:&nbsp;
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
            >
              <TextInput
                isRequired
                value={formValues.repoUrl}
                type="text"
                id="repoUrl"
                isDisabled
              />
            </FormGroup>
          </SplitItem>
        </Split>
        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup
              label={
                <>
                  Context Directory
                  <Tooltip
                    content={
                      <div>
                        For mono repo, specify the name of the directory where the application
                        exists, e.g., <b>package/home</b>. Default will be <b>/</b>
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
            >
              <TextInput
                isRequired
                value={formValues.contextDir}
                type="text"
                id="contextDir"
                isDisabled
              />
            </FormGroup>
          </SplitItem>
        </Split>
        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="Git Branch" fieldId="gitRef">
              <TextInput value={formValues.gitRef} type="text" id="gitRef" isDisabled />
            </FormGroup>
          </SplitItem>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="Enter Dockerfile Name" isRequired fieldId="dockerFileName">
              <TextInput
                isRequired
                value={formValues.dockerFileName}
                type="text"
                id="dockerFileName"
                isDisabled
              />
            </FormGroup>
          </SplitItem>
        </Split>
        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="Application Name" isRequired fieldId="property-name">
              <TextInput
                isRequired
                value={formValues.name}
                type="text"
                id="property-name"
                isDisabled
              />
            </FormGroup>
          </SplitItem>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="Select Environment" isRequired fieldId="select-env">
              <TextInput isRequired value={formValues.env} type="text" id="env" isDisabled />
            </FormGroup>
          </SplitItem>
        </Split>
        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup
              label={
                <>
                  Path
                  <Tooltip
                    content={
                      <div>
                        This will be the context path of your application.
                        <br /> Please note that this should match the homepage attribute of the
                        package.json file.
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
            >
              <TextInput isRequired value={formValues.path} type="text" id="path" isDisabled />
            </FormGroup>
          </SplitItem>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup
              label={
                <>
                  Health Check Path
                  <Tooltip
                    content={
                      <div>
                        By default, it will pick the value of the Path attribute. Used for
                        application liveness checking for monitoring and auto redeployment on
                        failure.
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
            >
              <TextInput
                isRequired
                value={formValues.healthCheckPath}
                type="text"
                id="healthCheckPath"
                isDisabled
              />
            </FormGroup>
          </SplitItem>
        </Split>
        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="Reference" fieldId="ref">
              <TextInput value={formValues.ref} type="text" id="ref" isDisabled />
            </FormGroup>
          </SplitItem>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup
              label={
                <>
                  Port
                  <Tooltip
                    content={
                      <div>
                        Specify the port number mentioned in your Dockerfile&apos;s EXPOSE
                        instruction, on which the container accepts incoming HTTP requests.
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
            >
              <TextInput isRequired value={formValues.port} type="text" id="port" isDisabled />
            </FormGroup>
          </SplitItem>
        </Split>
        {formValues.config && formValues.config.length > 0 && (
          <>
            <Split hasGutter>
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
            </Split>
            {formValues.config.map((pair, index) => (
              <Split key={index} hasGutter>
                <SplitItem isFilled className="pf-u-mr-md pf-u-mb-lg">
                  <FormGroup label="Key" fieldId={`config-key-${index}`}>
                    <TextInput value={pair.key} type="text" id={`config-key-${index}`} isDisabled />
                  </FormGroup>
                </SplitItem>
                <SplitItem isFilled className="pf-u-mr-md pf-u-mb-lg">
                  <FormGroup label="Value" fieldId={`config-value-${index}`}>
                    <TextInput
                      value={pair.value}
                      type="text"
                      id={`config-value-${index}`}
                      isDisabled
                    />
                  </FormGroup>
                </SplitItem>
              </Split>
            ))}
          </>
        )}
        {formValues.secret && formValues.secret.length > 0 && (
          <>
            <Split hasGutter>
              <div className="form-header">
                Secret
                <Tooltip
                  content={
                    <div>
                      This will store the secret map in key-value pairs. These values can be
                      accessed internally from the applications.
                    </div>
                  }
                >
                  <span style={{ marginLeft: '5px' }}>
                    <InfoCircleIcon style={{ color: '#6A6E73' }} />
                  </span>
                </Tooltip>
              </div>
            </Split>
            {formValues.secret.map((pair, index) => (
              <Split key={index} hasGutter>
                <SplitItem isFilled className="pf-u-mr-md pf-u-mb-lg">
                  <FormGroup label="Key" fieldId={`secret-key-${index}`}>
                    <TextInput value={pair.key} type="text" id={`secret-key-${index}`} isDisabled />
                  </FormGroup>
                </SplitItem>
                <SplitItem isFilled className="pf-u-mr-md pf-u-mb-lg">
                  <FormGroup label="Value" fieldId={`secret-value-${index}`}>
                    <TextInput
                      value={pair.value}
                      type="password"
                      id={`secret-value-${index}`}
                      isDisabled
                    />
                  </FormGroup>
                </SplitItem>
              </Split>
            ))}
          </>
        )}
        {formValues.buildArgs && formValues.buildArgs.length > 0 && (
          <>
            <Split hasGutter>
              <div className="form-header">
                Build Arguments
                <Tooltip
                  content={
                    <div>
                      This will store the build arguments in key-value pairs, which are required
                      during the build process of the application.
                    </div>
                  }
                >
                  <span style={{ marginLeft: '5px' }}>
                    <InfoCircleIcon style={{ color: '#6A6E73' }} />
                  </span>
                </Tooltip>
              </div>
            </Split>
            {formValues.buildArgs.map((pair, index) => (
              <Split key={index} hasGutter>
                <SplitItem isFilled className="pf-u-mr-md pf-u-mb-lg">
                  <FormGroup label="Key" fieldId={`buildArgs-key-${index}`}>
                    <TextInput
                      value={pair.key}
                      type="text"
                      id={`buildArgs-key-${index}`}
                      isDisabled
                    />
                  </FormGroup>
                </SplitItem>
                <SplitItem isFilled className="pf-u-mr-md pf-u-mb-lg">
                  <FormGroup label="Value" fieldId={`buildArgs-value-${index}`}>
                    <TextInput
                      value={pair.value}
                      type="text"
                      id={`buildArgs-value-${index}`}
                      isDisabled
                    />
                  </FormGroup>
                </SplitItem>
              </Split>
            ))}
          </>
        )}
        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="CPU Required" isRequired fieldId="requiredCpu">
              <TextInput
                isRequired
                value={formValues.name}
                type="text"
                id="requiredCpu"
                isDisabled
              />
            </FormGroup>
          </SplitItem>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="CPU Limit" isRequired fieldId="limitCpu">
              <TextInput isRequired value={formValues.name} type="text" id="limitCpu" isDisabled />
            </FormGroup>
          </SplitItem>
        </Split>
        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="Memory Required" isRequired fieldId="requiredMemory">
              <TextInput
                isRequired
                value={formValues.name}
                type="text"
                id="requiredMemory"
                isDisabled
              />
            </FormGroup>
          </SplitItem>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="Memory Limit" isRequired fieldId="limitCpu">
              <TextInput
                isRequired
                value={formValues.name}
                type="text"
                id="limitMemory"
                isDisabled
              />
            </FormGroup>
          </SplitItem>
        </Split>

        <Split hasGutter>
          <SplitItem isFilled style={{ width: '100%' }} className="pf-u-mr-md pf-u-mt-lg">
            <FormGroup label="Number of replicas" isRequired fieldId="replicas">
              <TextInput isRequired value={formValues.name} type="text" id="replicas" isDisabled />
            </FormGroup>
          </SplitItem>
        </Split>
      </div>

      <Button
        variant="primary"
        type="button"
        onClick={handleBack}
        style={{ margin: '10px 10px 10px 0px' }}
      >
        Back
      </Button>
      {console.log('errors', repoValidateMessage, appValidateMessage, Object.keys(errors))}
      <Button variant="primary" type="submit" isDisabled={isSubmitDisabled}>
        Submit
      </Button>
    </>
  );
};

export default ReviewSection;
