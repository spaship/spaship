import {
  Alert, 
  AlertActionCloseButton, 
  AlertGroup, 
  AlertVariant, 
  Button,
  Checkbox, 
  ClipboardCopy,
  DatePicker, 
  Flex,
  FlexItem, 
  FormGroup, 
  getUniqueId, 
  Modal,
  ModalVariant, 
  Text,
  TextInput, 
  TextVariants
} from "@patternfly/react-core";
import { ExclamationCircleIcon, PlusIcon } from "@patternfly/react-icons";
import { useSession } from "next-auth/react";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { post } from "../../utils/api.utils";
import { getNextValidateUrl } from "../../utils/endpoint.utils";
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
  --pf-c-button--PaddingRight: 2rem;
  --pf-c-button--PaddingLeft: 2rem;
`;

const StyledFlexItem = styled(FlexItem)`
  --pf-l-flex--spacer: 0;
`;

const StyledSpan = styled.span`
  font-weight: 100;
  margin-left: 0.5rem;
`;

const StyledInput = styled.div({
  marginBottom: "10px"
});

const StyledClipboardBox = styled.div({
  width: "500px",
  height: "40px",
  marginTop: "20px"
});

const ApiKey: FunctionComponent<ApiKeyProps> = ({ webprop }: AnyProps) => {
  const environments = webprop?.propertyListResponse;
  const [selectedEnvironments, setSelectedEnvironments] = useState([] as string[]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [expiresIn, setExpiresIn] = useState("");
  const [_apiKey, setApiKey] = useState("");
  const [alert, setAlert] = useState([]);
  const [validatedDateTime, setValidatedDateTime] = useState(validations.noval);
  const [validatedEnv, setValidatedEnv] = useState(validations.noval);
  const { data: session, status } = useSession();
  const [buttonLoading, setButtonLoading] = useState(false);
  const [label, setLabel] = useState("");
  const [validatedLabel, setValidatedLabel] = useState(validations.noval);

  async function removeAlert(key: any) {
    setAlert(alert.filter((e: any) => e.key !== key))
  }

  async function handleModalToggle() {
    setModalOpen(!isModalOpen);
    setValidatedDateTime(validations.noval);
    setValidatedEnv(validations.noval);
    setValidatedLabel(validations.noval);
    setSelectedEnvironments([]);
    setLabel("");
    setExpiresIn("");
    setApiKey("");
  }

  const handleLabel = (value: string) => {
    const formatLabel = /[ `!@#$%^&*()+\=\[\]{};':"\\|,<>\/?~]/;
    const lengthLimit = 35;
    value = value.trim();
    value = value.length > lengthLimit ? `${value.substring(0, lengthLimit)}` : value;
    if (value.match(formatLabel)) {
      setValidatedLabel(validations.error)
      setLabel(value);
    }
    else if (value == "") {
      setValidatedLabel(validations.noval);
      setLabel(value);
    }
    else {
      setValidatedLabel(validations.success);
      setLabel(value);
    }
  };

  async function handleExpiresIn(date: any) {
    var dateChecks = /^\d{4}-\d{2}-\d{2}$/;
    const reqDate = new Date(date);
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365);
    if (date.match(dateChecks) != null && reqDate > minDate && reqDate < maxDate) {
      setValidatedDateTime(validations.success);
      setExpiresIn(date);
    }
    else {
      setValidatedDateTime(validations.noval);
    }
  }

  async function onChangeEnvironments(checked: boolean, event: any) {
    const envName: string = event.currentTarget.name;
    const envList = selectedEnvironments.filter((env) => env !== envName);
    const minEnv = 1;
    setSelectedEnvironments(envList);
    if (!checked) {
      if (selectedEnvironments.length == minEnv) {
        setValidatedEnv(validations.noval);
        setValidatedLabel(validations.noval);
        setLabel("");
        return;
      }
      const label = `spaship-${envList.join('-')}`
      setValidatedLabel(validations.success);
      setLabel(label);
    } else {
      setSelectedEnvironments([...selectedEnvironments, envName]);
      setValidatedEnv(validations.success);

      let label;
      if (selectedEnvironments.length == 0) {
        label = `spaship-${envName}`
      }
      else {
        label = `spaship-${selectedEnvironments.join('-')}-${envName}`
      }
      setValidatedLabel(validations.success);
      setLabel(label);
    }
  };

  const rangeValidator = (date: Date) => {
    const minDate = new Date();
    const maxDate = new Date();
    maxDate.setDate(maxDate.getDate() + 365);
    if (date < minDate) {
      return 'Invalid date.';
    }
    if (date > maxDate) {
      return 'Date is not in the allowable range.';
    }
    return '';
  };

  async function handlePropertyCreation() {
    try {
      if (isModalOpen == true) {
        try {
          const url = getNextValidateUrl();
          const payload = {
            expiresIn: expiresIn,
            propertyName: webprop.propertyName,
            env: selectedEnvironments,
            label: label || 'default',
          }
          const response = await post<AnyProps>(url, payload, (session as any).accessToken);
          setAlert([
            { title: `API Key Generated Successfully`, variant: 'success', key: getUniqueId() },
          ] as any)
          setApiKey(response.token);
        } catch (e) { console.error(e); }
      }
    } catch (e) { console.error(e); }
  }

  const renderEnvironments = () => {
    return (<>
      {environments.map((data: { env: string }) => (
        <Checkbox
          key={`env-${data.env}`}
          label={data.env}
          id={`env-${data.env}`}
          name={data.env}
          onChange={onChangeEnvironments}
          isChecked={!!selectedEnvironments.find((selected) => selected === data.env)}
        />
      ))}
    </>);
  }

  return (
    <>
      <StyledButton 
        variant="primary" 
        onClick={handleModalToggle}>
        <PlusIcon />
        <StyledSpan>Create new API key</StyledSpan>
      </StyledButton>
      <Modal
        variant={ModalVariant.small}
        title="API Key"
        description="Please save this API Key. You won’t be able to see it again!"
        isOpen={isModalOpen}
        onClose={() => {
          setButtonLoading(false);
          handleModalToggle();
        }}
        actions={[
        ]}
      >
        <StyledInput>
          <FormGroup
            isRequired
            fieldId="form-group-label-info"
            helperTextInvalid=" Invalid Label (only - . _ allowed)"
            helperTextInvalidIcon={<ExclamationCircleIcon />}
            validated={validatedLabel as any}
          >
            <TextInput
              isRequired
              type="text"
              id="form-group-label-info"
              name="form-group-label-info"
              aria-describedby="form-group-label-info-helper"
              placeholder="Add a Label"
              value={label}
              onChange={handleLabel}
              validated={validatedLabel as any}
            />
          </FormGroup>
        </StyledInput>
        <StyledInput>
          <Flex justifyContent={{ default: "justifyContentFlexStart" }} alignItems={{ default: "alignItemsCenter" }}>
            <FlexItem>
              <StyledFlexItem>
                <DatePicker
                  validators={[rangeValidator]}
                  onChange={(str, date) => handleExpiresIn(str)}
                  appendTo={() => document.body}
                />
              </StyledFlexItem>
            </FlexItem>
            <FlexItem>
              <StyledFlexItem>
                <StyledButton
                  key="create"
                  variant="tertiary"
                  onClick={() => {
                    handlePropertyCreation();
                    setButtonLoading(true);
                  }}
                  isDisabled={
                    (validatedDateTime != validations.success || validatedEnv != validations.success)
                    ||
                    buttonLoading
                  }>
                  Create
                </StyledButton>
              </StyledFlexItem>
            </FlexItem>
          </Flex>
        </StyledInput>
        <>{renderEnvironments()}</>
        <StyledClipboardBox>
          <ClipboardCopy hoverTip="Copy" clickTip="Copied" isReadOnly={true}>
            {_apiKey}
          </ClipboardCopy>
        </StyledClipboardBox>
      </Modal >
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
                onClose={
                  () => {
                    removeAlert(key);
                  }
                }
              />
            } />
        ))}
      </AlertGroup>
    </>
  );
};

export default ApiKey;
