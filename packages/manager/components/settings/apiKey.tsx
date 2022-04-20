import {
  Button, Flex, FlexItem, Form,
  FormGroup, Modal,
  ModalVariant, Popover,
  Text,
  TextContent,
  TextInput,
  TextVariants
} from "@patternfly/react-core";
import React, { FunctionComponent, useEffect, useState } from "react";
import { post } from "../../utils/api.utils";
import { getHost } from "../../utils/config.utils";
import { AnyProps } from "../models/props";
import styled from "styled-components";

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

const ApiKey: FunctionComponent<ApiKeyProps> = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [env, setEnv] = useState("");
  const [_apiKey, setApiKey] = useState("");

  async function handleModalToggle() {
    setModalOpen(!isModalOpen);
  }

  async function onClickMethod() {
    setModalOpen(!isModalOpen);

    if (isModalOpen == true) {
      try {
        const host = getHost();
        const url = `${host}/applications/validate`;
        const payload = {};
        const response = await post<AnyProps>(url, payload);
        setApiKey(response.token);
      } catch (e) { }
    }
  }

  const handleNameInputChange = (value: string) => {
    setEnv(value);
  };

  useEffect(() => {
    // TODO document why this arrow function is empty
  }, [isModalOpen]);

  const GenerateKeyModal = () => (
    <Modal
      variant={ModalVariant.small}
      title="Name API Key"
      isOpen={isModalOpen}
      onClose={handleModalToggle}
      actions={[
        <StyledButton
          key="create"
          variant="tertiary"
          onClick={onClickMethod}>
          Generate API Key
        </StyledButton>,
      ]}>
      <Form id="modal-with-form-form">
        <FormGroup
          label="Enter environment name"
          labelIcon={
            <Popover bodyContent={null}>
              <button
                type="button"
                aria-label="More info for name field"
                onClick={(e) => e.preventDefault()}
                aria-describedby="modal-with-form-form-name"
                className="pf-c-form__group-label-help"
              >
              </button>
            </Popover>}
          isRequired
          fieldId="modal-with-form-form-name">
          <TextInput
            isRequired
            type="email"
            id="modal-with-form-form-name"
            name="modal-with-form-form-name"
            value={env}
            onChange={handleNameInputChange}
          />
        </FormGroup>
      </Form>
    </Modal>
  );

  return (
  <>
    <Flex
      justifyContent={ { default: 'justifyContentSpaceBetween'} }
      alignItems={ { default: 'alignItemsCenter' } }>
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
