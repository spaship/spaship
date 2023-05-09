import { TableRowSkeleton } from '@app/components';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import {
  Button,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  SplitItem,
  Title
} from '@patternfly/react-core';
import { CubesIcon, ExternalLinkAltIcon, PencilAltIcon, UndoIcon } from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useRouter } from 'next/router';

const URL_LENGTH_LIMIT = 100;
const INTERNAL_ACCESS_URL_LENGTH = 25;

export const StaticDeployment = () => {
  const { query } = useRouter();

  const propertyIdentifier = query.propertyIdentifier as string;
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, '');
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);

  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;

  const url = window.location.href;
  const parts = url.split('/');
  const applicationName = parts[parts.length - 1];
  const staticDeploymentData = spaProperties?.data?.[applicationName].filter(
    (data) => data.isContainerized === false
  );

  return (
    <div>
      {!staticDeploymentData?.length ? (
        <EmptyState>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No Static Deployment exists.
          </Title>
          <EmptyStateBody>Please create an deployment to view them here</EmptyStateBody>
        </EmptyState>
      ) : (
        <TableComposable aria-label="spa-property-list">
          <Caption>SPA&apos;s DEPLOYED</Caption>
          <Thead noWrap>
            <Tr>
              <Th textCenter>SPA Name</Th>
              <Th textCenter>Environments</Th>
              <Th textCenter>Ref</Th>
              <Th textCenter>Path</Th>
              <Th textCenter>Internal Access URL</Th>
              <Th textCenter style={{ justifyContent: 'space-evenly', display: 'grid' }}>
                Actions
              </Th>
            </Tr>
          </Thead>

          {(spaProperties.isLoading && webProperties.isLoading) ||
          (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
            <TableRowSkeleton rows={3} columns={6} />
          ) : (
            <Tbody>
              {staticDeploymentData?.map((val) => (
                <Tr key={val.name}>
                  <Td textCenter>
                    {' '}
                    {`${val?.name.slice(0, URL_LENGTH_LIMIT)} ${
                      val?.name.length > URL_LENGTH_LIMIT ? '...' : ''
                    }`}
                  </Td>
                  <Td textCenter>
                    <Label
                      key={val.env}
                      color={val.isContainerized ? 'blue' : 'gold'}
                      isCompact
                      style={{ marginRight: '8px' }}
                    >
                      {val.env}
                    </Label>
                  </Td>
                  <Td textCenter>{val?.ref}</Td>
                  <Td textCenter>{val?.path}</Td>
                  <Td>
                    <a href={val?.accessUrl} target="_blank" rel="noopener noreferrer">
                      <ExternalLinkAltIcon />{' '}
                      {`${val?.accessUrl.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                        val?.accessUrl.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                      }`}
                    </a>
                  </Td>
                  <Td textCenter style={{ justifyContent: 'flex-end', display: 'grid' }}>
                    <SplitItem isFilled>
                      <Button variant="primary" isSmall icon={<PencilAltIcon />} isDisabled>
                        Configure
                      </Button>
                      &nbsp;&nbsp;
                      <Button variant="secondary" isSmall icon={<UndoIcon />} isDisabled>
                        ReDeploy
                      </Button>
                    </SplitItem>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </TableComposable>
      )}
    </div>
  );
};
