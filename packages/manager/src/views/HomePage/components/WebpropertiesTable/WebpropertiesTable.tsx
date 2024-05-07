import { useDebounce } from '@app/hooks';
import { userGetUserWebProperties } from '@app/services/analytics';
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
  SearchInput,
  Spinner,
  SplitItem,
  Text
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useSession } from 'next-auth/react';
import { useState } from 'react';

type TpropertyItem = {
  applicationCount: string;
  deploymentCount: string;
  identifiers: string;
  propertyIdentifier: string;
};
export const WebpropertiesTable = (): JSX.Element => {
  const { data: session } = useSession();
  const userWebProperties = userGetUserWebProperties(session?.user?.email || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm: string = useDebounce(searchTerm, 200);

  const filteredData = userWebProperties?.data?.filter((el: TpropertyItem) =>
    el.propertyIdentifier.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );

  return (
    <Card className="pf-u-m-md " style={{ height: '97%' }}>
      <CardHeader>
        <SplitItem isFilled>
          <p className="text-xl"> My web properties</p>
        </SplitItem>
        <SplitItem className="pf-u-mx-md">
          <SearchInput
            placeholder="Filter by name"
            value={searchTerm}
            onChange={(value) => setSearchTerm(value?.toLowerCase())}
            onClear={() => setSearchTerm('')}
          />
        </SplitItem>
        <SplitItem>
          <Button variant="primary">Add Web Property</Button>
        </SplitItem>
      </CardHeader>
      <CardBody>
        {userWebProperties?.isLoading && (
          <EmptyState>
            <EmptyStateBody>
              <Spinner />
            </EmptyStateBody>
          </EmptyState>
        )}
        {userWebProperties?.data?.length === 0 ? (
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <EmptyStateBody>
              <Text className="text-xl">No web properties found.</Text>
              To get started add web property.
            </EmptyStateBody>
          </EmptyState>
        ) : (
          userWebProperties?.isSuccess && (
            <Table aria-label="Sortable table" ouiaId="SortableTable" isStriped>
              <Thead>
                <Tr>
                  <Th>Name</Th>
                  {/* <Th modifier="wrap">Owner</Th> */}
                  <Th modifier="wrap">Hosted Application</Th>
                  <Th modifier="wrap">Total Deployment</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredData?.map((item: TpropertyItem, rowIndex: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Tr key={rowIndex}>
                    <Td>{item.propertyIdentifier}</Td>
                    {/* <Td>{item.createdBy}</Td> */}
                    <Td>{item.applicationCount}</Td>
                    <Td>{item.deploymentCount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )
        )}
      </CardBody>
    </Card>
  );
};
