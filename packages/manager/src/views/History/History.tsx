import React, { SetStateAction, useState } from 'react';
import { useGetHistoryData } from '@app/services/history';
import {
  Card,
  CardBody,
  CardHeader,
  Pagination,
  PaginationVariant,
  Spinner,
  Split,
  SplitItem,
  Tooltip
} from '@patternfly/react-core';
import { Table, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { THistoryData } from '@app/services/history/types';
import { BuildIcon, BundleIcon, GithubIcon, InfoAltIcon } from '@patternfly/react-icons';

const perPageOptions = [
  { title: '10', value: 10 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];

type Props = {
  propertyIdentifier: string;
  applicationIdentifier?: string;
};

const actions: { [key: string]: (message: string) => JSX.Element } = {
  APIKEY_CREATED: () => <>Api key created</>,
  APPLICATION_DEPLOYMENT_STARTED: (message: string) => {
    if (message.includes('[Workflow 3.0]')) {
      return (
        <>
          <GithubIcon /> Application deployment started
        </>
      );
    } else if (message.includes('Containerized')) {
      return (
        <>
          <BuildIcon /> Application deployment started
        </>
      );
    } else {
      return (
        <>
          <BundleIcon /> Application deployment started
        </>
      );
    }
  },

  APPLICATION_BUILD_STARTED: () => (
    <>
      <GithubIcon /> Application deployment started
    </>
  )
};

const getActionDescription = (action: string, message: string): JSX.Element =>
  actions[action as keyof typeof actions]?.(message) || <>{action}</>;

export const History = ({ propertyIdentifier, applicationIdentifier }: Props): JSX.Element => {
  const {
    data: historyData,
    isLoading,
    error
  } = useGetHistoryData(propertyIdentifier, applicationIdentifier);
  const [page, setPage] = useState(1); // the current page
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const start = (page - 1) * itemsPerPage;
  const end = start + itemsPerPage;

  const filteredData = historyData?.filter(
    (item: THistoryData) =>
      (item.source === 'MANAGER' || item.source === 'CLI' || item.source === 'GIT') &&
      !(item.action === 'APPLICATION_DEPLOYMENT_STARTED' && item.message.includes('[Workflow 3.0]'))
  );

  const paginatedData = filteredData
    ?.sort((a, b) => (new Date(b.createdAt) as any) - (new Date(a.createdAt) as any))
    .slice(start, end);

  if (isLoading) return <Spinner />;
  if (error) return <div>Error loading history data</div>;

  const handlePageChange = (event: any, pageNumber: SetStateAction<number>) => {
    setPage(pageNumber);
  };

  const handlePerPageSelect = (_: any, perPage: SetStateAction<number>) => {
    setItemsPerPage(perPage);
    setPage(1);
  };

  return (
    <div className="pf-u-p-lg">
      <Card>
        <Split>
          <SplitItem>
            <CardHeader>
              User Actions History &nbsp;
              <Tooltip
                content="Note: This section displays actions performed by users from different sources, including
          API key creation, application deployment for Static and Containerized application"
              >
                <InfoAltIcon />
              </Tooltip>
            </CardHeader>
          </SplitItem>
          <SplitItem isFilled>
            <Pagination
              itemCount={filteredData?.length || 0}
              perPage={itemsPerPage}
              page={page}
              onSetPage={handlePageChange}
              variant={PaginationVariant.top}
              onPerPageSelect={handlePerPageSelect}
              perPageOptions={perPageOptions}
              dropDirection="down"
            />
          </SplitItem>
        </Split>

        <CardBody>
          <Table aria-label="History table">
            <Thead>
              <Tr>
                <Th textCenter modifier="wrap">
                  Time
                </Th>
                <Th textCenter modifier="wrap">
                  Event
                </Th>
                <Th textCenter modifier="wrap">
                  Action by
                </Th>

                {!applicationIdentifier && (
                  <Th textCenter modifier="wrap">
                    Application Identifier
                  </Th>
                )}

                <Th textCenter modifier="wrap">
                  Environment
                </Th>
                <Th textCenter modifier="wrap">
                  Source
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {paginatedData?.map((item: THistoryData) => (
                <Tr key={item.createdAt}>
                  <Td textCenter>{new Date(item.createdAt).toLocaleString()}</Td>
                  <Td textCenter>{getActionDescription(item.action, item.message)}</Td>
                  <Td textCenter>{item.createdBy}</Td>

                  {!applicationIdentifier && <Td textCenter>{item.props.applicationIdentifier}</Td>}
                  <Td textCenter>{item.props.env}</Td>
                  <Td textCenter>{item.source}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};
History.defaultProps = {
  applicationIdentifier: ''
};
