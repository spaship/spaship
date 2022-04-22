import {
  Button, ClipboardCopy, Flex, FlexItem, Modal,
  ModalVariant, Text,
  TextContent, TextVariants
} from "@patternfly/react-core";
import { useSession } from "next-auth/react";
import React, { FunctionComponent, useEffect, useState } from "react";
import styled from "styled-components";
import { get } from "../../utils/api.utils";
import { getNextValidateUrl } from "../../utils/endpoint.utils";
import { AnyProps } from "../models/props";

interface ApiKeyProps { }

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

const ApiKey: FunctionComponent<ApiKeyProps> = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [_apiKey, setApiKey] = useState("");

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
            setApiKey(response.token);
          }
        } catch (e) { 
          console.error(e);
        }
      }
    })()
  }, [isModalOpen]);

  const GenerateKeyModal = () => (
    <Modal
      variant={ModalVariant.small}
      title="API Key"
      description="Please save this API Key"
      isOpen={isModalOpen}
      onClose={handleModalToggle}
    >
      <StyledClipboardBox>
        <ClipboardCopy hoverTip="Copy" clickTip="Copied" isReadOnly={true} >
          {_apiKey}
        </ClipboardCopy>
      </StyledClipboardBox>
    </Modal>
  );

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
                  Generate API Key
                </StyledText>
              </TextContent>
            </StyledFlexItem>
            <FlexItem>
              <StyledText component={TextVariants.h4}>
                This key would be valid for 5 hours only.
              </StyledText>
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <StyledButton
            variant="tertiary"
            onClick={handleModalToggle}>
            <StyledText component={TextVariants.h4}>
              Create API key
            </StyledText>
          </StyledButton>
        </FlexItem>
      </Flex>
      <GenerateKeyModal />
    </>
  );
};

export default ApiKey;
