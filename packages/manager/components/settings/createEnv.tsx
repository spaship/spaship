import {
  Alert, AlertActionCloseButton, AlertGroup, AlertVariant, Button, Flex, FlexItem, Form,
  FormGroup, FormHelperText, getUniqueId, Modal,
  ModalVariant, Switch, Text,
  TextContent, TextInput, TextVariants
} from "@patternfly/react-core";
import { CheckCircleIcon, ExclamationCircleIcon, PlusIcon } from "@patternfly/react-icons";
import { useSession } from "next-auth/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { post } from "../../utils/api.utils";
import { getNextOnboardWebpropertyUrl } from "../../utils/endpoint.utils";
import { AnyProps } from "../models/props";
import { useRouter } from "next/router";
import { GlobalConstants } from "../../scripts/GlobalConstants";

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
  --pf-c-button--PaddingRight: 1.5rem;
  --pf-c-button--PaddingLeft: 1.5rem;
`;

const StyledSpan = styled.span`
  font-weight: 100;
  margin-left: 0.5rem;
`;

const CreateEnv: FunctionComponent<ApiKeyProps> = ({ webprop }: AnyProps) => {
  const router = useRouter();
  const { data: session, status: _status } = useSession();
  const [isModalOpen, setModalOpen] = useState(false);
  const [env, setEnv] = useState("");
  const [envType, setEnvType] = useState(false);
  const [validatedEnv, setValidatedEnv] = useState(validations.noval);
  const [validatedUrl, setValidatedUrl] = useState(validations.noval);
  const [helperText, setHelperText] = useState("");
  const [alert, setAlert] = useState([]);
  const [url, setUrl] = useState("");

  async function handleModalToggle() {
    setValidatedEnv(validations.noval)
    setHelperText("");
    setEnv("");
    setUrl("");
    setEnvType(false);
    setModalOpen(!isModalOpen);
  }

  async function removeAlert(key: any) {
    setAlert(alert.filter((e: any) => e.key !== key))
  }

  const handleUrl = (value: string) => {
    setUrl(value);
    const formatUrl = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,<>\/?~]/;
    if (value.match(formatUrl) || value.includes("..") || value.startsWith(".")) {
      setValidatedUrl(validations.error)
    }
    else if (value.length > 4 && value.includes(".")) {
      const domain = value.split(".");
      const minSize = 2;
      const checkDomain = (domain[domain.length - 1].length >= minSize && domain[domain.length - 2].length >= minSize);
      if (checkDomain) setValidatedUrl(validations.success)
      else setValidatedUrl(validations.noval)
    }
    else { setValidatedUrl(validations.noval) }

  };

  async function handlePropertyCreation() {
    setAlert([
      { title: `Your env is being created`, variant: 'info' },
    ] as any)
    try {
      const propUrl = getNextOnboardWebpropertyUrl();
      const prop = webprop?.propertyListResponse[0];
      const payload = {
        "propertyTitle": prop?.propertyTitle,
        "propertyName": prop?.propertyName,
        "url": url,
        "env": env,
        "deploymentConnectionType": envType,
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
        router.reload();
      }
      else {
        setAlert([
          { title: `Unable to process the request, Please try again if this problem persists, please contact admin spaship_support@redhat.com`, variant: 'danger', key: getUniqueId() },
        ] as any)
        setButtonLoading(false);
      }
    } catch (e) { }
  }

  const handleEnv = (value: string) => {
    const formatEnv = /[ `!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?~0-9]/;
    if (value.match(formatEnv)) {
      setHelperText("Invalid Environment Name")
      setValidatedEnv(validations.error)
    }
    else if (value.length > 1) {
      const keyProperty = webprop?.propertyListResponse.find((prop: any) => (prop.env === value));
      if (keyProperty) {
        setHelperText("This Env already exists")
        setValidatedEnv(validations.error);
      }
      else {
        setHelperText("Valid Env Name")
        setValidatedEnv(validations.success);
      }

    }
    else { setValidatedEnv(validations.noval) }
    setEnv(value);
  };
  const [buttonLoading, setButtonLoading] = useState(false);

  useEffect(() => { /* TODO : To be done later */ }, [isModalOpen]);


  return (
    <>
      <StyledButton
        variant="primary"
        onClick={handleModalToggle}>
        <PlusIcon />
        <StyledSpan>
          Create new environment
        </StyledSpan>
      </StyledButton>
      <Modal
        variant={ModalVariant.small}
        title="Create New Environment"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <StyledButton
            key="create"
            variant="tertiary"
            isLoading={buttonLoading}
            onClick={() => {
              handlePropertyCreation();
              setButtonLoading(true);
            }}
            isDisabled={
              buttonLoading
              ||
              validatedEnv != validations.success
              ||
              validatedUrl != validations.success}>
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
            //   helperTextInvalid="Invalid Environment Name"
            helperTextInvalid={helperText}
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
              maxLength={GlobalConstants.MAX_INPUT_LENGTH}
            />
          </FormGroup>

          <FormGroup
            label="Hostname"
            isRequired
            fieldId="form-group-label-info"
            helperText={<>
              <FormHelperText
                icon={
                  validatedUrl === validations.noval
                    ?
                    <ExclamationCircleIcon /> : <CheckCircleIcon />
                }
                isHidden={validatedUrl !== validations.noval && validatedUrl !== validations.success}>
                {validatedUrl === validations.noval ? <>Hostname shouldn't contain any space, special-character (eg: one.redhat.com) </> : <>Valid Hostname</>}
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
              maxLength={GlobalConstants.MAX_INPUT_LENGTH}
            />
          </FormGroup>

          <FormGroup
            label="Environment Type"
            fieldId="form-group-label-env-type"
            helperText={
              <FormHelperText icon={<ExclamationCircleIcon />} isHidden={false}>
                {`Env type for your property`}
              </FormHelperText>
            }
            isRequired>
            <Switch
              label="Production"
              labelOff="Pre-production"
              id="env-type"
              aria-label="prod and pre-prod env type checkbox"
              isChecked={envType}
              onChange={(status: any) => { setEnvType(status) }}
            />
          </FormGroup>
        </Form>
      </Modal>
      <AlertGroup isToast isLiveRegion aria-live="assertive" >
        {alert.map(({ title, variant, key, _action }) => (
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

