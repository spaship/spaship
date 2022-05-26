import {
  Card,
  CardTitle,
  Switch,
  Text,
  TextVariants
} from "@patternfly/react-core";
import { ExternalLinkAltIcon, KeyIcon, OutlinedCalendarAltIcon } from "@patternfly/react-icons";
import {
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from "@patternfly/react-table";
import React, { FunctionComponent, useState } from "react";
import styled from "styled-components";
import { AnyProps, Properties } from "../models/props";

const StyledCard = styled(Card)`
  max-width: var(--spaship-table-container-max-width);
  margin-bottom: 2rem;
`;

const EnvList: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const { propertyListResponse, apiKeyList } = webprop;
  const [switchState, setSwitchState] = useState(true);
  const handleChange = () => {
    // TODO: implement logic to toggle spa
    setSwitchState(!switchState);
  };
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
              <Th>Created By</Th>
              <Th>Expiration Date</Th>
              <Th>Short Key</Th>
            </Tr>
          </Thead>
          <Tbody>
            {apiKeyList?.map((key: any, index: any) => (
              <Tr key={index}>
                <Td dataLabel={key.createdAt}><OutlinedCalendarAltIcon /> {new Date(key.createdAt).toLocaleDateString('en')}</Td>
                <Td dataLabel={key.expirationDate}><OutlinedCalendarAltIcon /> {new Date(key.expirationDate).toLocaleDateString('en')}</Td>
                <Td dataLabel={key.shortKey}><KeyIcon /> {key.shortKey}</Td>
              </Tr>
            ))}
          </Tbody>
        </TableComposable>
      </StyledCard>
    </>
  );
};

export default EnvList;
