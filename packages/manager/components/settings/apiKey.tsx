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
} from "@patternfly/react-core";
import { useSession } from "next-auth/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { get } from "../../utils/api.utils";
import { getNextValidateUrl } from "../../utils/endpoint.utils";
import { AnyProps } from "../models/props";

interface ApiKeyProps {
  webprop: AnyProps;
}
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

  async function removeAlert(key: any) {
    setAlert(alert.filter((e: any) => e.key !== key))
  }
  async function handleModalToggle() {
    setModalOpen(!isModalOpen);
  }
  const { data: session, status } = useSession();

  useEffect(() => {
    (async () => {
      if (isModalOpen == true) {
        try {
          if (status != "loading") {
            const url = getNextValidateUrl();
            const response = await get<AnyProps>(url, (session as any).accessToken);
            setAlert([
              { title: `API Key Generated Successfully`, variant: 'success', key: getUniqueId() },
            ] as any)
            setApiKey(response.token);
          }
        } catch (e) {
          console.error(e);
        }
      }
    })();
  }, [isModalOpen, session, status]);

  const GenerateKeyModal = () => (
    <Modal
      variant={ModalVariant.small}
      title="API Key"
      description="Please save this API Key"
      isOpen={isModalOpen}
      onClose={handleModalToggle}
    >
      <StyledClipboardBox>
        <ClipboardCopy hoverTip="Copy" clickTip="Copied" isReadOnly={true}>
          {_apiKey}
        </ClipboardCopy>
      </StyledClipboardBox>
    </Modal>
  );

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
              <StyledSubText component={TextVariants.h4}>This key would be valid for 5 hours only.</StyledSubText>
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <StyledButton variant="tertiary" onClick={handleModalToggle}>
            <StyledText component={TextVariants.h4}>Create API key</StyledText>
          </StyledButton>
        </FlexItem>
      </Flex>
      <GenerateKeyModal />
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
