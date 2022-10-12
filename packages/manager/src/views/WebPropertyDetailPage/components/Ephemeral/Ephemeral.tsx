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

export const Ephemeral: React.FunctionComponent = () => (
  <TableComposable aria-label="Compound expandable table">
    <Caption>Ephemeral deployments will only last for a very short time</Caption>
    <Thead>
      <Tr>
        <Th>Environment Name</Th>
        <Th>SPA name(s)</Th>
        <Th>Ref</Th>
        <Th>Internal Access URL</Th>
        <Th>Time left</Th>
        <Th />
      </Tr>
    </Thead>
    {true && (
      <Tbody>
        <Tr>
          <Td colSpan={5}>
            <Bullseye>
              <EmptyState variant={EmptyStateVariant.small}>
                <EmptyStateIcon icon={SearchIcon} />
                <Title headingLevel="h2" size="lg">
                  No results found
                </Title>
                <EmptyStateBody>There are no active preview/ephemeral environments</EmptyStateBody>
              </EmptyState>
            </Bullseye>
          </Td>
        </Tr>
      </Tbody>
    )}
  </TableComposable>
);
