import {
  Alert, 
  Button, 
  Form, 
  FormGroup, 
  FormHelperText, 
  Text, 
  TextInput, 
  TextVariants,
  AlertGroup, 
  AlertActionCloseButton, 
  AlertVariant, 
  getUniqueId, 
  Flex, 
  FlexItem,
  Switch,
} from '@patternfly/react-core';
import { CheckCircleIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { useSession } from 'next-auth/react';
import { useRouter } from "next/router";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { post } from "../../utils/api.utils";
import { getNextOnboardWebpropertyUrl } from "../../utils/endpoint.utils";
import { AnyProps } from "../models/props";

interface NewPropertyProps {
  webProp: AnyProps;
}

type ValidateType = {
  default: string;
  error: string;
  noval: string;
  success: string;
  warning: string;
  exists: string;
}

const validations: ValidateType = {
  default: 'default',
  error: 'error',
  noval: 'noval',
  success: 'success',
  warning: 'warning',
  exists: 'exists',
};

const StyledButton = styled(Button)`
  --pf-c-button--m-tertiary--BackgroundColor: var(--spaship-global--Color--text-black, #000);
  --pf-c-button--m-tertiary--Color: #fff;
  --pf-c-button--BorderRadius: none;
  --pf-c-button--PaddingRight: 3rem;
  --pf-c-button--PaddingLeft: 3rem;
  width: var(--spaship-button-width-200);
`;

const StyledText = styled(Text)`
  --pf-global--FontWeight--normal: 100;
  --pf-c-content--h2--FontWeight: 100;
`;

const DivStyle = styled.div`
  padding-bottom: 1rem;
`;

const StyledSwitch = styled(Switch)`
  margin: 0.4rem 0;
`;

const NewProperty: FunctionComponent<NewPropertyProps> = ({ webProp }: AnyProps) => {
  const router = useRouter();
  const { data: session, status: _status } = useSession();
  const [_errorMessage, setErrorMessage] = useState("");
  const [validatedEnv, setValidatedEnv] = useState(validations.noval);
  const [validatedIdentifier, setValidatedIdentifier] = useState(validations.noval);
  const [validatedTitle, setValidatedTitle] = useState(validations.noval);
  const [validatedUrl, setValidatedUrl] = useState(validations.noval);
  const [envType, setEnvType] = useState(false);

  const [identifier, setIdentifier] = useState("");
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [env, setEnv] = useState("");
  const [alert, setAlert] = useState([]);

  async function removeAlert(key: any) {
    setAlert(alert.filter((e: any) => e.key !== key))
  }

  const handleTitle = (value: string) => {
    const formatName = /[`!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~0-9]/;
    if (value.match(formatName)) {
      setValidatedTitle(validations.error)
    }
    else if (value.length > 2) {
      setValidatedTitle(validations.success)
      const checkedIdentifier = value.toLowerCase().trim().replaceAll(" ", "-");
      checkIdentifier(webProp, checkedIdentifier, setValidatedIdentifier);
      setIdentifier(checkedIdentifier);
    }
    else {
      setIdentifier("");
      setValidatedIdentifier(validations.noval)
      setValidatedTitle(validations.noval)
    }
    setTitle(value);
  };

  const handleIdentifier = (value: string) => {
    const formatName = /[ `!@#$%^&*()_+\=\[\]{};':"\\|,.<>\/?~0-9]/;
    if (value.match(formatName)) {
      setValidatedIdentifier(validations.error)
    }
    else if (value.length > 2) {
      checkIdentifier(webProp, value, setValidatedIdentifier);
    }
    else { setValidatedIdentifier(validations.noval) }
    setIdentifier(value);
  };

  const handleEnv = (value: string) => {
    const formatEnv = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;
    if (value.match(formatEnv)) {
      setValidatedEnv(validations.error)
    }
    else if (value.length > 1) { setValidatedEnv(validations.success) }
    else { setValidatedEnv(validations.noval) }
    setEnv(value);
  };

  const handleUrl = (value: string) => {
    const formatUrl = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
    if (value.match(formatUrl)) {
      setValidatedUrl(validations.error)
    }
    else if (value.length > 1) { setValidatedUrl(validations.success) }
    else { setValidatedUrl(validations.noval) }
    setUrl(value);
  };

  const handleOnClick = async () => {
    try {
      const nextUrl = getNextOnboardWebpropertyUrl();
      const payload = {
        "propertyTitle": title,
        "propertyName": identifier,
        "url": url,
        "env": env,
        "isProd": envType,
      }
      const propertyRes = await post<AnyProps>(nextUrl, payload, (session as any).accessToken);
      if (!propertyRes?.response?.id) {
        setErrorMessage(propertyRes.response)
      }
      else {
        setAlert([
          { title: `${title} Created Successfully`, variant: 'success', key: getUniqueId() },
        ] as any)
        router.push(`/properties/${identifier}`)
      }
    } catch (e) { }
  };


  return (
    <>
      <DivStyle>
        <Form>
          <FormGroup
            label="Title"
            isRequired
            fieldId="form-group-label-info"
            helperText={<>
              <FormHelperText icon={validatedTitle === "noval" ? <ExclamationCircleIcon /> : <CheckCircleIcon />} isHidden={validatedTitle !== validations.noval && validatedTitle !== validations.success}>
                {validatedTitle === "noval" ? <>Title shouldn't contain any space, numbers, special-character</> : <>Valid identifier</>}
              </FormHelperText>
            </>
            }
            helperTextInvalid="Invalid Property Title"
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            validated={validatedTitle as any}
          >
            <TextInput
              isRequired
              type="text"
              id="form-group-label-info"
              name="form-group-label-info"
              aria-describedby="form-group-label-info-helper"
              placeholder="Enter Title"
              value={title}
              onChange={handleTitle}
              validated={validatedTitle as any}
            />
          </FormGroup>

          <FormGroup
            label="Identifier"
            isRequired
            fieldId="form-group-label-info"
            helperText={<>
              <FormHelperText icon={validatedIdentifier === validations.noval ? <ExclamationCircleIcon /> : <CheckCircleIcon />} isHidden={validatedIdentifier !== validations.noval && validatedIdentifier !== validations.success && validatedIdentifier !== validations.exists}>
                {validatedIdentifier === validations.noval ? <>Unique Group Identifier </> : <>Valid Identifier</>}
              </FormHelperText>
            </>
            }
            helperTextInvalid="Invalid Identifier"
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            validated={validatedIdentifier as any}
          >
            <TextInput
              isRequired
              type="text"
              id="form-group-label-info"
              name="form-group-label-info"
              aria-describedby="form-group-label-info-helper"
              placeholder="Identifier (Auto Generated from Title)"
              value={identifier}
              onChange={handleIdentifier}
              validated={validatedIdentifier as any}
              isDisabled={true}
            />
          </FormGroup>

          <FormGroup
            label="Hostname"
            isRequired
            fieldId="form-group-label-info"
            helperText={<>
              <FormHelperText
                icon={validatedUrl === validations.noval ? <ExclamationCircleIcon /> : <CheckCircleIcon />}
                isHidden={validatedUrl !== validations.noval && validatedUrl !== validations.success}>
                {validatedUrl === validations.noval ? <> Hostname shouldn't contain any space, special-character (eg: one.redhat.com) </> : <>Valid Hostname</>}
              </FormHelperText>
            </>
            }
            helperTextInvalid="Invalid URL"
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            validated={validatedUrl as any}
          >
            <TextInput
              isRequired
              type="text"
              id="form-group-label-info"
              name="form-group-label-info"
              aria-describedby="form-group-label-info-helper"
              placeholder="Enter URL of the property"
              value={url}
              onChange={handleUrl}
              validated={validatedUrl as any}
            />
          </FormGroup>
          <Flex>
            <FlexItem>
              <FormGroup
                label="Environment Name"
                isRequired
                fieldId="form-group-label-info"
                helperText={
                  <FormHelperText icon={validatedEnv === "noval" ? <ExclamationCircleIcon /> : <CheckCircleIcon />} isHidden={validatedEnv !== validations.noval && validatedEnv !== validations.success}>
                    {validatedEnv === "noval" ? <>Env shouldn't contain any space, numbers, special-character </> : <>Valid Environment</>}
                  </FormHelperText>
                }
                helperTextInvalid="Invalid Environment Name"
                helperTextInvalidIcon={<ExclamationCircleIcon />}
                validated={validatedEnv as any}
              >
              <TextInput
                isRequired
                type="text"
                id="form-group-label-info"
                name="form-group-label-info"
                aria-describedby="form-group-label-info-helper"
                placeholder="Default Environment Name"
                value={env}
                onChange={handleEnv}
                validated={validatedEnv as any}
              />
              </FormGroup>
            </FlexItem>
            <FlexItem>
              <FormGroup
                label="Environment Type"
                fieldId="form-group-label-env-type"
                helperText={
                  <FormHelperText icon={<ExclamationCircleIcon/>} isHidden={false}>
                    {`Env type for your property`}
                  </FormHelperText>
                }
                isRequired>
              <StyledSwitch
                label="production"
                labelOff="pre-production"
                id="env-type"
                aria-label="prod and pre-prod env type checkbox"
                isChecked={envType}
                onChange={(status) => { setEnvType(status) }}
              />
              </FormGroup>
            </FlexItem>
          </Flex>
          

          <StyledButton 
          variant="tertiary" 
          onClick={handleOnClick} 
          isDisabled={
            validatedEnv != validations.success 
            || 
            validatedIdentifier != validations.success 
            || 
            validatedTitle != validations.success 
            || 
            validatedUrl != validations.success}>
            <StyledText component={TextVariants.h4}>
              Create
            </StyledText>
          </StyledButton>
          {validatedIdentifier == validations.exists &&
            <Alert variant="danger" title={'This Webproperty already exists.'} />
          }
        </Form >
        <AlertGroup isToast isLiveRegion aria-live="assertive" >
          {alert.map(({ title, variant, key }) => (
            <Alert
              variant={AlertVariant[variant]}
              title={title}
              key={key}
              timeout={1500}
              timeoutAnimation={200}
              actionClose={
                <AlertActionCloseButton
                  title={title}
                  variantLabel={`${variant} alert`}
                  onClose={() => removeAlert(key)}
                />
              } />
          ))}
        </AlertGroup>
      </DivStyle>
    </>
  );
};

export default NewProperty;

function checkIdentifier(webProp: any, value: string, setValidatedName: React.Dispatch<React.SetStateAction<string>>) {
  const keyProperty = webProp.find((prop: any) => prop.propertyName === value);
  if (keyProperty) {
    setValidatedName(validations.exists);
  }
  else
    setValidatedName(validations.success);
}
