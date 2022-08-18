import {
  Button,
  Card,
  CardTitle,
  Modal,
  ModalVariant,
  Switch,
  Text,
  TextVariants
} from "@patternfly/react-core";
import { CheckCircleIcon, ExternalLinkAltIcon, KeyIcon, LockIcon, OutlinedCalendarAltIcon, TimesCircleIcon, TrashIcon } from "@patternfly/react-icons";
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
import { getNextDeleteApiKey, getNextValidateUrl } from "../../utils/endpoint.utils";
import { AnyProps, Properties } from "../models/props";

const StyledCard = styled(Card)`
  max-width: var(--spaship-table-container-max-width);
  margin-bottom: 2rem;
`;

const StyledButton = styled(Button)`
  --pf-c-button--m-tertiary--BackgroundColor: var(--spaship-global--Color--text-#c9190b, #FFFFF);
  --pf-c-button--m-tertiary--Color: #c9190b;
  --pf-c-button--BorderColor: #c9190b;
  --pf-c-button--m-tertiary--focus--BorderColor #c9190b;
  --pf-c-button--PaddingRight: 3rem;
  --pf-c-button--PaddingLeft: 3rem;
`;

const StyledText = styled(Text)`
  --pf-global--FontWeight--normal: 100;
  --pf-c-content--h2--FontWeight: 100;
`;



const EnvList: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const router = useRouter();
  const { propertyName, propertyListResponse, apiKeyList } = webprop;
  const [isModalOpen, setModalOpen] = useState(false);
  const { data: session, status: _status } = useSession();
  const [selectedApiKey, setSelectedApiKey] = useState("");
  const [switchState, setSwitchState] = useState(true);
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
        <CardTitle>Environments</CardTitle>
        <TableComposable>
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
        <CardTitle>API Keys</CardTitle>
        <TableComposable>
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
            {apiKeyList?.map((key: any, index: any) => (
              <Tr key={index}>
                <Td dataLabel={key.label}><LockIcon /> {key.label}</Td>
                <Td dataLabel={key.shortKey}><KeyIcon /> {key.shortKey}</Td>
                <Td dataLabel={key.createdAt}><OutlinedCalendarAltIcon /> {new Date(key.createdAt).toLocaleDateString('en')}</Td>
                <Td dataLabel={key.expirationDate}><OutlinedCalendarAltIcon /> {new Date(key.expirationDate).toLocaleDateString('en')}</Td>
                <Td dataLabel={key.createdAt}>
                  {new Date(key.expirationDate) > new Date()
                    ?
                    <div>
                      <CheckCircleIcon /> Active
                    </div>
                    :
                    <div>
                      <TimesCircleIcon /> Inactive
                    </div>
                  }
                </Td>
                <Td dataLabel={key.shortKey}>
                  <StyledButton variant="tertiary"
                    onClick={() => selectApiKey(key.shortKey)}
                  >
                    <TrashIcon /> Delete
                  </StyledButton> </Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </StyledCard>
      <Modal
        variant={ModalVariant.small}
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        actions={[
          <Button key="confirm" variant="danger" onClick={deleteApiKey}>
            Confirm
          </Button>,
          <Button key="cancel" variant="plain" onClick={handleModalToggle}>
            Cancel
          </Button>
        ]}
      >
        Do you want to delete thie API Key ?
      </Modal>
    </>
  );
};

export default EnvList;
