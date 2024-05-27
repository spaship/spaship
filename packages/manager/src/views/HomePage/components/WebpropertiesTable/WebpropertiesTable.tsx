import { useDebounce } from '@app/hooks';
import { pageLinks } from '@app/links';
import { useGetUserWebProperties } from '@app/services/analytics';
import { AddDeplyoment } from '@app/views/WebPropertyDetailPage/components/addDeployment';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Pagination,
  SearchInput,
  Spinner,
  SplitItem,
  Text
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { SetStateAction, useState } from 'react';

type TpropertyItem = {
  applicationCount: string;
  deploymentCount: string;
  identifiers: string;
  propertyIdentifier: string;
  createdBy: string;
};
const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];
export const WebpropertiesTable = (): JSX.Element => {
  const { data: session } = useSession();
  const userWebProperties = useGetUserWebProperties(session?.user?.email || '');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const debouncedSearchTerm: string = useDebounce(searchTerm, 200);
  const filteredData = userWebProperties?.data?.filter((el: TpropertyItem) =>
    el.propertyIdentifier.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
  );
  const [page, setPage] = useState(1); // the current page
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const paginatedData = filteredData?.slice(start, end);
  const handlePageChange = (event: any, pageNumber: SetStateAction<number>) => {
    setPage(pageNumber);
  };
  const handlePerPageSelect = (_: any, perPage: SetStateAction<number>) => {
    setItemsPerPage(perPage);
    setPage(1);
  };
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
          <Link passHref href={pageLinks.newWebPropertyPage}>
            <Button variant="primary">Add a web property</Button>
          </Link>
        </SplitItem>
      </CardHeader>
      <CardBody className="table-container">
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
                  <Th modifier="wrap">Created By</Th>
                  <Th modifier="wrap">Hosted Application</Th>
                  <Th modifier="wrap">Total Deployment</Th>
                </Tr>
              </Thead>
              <Tbody>
                {paginatedData?.map((item: TpropertyItem, rowIndex: number) => (
                  // eslint-disable-next-line react/no-array-index-key
                  <Tr key={rowIndex}>
                    <Td>
                      <a href={`/properties/${item.propertyIdentifier}`}>
                        {item.propertyIdentifier}
                      </a>
                    </Td>
                    <Td>{item.createdBy}</Td>
                    <Td>{item.applicationCount}</Td>
                    <Td>{item.deploymentCount}</Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )
        )}
      </CardBody>
      <Pagination
        itemCount={paginatedData?.length || 0}
        perPage={itemsPerPage}
        page={page}
        onSetPage={handlePageChange}
        variant="bottom"
        onPerPageSelect={handlePerPageSelect}
        perPageOptions={perPageOptions}
        dropDirection="up"
      />
    </Card>
  );
};
