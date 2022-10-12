import React from 'react';
import { TableComposable, Thead, Tr, Th, Caption, Tbody, Td } from '@patternfly/react-table';
import {
  Bullseye,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  EmptyStateVariant,
  Title
} from '@patternfly/react-core';
import { SearchIcon } from '@patternfly/react-icons';
import { TEphemeralEnv } from '@app/services/ephemeral/types';
import { UseQueryResult } from '@tanstack/react-query';
import { useFormatDate } from '@app/hooks';

type Props = {
  ephemeralEnvs: UseQueryResult<TEphemeralEnv[], unknown>;
};

export const Ephemeral = ({ ephemeralEnvs }: Props): JSX.Element => {
  const isEnvEmpty = ephemeralEnvs.data?.length === 0;
  const formatDate = useFormatDate();
  return (
    <TableComposable aria-label="Compound expandable table">
      <Caption>Ephemeral deployments will only last for a very short time</Caption>
      <Thead>
        <Tr>
          <Th>Environment Name</Th>
          <Th>SPA name(s)</Th>
          <Th>Created</Th>
          <Th>Updated</Th>
          <Th>Time left</Th>
          <Th />
        </Tr>
      </Thead>
      {ephemeralEnvs.isSuccess && isEnvEmpty && (
        <Tbody>
          <Tr>
            <Td colSpan={5}>
              <Bullseye>
                <EmptyState variant={EmptyStateVariant.small}>
                  <EmptyStateIcon icon={SearchIcon} />
                  <Title headingLevel="h2" size="lg">
                    No results found
                  </Title>
                  <EmptyStateBody>
                    There are no active preview/ephemeral environments
                  </EmptyStateBody>
                </EmptyState>
              </Bullseye>
            </Td>
          </Tr>
        </Tbody>
      )}
      {ephemeralEnvs.isSuccess && !isEnvEmpty && (
        <Tbody>
          {ephemeralEnvs.data?.map((environment) => (
            <Tr key={environment.id}>
              <Td>{environment.env}</Td>
              <Td>{environment.spa.length}</Td>
              <Td>{formatDate(environment.createdAt, 'MMM DD, YYYY - hh:mm:ss A')}</Td>
              <Td>{formatDate(environment.updatedAt, 'MMM DD, YYYY - hh:mm:ss A')}</Td>
              <Td>{environment.expiresIn}</Td>
            </Tr>
          ))}
        </Tbody>
      )}
    </TableComposable>
  );
};
