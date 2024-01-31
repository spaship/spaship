import { TableRowSkeleton } from '@app/components';
import { useGetUserFeedback } from '@app/services/feedback';
import { Card, CardBody, CardTitle, Grid, GridItem, Pagination } from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import dayjs from 'dayjs';
import { SetStateAction, useState } from 'react';

const perPageOptions = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];
export const UserFeedbackDashboard = (): JSX.Element => {
  const userFeedback = useGetUserFeedback();
  const [page, setPage] = useState(1); // the current page
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginatedData = userFeedback?.data
    ?.sort((a, b) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any))
    .slice(start, end);

  const columnNames = {
    category: 'Category',
    description: 'Description',
    experience: 'Experience',
    error: 'Error subcategory',
    createdBy: 'Created By',
    createdAt: 'Created At'
  };
  const handlePageChange = (event: any, pageNumber: SetStateAction<number>) => {
    setPage(pageNumber);
  };
  const handlePerPageSelect = (_: any, perPage: SetStateAction<number>) => {
    setItemsPerPage(perPage);
    setPage(1);
  };

  return (
    <Grid hasGutter className="pf-u-px-md" style={{ backgroundColor: '#F0F0F0' }}>
      <GridItem span={12}>
        <Card>
          <CardTitle>
            <p style={{ fontSize: 'xx-large' }}>User Feedback for SPAship</p>
          </CardTitle>

          <CardBody>
            {userFeedback.isLoading && <TableRowSkeleton columns={10} rows={5} />}
            {userFeedback.isSuccess && userFeedback.data ? (
              <>
                <Pagination
                  itemCount={userFeedback?.data?.length || 0}
                  perPage={itemsPerPage}
                  page={page}
                  onSetPage={handlePageChange}
                  variant="bottom"
                  onPerPageSelect={handlePerPageSelect}
                  perPageOptions={perPageOptions}
                  dropDirection="down"
                />
                <Table aria-label="Simple table" borders>
                  <Thead>
                    <Tr>
                      <Th textCenter modifier="wrap">
                        {columnNames.category}
                      </Th>
                      <Th textCenter modifier="wrap">
                        {columnNames.error}
                      </Th>
                      <Th textCenter modifier="wrap">
                        {columnNames.description}
                      </Th>

                      <Th textCenter modifier="wrap">
                        {columnNames.experience}
                      </Th>

                      <Th textCenter modifier="wrap">
                        {columnNames.createdBy}
                      </Th>
                      <Th textCenter modifier="wrap">
                        {columnNames.createdAt}
                      </Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {paginatedData?.map((item) => (
                      <Tr key={item.createdAt}>
                        <Td textCenter dataLabel={columnNames.category}>
                          {item.category ? item.category : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.error}>
                          {item.error ? item.error : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.description}>
                          {item.description ? item.description : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.experience}>
                          {item.experience ? item.experience : 'NA'}
                        </Td>

                        <Td textCenter dataLabel={columnNames.createdBy}>
                          {item.createdBy ? item.createdBy : 'NA'}
                        </Td>
                        <Td textCenter dataLabel={columnNames.createdAt}>
                          {item.createdAt ? dayjs(item.createdAt).format('DD-MM-YYYY HH:MM') : 'NA'}
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              </>
            ) : (
              ''
            )}
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};
