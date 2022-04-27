import {
  Button,
  Flex,
  FlexItem,
  Form,
  FormGroup,
  Modal,
  ModalVariant,
  Popover,
  Text,
  TextContent,
  TextInput,
  TextVariants,
} from "@patternfly/react-core";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";

const StyledButton = styled(Button)`
  --pf-c-button--BorderRadius: none;
  --pf-c-button--PaddingRight: 1.5rem;
  --pf-c-button--PaddingLeft: 1.5rem;
`;

const StyledFlexItem = styled(FlexItem)`
  --pf-l-flex--spacer: 0;
`;

const StyledText = styled(Text)`
  --pf-global--FontWeight--normal: 100;
  --pf-c-content--h2--FontWeight: 100;
`;

const StyledDangerText = styled(StyledText)`
  color: var(--spaship-global--Color--text-danger, #cc0000);
`;

interface DeleteSpaProps {}

const DeleteSpa: FunctionComponent<DeleteSpaProps> = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [env, setEnv] = useState("");
  const handleModalToggle = async () => {
    setModalOpen(!isModalOpen);
  };
  const onClickMethod = async () => {
    setModalOpen(!isModalOpen);
  };
  const handleNameInputChange = (value: string) => {
    setEnv(value);
  };
  const DeleteWebPropModal = () => (
    <Modal
      variant={ModalVariant.small}
      title="Are Your Sure ? "
      description="You are deleting this Web Property from SPAship. This operation will delete all data permanenetly."
      isOpen={isModalOpen}
      titleIconVariant="danger"
      onClose={handleModalToggle}
      actions={[
        <Button key="create" variant="danger" onClick={onClickMethod}>
          Yes, Delete
        </Button>,
        <Button key="cancel" variant="link" onClick={handleModalToggle}>
          Cancel
        </Button>,
      ]}
    >
      <Form id="modal-with-form-form">
        <FormGroup
          labelIcon={
            <Popover bodyContent={null}>
              <Button
                type="button"
                onClick={(e) => e.preventDefault()}
                aria-describedby="modal-with-form-form-name"
                className="pf-c-form__group-label-help"
              ></Button>
            </Popover>
          }
          isRequired
          fieldId="modal-with-form-form-name"
        >
          <TextInput
            isRequired
            placeholder="Enter web property name"
            type="text"
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
      <Flex justifyContent={{ default: "justifyContentSpaceBetween" }} alignItems={{ default: "alignItemsCenter" }}>
        <FlexItem>
          <Flex direction={{ default: "column" }}>
            <StyledFlexItem>
              <TextContent>
                <StyledDangerText component={TextVariants.h2}>Delete Web Property</StyledDangerText>
              </TextContent>
            </StyledFlexItem>
            <FlexItem>
              <StyledDangerText component={TextVariants.h4}>
                This action would completely remove the web property from SPAship.
              </StyledDangerText>
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <StyledButton isDisabled variant="danger" onClick={handleModalToggle}>
            <StyledText component={TextVariants.h4}>Delete Web Property</StyledText>
          </StyledButton>
        </FlexItem>
      </Flex>
      <DeleteWebPropModal />
    </>
  );
};

export default DeleteSpa;
