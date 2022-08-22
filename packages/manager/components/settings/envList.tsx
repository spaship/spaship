import {
  Button,
  Card,
  CardTitle,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Flex,
  FlexItem,
  Label,
  Modal,
  ModalVariant,
  Text,
  TextVariants,
  Title
} from "@patternfly/react-core";
import { 
  CheckCircleIcon, 
  CubesIcon, 
  ExternalLinkAltIcon, 
  KeyIcon, 
  LockIcon, 
  OutlinedCalendarAltIcon, 
  TimesCircleIcon, 
  TrashIcon 
} from "@patternfly/react-icons";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@patternfly/react-table";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { post } from "../../utils/api.utils";
import { getNextDeleteApiKey } from "../../utils/endpoint.utils";
import { AnyProps, Properties } from "../models/props";
import ApiKey from "./apiKey";
import CreateEnv from "./createEnv";

const StyledCard = styled(Card)`
  margin-bottom: 2rem;
`;

const StyledButton = styled(Button)`
  > span {
    margin-left: .5rem;
  }
`;

const EnvList: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const router = useRouter();
  const { propertyName, propertyListResponse, apiKeyList } = webprop;
  const [isModalOpen, setModalOpen] = useState(false);
  const { data: session, status: _status } = useSession();
  const [selectedApiKey, setSelectedApiKey] = useState("");
  const [switchState, setSwitchState] = useState(true);
  const [isButtonLoading, setButtonLoading] = useState(false);
  const handleChange = () => {
    // TODO: implement logic to toggle spa
    setSwitchState(!switchState);
  };

  async function handleModalToggle() {
    setSelectedApiKey("");
    setModalOpen(!isModalOpen);
  }

  async function selectApiKey(apikey: string) {
    setSelectedApiKey(apikey);
    setModalOpen(!isModalOpen);
  }

  async function deleteApiKey() {
    try {
      const propUrl = getNextDeleteApiKey();
      const payload = {
        propertyName: propertyName,
        shortKey: selectedApiKey
      }
      const response = await post<AnyProps>(propUrl, payload, (session as any).accessToken);
      router.reload();
    } catch (e) { }
    setModalOpen(!isModalOpen);
  }

  return (
    <>
      <StyledCard>
        <CardTitle>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              Environments
            </FlexItem>
            <FlexItem>
              <CreateEnv webprop={webprop} />
            </FlexItem>
          </Flex>
        </CardTitle>
        <TableComposable isStriped>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th>Created</Th>
              <Th>Publish Domain</Th>
              <Th>Deploy URL</Th>
              {/* TODO: Add once feature is available <Th>Action</Th> */}
            </Tr>
          </Thead>
          <Tbody>
          <Tr>
            <Td colSpan={4}>
              {
                !propertyListResponse &&
                  <EmptyState>
                    <EmptyStateIcon icon={CubesIcon} />
                    <Title headingLevel="h4" size="lg">
                      Environments not created yet
                    </Title>
                    <EmptyStateBody>
                      Please create an environments to see them here.
                    </EmptyStateBody>
                  </EmptyState>
                }
              </Td>
            </Tr>
            {propertyListResponse?.map((env: AnyProps) => (
              <Tr key={env.id}>
                <Td dataLabel={env.env}>{env.env}</Td>
                <Td dataLabel={env.createdAt}>
                  <Text component={TextVariants.small}>
                    {new Date(env.createdAt).toUTCString().substr(0, 25)}
                  </Text>
                </Td>
                <Td>
                  <a href={`https://${env.url}`} target="_blank" rel="noopener noreferrer"> <ExternalLinkAltIcon /> {env.url}</a>
                </Td>
                <Td>
                  {window.location.origin}/api/v1/applications/deploy/{env?.propertyName}/{env?.env}
                </Td>
                {/* TODO: Add once feature is available
                <Td dataLabel={env.env}>
                  <Switch
                    id={env.env}
                    aria-label="spaship-switch-area"
                    isChecked={switchState}
                    onChange={handleChange}
                    isDisabled
                  />
                </Td> */}
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </StyledCard>
      <StyledCard>
        <CardTitle>
          <Flex justifyContent={{ default: 'justifyContentSpaceBetween' }}>
            <FlexItem>
              API Keys
            </FlexItem>
            <FlexItem>
              <ApiKey webprop={webprop} />
            </FlexItem>
          </Flex>
        </CardTitle>
        <TableComposable isStriped>
          <Thead>
            <Tr>
              <Th>Label</Th>
              <Th>Short Key</Th>
              <Th>Created On</Th>
              <Th>Expiration Date</Th>
              <Th>Status</Th>
              <Th>Delete</Th>
            </Tr>
          </Thead>
          <Tbody>
            <Tr>
              <Td colSpan={6}>
              {
                !apiKeyList &&
                  <EmptyState>
                    <EmptyStateIcon icon={CubesIcon} />
                    <Title headingLevel="h4" size="lg">
                      API Keys not found.
                    </Title>
                    <EmptyStateBody>
                      Please create an API keys to see them here.
                    </EmptyStateBody>
                  </EmptyState>
                }
              </Td>
            </Tr>
            {apiKeyList?.map((key: any, index: any) => (
              <Tr key={index}>
                <Td dataLabel={key.label}><LockIcon /> {key.label}</Td>
                <Td dataLabel={key.shortKey}><KeyIcon /> {key.shortKey}</Td>
                <Td dataLabel={key.createdAt}><OutlinedCalendarAltIcon /> {new Date(key.createdAt).toLocaleDateString('en')}</Td>
                <Td dataLabel={key.expirationDate}><OutlinedCalendarAltIcon /> {new Date(key.expirationDate).toLocaleDateString('en')}</Td>
                <Td dataLabel={key.createdAt}>
                  {new Date(key.expirationDate) > new Date()
                    ?
                    <Label icon={<CheckCircleIcon />} color="green">
                      Active
                    </Label>
                    :
                    <Label color="red" icon={<TimesCircleIcon />}>
                      Inactive
                    </Label>
                  }
                </Td>
                <Td dataLabel={key.shortKey}>
                  <StyledButton
                    variant="secondary"
                    isDanger
                    onClick={() => selectApiKey(key.shortKey)}
                  >
                    <TrashIcon /><span>Delete</span>
                  </StyledButton> </Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </StyledCard>
      <Modal
        aria-label="Delete API Key"
        variant={ModalVariant.small}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button 
            key="confirm" 
            variant="secondary"
            isDanger
            isLoading={isButtonLoading}
            isDisabled={isButtonLoading}
            onClick={
              () => {
                deleteApiKey();
                setButtonLoading(true);
              }
          }>
            Confirm
          </Button>,
          <Button key="cancel" variant="plain" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        Do you want to delete this API Key ?
      </Modal>
    </>
  );
};

export default EnvList;
