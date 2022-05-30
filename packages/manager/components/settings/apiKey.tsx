import {
  Button,
  ClipboardCopy,
  Flex,
  FlexItem,
  Modal,
  ModalVariant,
  Text,
  TextContent,
  TextVariants,
  Alert,
  AlertGroup,
  AlertActionCloseButton,
  AlertVariant,
  getUniqueId,
  DatePicker,
} from "@patternfly/react-core";
import { useSession } from "next-auth/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { get, post } from "../../utils/api.utils";
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
  --pf-c-button--m-tertiary--BackgroundColor: var(--spaship-global--Color--text-black, #000);
  --pf-c-button--m-tertiary--Color: #fff;
  --pf-c-button--BorderRadius: none;
  --pf-c-button--PaddingRight: 3rem;
  --pf-c-button--PaddingLeft: 3rem;
`;

const StyledFlexItem = styled(FlexItem)`
  --pf-l-flex--spacer: 0;
`;

const StyledText = styled(Text)`
  --pf-global--FontWeight--normal: 100;
  --pf-c-content--h2--FontWeight: 100;
`;

const StyledClipboardBox = styled.div({
  width: "500px",
  height: "40px",
  marginTop: "20px"
});

const StyledSubText = styled(Text)`
  --pf-global--FontWeight--normal: 100;
  --pf-c-content--h2--FontWeight: 100;
  color: var(--pf-global--Color--200);
`;

const ApiKey: FunctionComponent<ApiKeyProps> = ({ webprop }: AnyProps) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [_apiKey, setApiKey] = useState("");
  const [alert, setAlert] = useState([]);
  const [validatedDateTime, setValidatedDateTime] = useState(validations.noval);
  const [expiresIn, setExpiresIn] = useState("");

  async function removeAlert(key: any) {
    setAlert(alert.filter((e: any) => e.key !== key))
  }
  async function handleModalToggle() {
    setModalOpen(!isModalOpen);
    setValidatedDateTime(validations.noval);
    setExpiresIn("");
    setApiKey("");
  }
  async function handleExpiresIn(date: any) {
    var dateChecks = /^\d{4}-\d{2}-\d{2}$/;
    if (date.match(dateChecks) != null && new Date(date) > new Date()) {
      setValidatedDateTime(validations.success);
      setExpiresIn(date);
    }
    else {
      setValidatedDateTime(validations.noval);
    }
  }
  const { data: session, status } = useSession();

  const rangeValidator = (date: Date) => {
    const minDate = new Date();
    if (date < minDate) {
      return 'Date is before the allowable range.';
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

  return (
    <>
      <Flex justifyContent={{ default: "justifyContentSpaceBetween" }} alignItems={{ default: "alignItemsCenter" }}>
        <FlexItem>
          <Flex direction={{ default: "column" }}>
            <StyledFlexItem>
              <TextContent>
                <StyledText component={TextVariants.h2}>Generate API Key</StyledText>
              </TextContent>
            </StyledFlexItem>
            <FlexItem>
              <StyledSubText component={TextVariants.h4}>Please provide expiration date.</StyledSubText>
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <StyledButton variant="tertiary" onClick={handleModalToggle}>
            <StyledText component={TextVariants.h4}>Create API key</StyledText>
          </StyledButton>
        </FlexItem>
      </Flex>
      <Modal
        variant={ModalVariant.small}
        title="API Key"
        description="Please save this API Key"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
        ]}
      >
        <DatePicker
          validators={[rangeValidator]}
          onChange={(str, date) => handleExpiresIn(str)}
        />
        <StyledButton key="create" variant="tertiary" onClick={handlePropertyCreation} isDisabled={validatedDateTime != validations.success}>
          Create
        </StyledButton>
        <StyledClipboardBox>
          <ClipboardCopy hoverTip="Copy" clickTip="Copied" isReadOnly={true}>
            {_apiKey}
          </ClipboardCopy>
        </StyledClipboardBox>
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

export default ApiKey;
