import { useGetWebProperties } from '@app/services/webProperty';
import { TWebProperty } from '@app/services/webProperty/types';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  SplitItem,
  Text
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useSession } from 'next-auth/react';

type TpropertyItem = {
  title: string;
  createdBy: string;
};
export const WebpropertiesTable = (): JSX.Element => {
  const { data: session } = useSession();
  const webProperties = useGetWebProperties();
  const filteredWebProperties = (webProperties?.data as [])?.filter(
    ({ createdBy }: TWebProperty) => createdBy === session?.user?.email
  );

  return (
    <Card className="pf-u-m-md " style={{ height: '97%' }}>
      <CardHeader>
        <SplitItem isFilled>
          <p className="text-xl"> My web properties</p>
        </SplitItem>

        <SplitItem>
          {' '}
          <Button variant="primary">Add Web Property</Button>
        </SplitItem>
      </CardHeader>
      <CardBody>
        {' '}
        <Table aria-label="Sortable table" ouiaId="SortableTable" isStriped>
          <Thead>
            <Tr>
              <Th>Name</Th>
              <Th modifier="wrap">Owner</Th>

              <Th modifier="wrap">Hosted Application</Th>
              <Th modifier="wrap">Total Deployment</Th>
            </Tr>
          </Thead>
          {filteredWebProperties?.length === 0 ? (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />

              <EmptyStateBody>
                <Text className="text-xl">No web properties found.</Text>
                To get started add web property.
              </EmptyStateBody>
            </EmptyState>
          ) : (
            <Tbody>
              {filteredWebProperties?.map((item: TpropertyItem, rowIndex) => (
                // eslint-disable-next-line react/no-array-index-key
                <Tr key={rowIndex}>
                  <Td>{item.title}</Td>
                  <Td>{item.createdBy}</Td>
                  <Td>{/* TODO: Develop APS to fetch deployment count */}</Td>
                  <Td>{/* TODO: Develop APS to fetch number of SPAs */}</Td>
                </Tr>
              ))}
            </Tbody>
          )}
        </Table>
      </CardBody>
    </Card>
  );
};
