import { TableRowSkeleton } from '@app/components';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { Button, Label, SplitItem } from '@patternfly/react-core';
import { PencilAltIcon, UndoIcon } from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useRouter } from 'next/router';
import { EmptyInfo } from '../EmptyInfo';

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
  const temp = spaProperties?.data?.[applicationName].filter((data) => data.isSSR === false);

  return (
    <div>
      {spaProperties.isSuccess && isSpaPropertyListEmpty ? (
        <EmptyInfo propertyIdentifier={propertyIdentifier} />
      ) : (
        <TableComposable aria-label="spa-property-list">
          <Caption>SPA&apos;s DEPLOYED</Caption>
          <Thead noWrap>
            <Tr>
              <Th textCenter>SPA Name</Th>
              <Th textCenter>Environments</Th>
              <Th textCenter>Ref</Th>
              <Th textCenter>Path</Th>
              <Th textCenter style={{ justifyContent: 'space-evenly', display: 'grid' }}>
                Actions
              </Th>
            </Tr>
          </Thead>

          {(spaProperties.isLoading && webProperties.isLoading) ||
          (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
            <TableRowSkeleton rows={3} columns={4} />
          ) : (
            <Tbody>
              {temp?.map((val) => (
                <Tr key={val.name}>
                  <Td textCenter>{val?.name}</Td>
                  <Td textCenter>
                    <Label
                      key={val.env}
                      color={val.isSSR ? 'blue' : 'gold'}
                      isCompact
                      style={{ marginRight: '8px' }}
                    >
                      {val.env}
                      {val.isSSR && ' [ssr]'}
                    </Label>
                  </Td>
                  <Td textCenter>{val?.ref}</Td>
                  <Td textCenter>{val?.path}</Td>
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
