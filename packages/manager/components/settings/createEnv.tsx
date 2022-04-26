import {
  Button, Flex, FlexItem, Form,
  FormGroup, FormHelperText, Modal,
  ModalVariant, Text,
  TextContent, TextInput, TextVariants
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

const CreateEnv: FunctionComponent<ApiKeyProps> = ({ webprop }: AnyProps) => {
  const router = useRouter();
  const { data: session, status } = useSession();
  const [isModalOpen, setModalOpen] = useState(false);
  const [env, setEnv] = useState("");
  const [validatedEnv, setValidatedEnv] = useState(validations.noval);
  const [helperText, setHelperText] = useState("");

  async function handleModalToggle() {
    setModalOpen(!isModalOpen);
  }

  async function handlePropertyCreation() {
    try {
      const url = getNextOnboardWebpropertyUrl();
      const prop = webprop[0];
      const payload = {
        "propertyTitle": prop?.propertyTitle,
        "propertyName": prop?.propertyName,
        "url": prop?.url,
        "env": env,
      }
      const propertyRes = await post<AnyProps>(url, payload, (session as any).accessToken);
      if (propertyRes?.response?.id) {
        webprop.push(propertyRes?.response)
        setValidatedEnv(validations.noval)
        setHelperText("");
        setEnv("");
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
      const keyProperty = webprop.find((prop: any) => (prop.env === value));
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
              <StyledText component={TextVariants.h4}>
                You can deploy in this environment
              </StyledText>
            </FlexItem>
          </Flex>
        </FlexItem>
        <FlexItem>
          <StyledButton
            variant="tertiary"
            onClick={handleModalToggle}>
            <StyledText component={TextVariants.h4}>
              Create New Env
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
          <StyledButton key="create" variant="tertiary" onClick={handlePropertyCreation} isDisabled={validatedEnv != validations.success}>
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
              placeholder="Default Environment Name"
              value={env}
              onChange={handleEnv}
              validated={validatedEnv as any}
            />
          </FormGroup>
        </Form>


      </Modal>
    </>
  );
};

export default CreateEnv;
