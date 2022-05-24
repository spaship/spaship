import {
  Button, Flex, FlexItem, Form,
  FormGroup, FormHelperText, Modal,
  ModalVariant, Text,
  TextContent, TextInput, TextVariants,
  Alert, AlertGroup, AlertActionCloseButton, AlertVariant, getUniqueId,
} from "@patternfly/react-core";
import { CheckCircleIcon, ExclamationCircleIcon } from "@patternfly/react-icons";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { post } from "../../utils/api.utils";
import { getNextOnboardWebpropertyUrl } from "../../utils/endpoint.utils";
import { AnyProps } from "../models/props";

interface ApiKeyProps {
  webprop: AnyProps;
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
  --pf-c-button--PaddingRight: 2.4rem;
  --pf-c-button--PaddingLeft: 2.4rem;
`;

const StyledFlexItem = styled(FlexItem)`
  --pf-l-flex--spacer: 0;
`;

const StyledText = styled(Text)`
  --pf-global--FontWeight--normal: 100;
  --pf-c-content--h2--FontWeight: 100;
`;

const StyledSubText = styled(Text)`
  --pf-global--FontWeight--normal: 100;
  --pf-c-content--h2--FontWeight: 100;
  color: var(--pf-global--Color--200);
`;

const StyledSpan = styled.span`
  margin-left: 0.25rem;
`;

const CreateEnv: FunctionComponent<ApiKeyProps> = ({ webprop }: AnyProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isModalOpen, setModalOpen] = useState(false);
  const [env, setEnv] = useState("");
  const [validatedEnv, setValidatedEnv] = useState(validations.noval);
  const [validatedUrl, setValidatedUrl] = useState(validations.noval);
  const [helperText, setHelperText] = useState("");
  const [alert, setAlert] = useState([]);
  const [url, setUrl] = useState("");

  async function handleModalToggle() {
    setModalOpen(!isModalOpen);
  }

  async function removeAlert(key: any) {
    setAlert(alert.filter((e: any) => e.key !== key))
  }

  const handleUrl = (value: string) => {
    const formatUrl = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
    if (value.match(formatUrl)) {
      setValidatedUrl(validations.error)
    }
    else if (value.length > 1) { setValidatedUrl(validations.success) }
    else { setValidatedUrl(validations.noval) }
    setUrl(value);
  };


  async function handlePropertyCreation() {
    try {
      const propUrl = getNextOnboardWebpropertyUrl();
      const prop = webprop?.propertyListResponse[0];
      const payload = {
        "propertyTitle": prop?.propertyTitle,
        "propertyName": prop?.propertyName,
        "url": url,
        "env": env,
      }
      const propertyRes = await post<AnyProps>(propUrl, payload, (session as any).accessToken);
      if (propertyRes?.response?.id) {
        setAlert([
          { title: `"${env}" env  added for ${prop?.propertyTitle}`, variant: 'success', key: getUniqueId() },
        ] as any)
        webprop.propertyListResponse.push(propertyRes?.response)
        setValidatedEnv(validations.noval)
        setHelperText("");
        setEnv("");
        setUrl("");
        setModalOpen(!isModalOpen);
      }
    } catch (e) { }
  }

  const handleEnv = (value: string) => {
    const formatEnv = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;
    if (value.match(formatEnv)) {
      setValidatedEnv(validations.error)
    }
    else if (value.length > 1) {
      const keyProperty = webprop?.propertyListResponse.find((prop: any) => (prop.env === value));
      if (keyProperty) {
        setHelperText("This Env already exists")
        setValidatedEnv(validations.exists);
      }
      else {
        setHelperText("Valid Env Name")
        setValidatedEnv(validations.success);
      }

    }
    else { setValidatedEnv(validations.noval) }
    setEnv(value);
  };

  useEffect(() => {
  }, [isModalOpen]);

  return (
    <>
      <Flex
        justifyContent={{ default: 'justifyContentSpaceBetween' }}
        alignItems={{ default: 'alignItemsCenter' }}>
        <FlexItem>
          <Flex
            direction={{ default: 'column' }}>
            <StyledFlexItem>
              <TextContent>
                <StyledText component={TextVariants.h2}>
                  Add new Environment
                </StyledText>
              </TextContent>
            </StyledFlexItem>
            <FlexItem>
              <StyledSubText component={TextVariants.h4}>
                Create new environment for property :
                <StyledSpan>
                  {webprop?.propertyListResponse[0]?.propertyName.length > 15
                    ? `${webprop?.propertyListResponse[0]?.propertyName.substring(0, 15)}...`
                    : webprop?.propertyListResponse[0]?.propertyName}
                </StyledSpan>
              </StyledSubText>
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <StyledButton
            variant="tertiary"
            onClick={handleModalToggle}>
            <StyledText component={TextVariants.h4}>
              Add Environment
            </StyledText>
          </StyledButton>
        </FlexItem>
      </Flex>
      <Modal
        variant={ModalVariant.small}
        title="Create New Environment"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <StyledButton key="create" variant="tertiary" onClick={handlePropertyCreation} isDisabled={validatedEnv != validations.success || validatedUrl != validations.success}>
            Create
          </StyledButton>
        ]}
      >
        <Form id="modal-with-form-form">
          <FormGroup
            label="Environment Name"
            isRequired
            fieldId="form-group-label-info"
            helperText={
              <FormHelperText icon={validatedEnv === validations.noval ? <ExclamationCircleIcon /> : validatedEnv === validations.exists ? <ExclamationCircleIcon /> : <CheckCircleIcon />}
                isHidden={validatedEnv !== validations.noval && validatedEnv !== validations.success && validatedEnv !== validations.exists}>
                {validatedEnv === "noval" ? <>Env should'nt contain any space, numbers, special-character </> : <>{helperText}</>}
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
              placeholder="Enter Environment Name"
              value={env}
              onChange={handleEnv}
              validated={validatedEnv as any}
            />
          </FormGroup>

          <FormGroup
            label="Hostname"
            isRequired
            fieldId="form-group-label-info"
            helperText={<>
              <FormHelperText icon={validatedUrl === validations.noval ? <ExclamationCircleIcon /> : <CheckCircleIcon />} isHidden={validatedUrl !== validations.noval && validatedUrl !== validations.success}>
                {validatedUrl === validations.noval ? <>Hostname shouldn't contain any space, special-character (. allowed) </> : <>Valid Hostname</>}
              </FormHelperText>
            </>
            }
            helperTextInvalid="Invalid Hostname"
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            validated={validatedUrl as any}
          >
            <TextInput
              isRequired
              type="text"
              id="form-group-label-info"
              name="form-group-label-info"
              aria-describedby="form-group-label-info-helper"
              placeholder="Enter Hostname"
              value={url}
              onChange={handleUrl}
              validated={validatedUrl as any}
            />
          </FormGroup>
        </Form>
      </Modal>
      <AlertGroup isToast isLiveRegion aria-live="assertive" >
        {alert.map(({ title, variant, key, action }) => (
          <Alert
            variant={AlertVariant[variant]}
            title={title}
            key={key}
            timeout={webprop.spashipNotificationTimeout}
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
    </>
  );
};

export default CreateEnv;
