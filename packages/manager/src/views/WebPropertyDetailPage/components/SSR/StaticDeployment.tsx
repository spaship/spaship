/* eslint-disable react/no-array-index-key */
/* eslint-disable no-underscore-dangle */
import { TableRowSkeleton } from '@app/components';
import { usePopUp, useToggle } from '@app/hooks';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { TSpaProperty } from '@app/services/spaProperty/types';
import { useApplicationAutoSync } from '@app/services/sync';
import {
  ActionGroup,
  Button,
  Checkbox,
  EmptyState,
  EmptyStateBody,
  EmptyStateIcon,
  Label,
  Modal,
  ModalVariant,
  Pagination,
  PaginationVariant,
  Select,
  SelectOption,
  SelectVariant,
  Spinner,
  Split,
  SplitItem,
  Title,
  Tooltip
} from '@patternfly/react-core';
import { CubesIcon, SyncAltIcon } from '@patternfly/react-icons';
import { Caption, TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { AxiosError } from 'axios';
import { useRouter } from 'next/router';
import { useState } from 'react';
import toast from 'react-hot-toast';
import { ApplicationStatus } from './ApplicationStatus';

const URL_LENGTH_LIMIT = 100;
const INTERNAL_ACCESS_URL_LENGTH = 25;

const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];
export const StaticDeployment = () => {
  const { query } = useRouter();

  const propertyIdentifier = query.propertyIdentifier as string;
  const spaProperty = query.spaProperty as string;
  const [isFilterOpen, setIsFilterOpen] = useToggle();
  const [filterByEnv, setFilterByEnv] = useState('');
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, filterByEnv);
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;
  const staticDeploymentData = spaProperties?.data?.[spaProperty]?.filter(
    (data) => data.isContainerized === false
  );
  const [syncData, setSyncData] = useState<TSpaProperty | undefined>();
  const [isChecked, setIsChecked] = useState<boolean>(syncData?.autoSync || false);
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['autoSync'] as const);
  const webPropertiesKeys = Object.keys(webProperties.data || {});

  const removeValues = () => {
    setFilterByEnv('' as string);
  };
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);
  const autoSyncData = useApplicationAutoSync();
  const openModel = async (data: any) => {
    handlePopUpOpen('autoSync');
    setSyncData(data);
  };

  const handleAutoSync = async () => {
    if (syncData) {
      const { propertyIdentifier: propertyIdentifierForAutoSync, env, identifier } = syncData;
      try {
        await autoSyncData.mutateAsync({
          propertyIdentifier: propertyIdentifierForAutoSync,
          env,
          identifier,
          autoSync: isChecked
        });

        handlePopUpClose('autoSync');
        if (isChecked) {
          toast.success('Auto Sync has been enabled successfully.');
        } else {
          toast.success('Auto Sync has been disabled successfully.');
        }
      } catch (error) {
        if (error instanceof AxiosError) {
          if (error.response && error.response.status === 403) {
            toast.error("You don't have access to perform this action");
            handlePopUpClose('autoSync');
          } else {
            toast.error('Failed to autosync');
          }
        } else {
          // eslint-disable-next-line no-console
          console.error('An error occurred:', error);
        }
      }
    }
  };
  const onPageSet = (_: any, pageNumber: number) => {
    setPage(pageNumber);
  };
  const onPerPageSelect = (
    _event: React.MouseEvent | React.KeyboardEvent | MouseEvent,
    newPerPage: number,
    newPage: number
  ) => {
    setPerPage(newPerPage);
    setPage(newPage);
  };

  const startIdx = (page - 1) * perPage;
  const endIdx = startIdx + perPage;

  const paginatedData = staticDeploymentData?.slice(startIdx, endIdx);
  return (
    <>
      <Split hasGutter className="pf-u-mb-md">
        {staticDeploymentData?.length || filterByEnv !== '' ? (
          <SplitItem isFilled>
            <Select
              width={300}
              variant={SelectVariant.single}
              aria-label="filter Input"
              value="Select Environment"
              onToggle={setIsFilterOpen.toggle}
              onSelect={(e, value) => {
                if (value === 'Select Environment') {
                  setFilterByEnv('' as string);
                } else {
                  setFilterByEnv(value as string);
                }

                setIsFilterOpen.off();
              }}
              selections="Select Environment" // To be kept as Select
              isOpen={isFilterOpen}
              aria-labelledby="filter"
            >
              {webPropertiesKeys.map((envName, index) => (
                <SelectOption key={`${envName} + ${index + 1}`} value={envName} />
              ))}
            </Select>
          </SplitItem>
        ) : (
          ''
        )}

        {staticDeploymentData?.length ? (
          <SplitItem>
            <Pagination
              itemCount={staticDeploymentData?.length}
              widgetId="bottom-example"
              perPage={perPage}
              page={page}
              perPageOptions={perPageOptions}
              variant={PaginationVariant.top}
              onSetPage={onPageSet}
              onPerPageSelect={onPerPageSelect}
            />
          </SplitItem>
        ) : (
          ''
        )}
      </Split>
      <Split>
        <SplitItem isFilled>
          {filterByEnv === 'Select Environment' || filterByEnv === '' ? (
            <p />
          ) : (
            <Label onClose={removeValues}>{filterByEnv}</Label>
          )}
        </SplitItem>
        <SplitItem>
          {staticDeploymentData?.length ? (
            <p style={{ justifyContent: 'end', display: 'flex', fontSize: '14px' }}>
              <Label color="gold" isCompact style={{ marginRight: '8px' }}>
                <>
                  <SyncAltIcon /> &nbsp; Enabled
                </>
              </Label>
              AutoSync Enabled for application
            </p>
          ) : (
            ''
          )}
        </SplitItem>
      </Split>
      <div>
        {!staticDeploymentData?.length ? (
          <EmptyState>
            <EmptyStateIcon icon={CubesIcon} />
            <Title headingLevel="h4" size="lg">
              No Static Deployment exists.
            </Title>
            <EmptyStateBody>Please create a deployment to view them here</EmptyStateBody>
          </EmptyState>
        ) : (
          <TableComposable aria-label="spa-property-list">
            <Caption>SPA&apos;s DEPLOYED</Caption>
            <Thead noWrap>
              <Tr>
                <Th textCenter>SPA Name</Th>
                <Th textCenter>Environments</Th>
                <Th textCenter>Reference</Th>
                <Th textCenter>Path</Th>
                <Th textCenter>Internal Access URL</Th>
                <Th textCenter>Router URL</Th>
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
                {paginatedData?.map((val, index: number) => (
                  <Tr key={`tr-${val._id}-${index}`}>
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
                      {val.autoSync && (
                        <Label
                          key={`autoSync-${val.name}`}
                          color={val.isContainerized ? 'blue' : 'gold'}
                          isCompact
                          style={{ marginRight: '8px' }}
                        >
                          <>
                            <SyncAltIcon /> &nbsp;Enabled
                          </>
                        </Label>
                      )}
                    </Td>

                    <Td textCenter>{val?.ref}</Td>
                    <Td textCenter>{val?.path}</Td>

                    <Td textCenter>
                      {val?.accessUrl?.map((accessUrl: string, indexAccessUrl: number) => (
                        <div key={`access-${accessUrl}-${indexAccessUrl}`}>
                          {accessUrl === 'NA' ? (
                            <Spinner isSVG diameter="30px" />
                          ) : (
                            <div style={{ textAlign: 'center' }}>
                              <Tooltip
                                className="my-custom-tooltip"
                                content={
                                  <div>
                                    <a
                                      className="text-decoration-none"
                                      href={accessUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                    >
                                      {accessUrl}
                                    </a>
                                  </div>
                                }
                              >
                                <a
                                  href={accessUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{ textDecoration: 'none', marginRight: '8px' }}
                                >
                                  {`${accessUrl.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                                    accessUrl.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                                  }`}
                                </a>
                              </Tooltip>{' '}
                              <ApplicationStatus link={accessUrl} _id={String(val._id)} />
                            </div>
                          )}
                        </div>
                      ))}
                    </Td>
                    <Td textCenter>
                      {val?.routerUrl?.map(
                        (routerUrl: string | undefined, indexRouterUrl: number) => (
                          <div key={`router-${routerUrl}-${indexRouterUrl}` ?? 'NA'}>
                            {routerUrl === 'NA' ? (
                              <Spinner isSVG diameter="30px" />
                            ) : (
                              <div style={{ textAlign: 'center' }}>
                                {routerUrl ? (
                                  <Tooltip
                                    className="my-custom-tooltip"
                                    content={
                                      <div>
                                        <a
                                          className="text-decoration-none"
                                          href={routerUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          {routerUrl}
                                        </a>
                                      </div>
                                    }
                                  >
                                    <a
                                      href={routerUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      style={{ textDecoration: 'none', marginRight: '8px' }}
                                    >
                                      {`${routerUrl.slice(0, INTERNAL_ACCESS_URL_LENGTH)} ${
                                        routerUrl.length > INTERNAL_ACCESS_URL_LENGTH ? '...' : ''
                                      }`}
                                    </a>
                                  </Tooltip>
                                ) : (
                                  'NA'
                                )}
                                <ApplicationStatus
                                  link={routerUrl ?? 'NA'}
                                  _id={String(val._id + (routerUrl ?? 'NA'))}
                                />
                              </div>
                            )}
                          </div>
                        )
                      )}
                    </Td>

                    <Td textCenter style={{ justifyContent: 'flex-end', display: 'grid' }}>
                      <SplitItem isFilled>
                        <Button
                          variant="primary"
                          isSmall
                          icon={<SyncAltIcon />}
                          onClick={() => openModel(val)}
                        >
                          Auto Sync
                        </Button>
                      </SplitItem>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            )}
          </TableComposable>
        )}
        <Modal
          title="AutoSync Confirmation"
          variant={ModalVariant.small}
          isOpen={popUp.autoSync.isOpen}
          onClose={() => handlePopUpClose('autoSync')}
        >
          <Checkbox
            label={isChecked ? 'AutoSync Enabled' : 'AutoSync Disabled'}
            isChecked={isChecked}
            onChange={(checked: boolean) => {
              setIsChecked(checked);
            }}
            id="controlled-check-1"
            name="AutoSync"
          />

          <ActionGroup>
            <Button onClick={() => handleAutoSync()} className="pf-u-mr-md pf-u-mt-md">
              {' '}
              Submit
            </Button>
            <Button onClick={() => handlePopUpClose('autoSync')} className="pf-u-mt-md">
              Cancel
            </Button>
          </ActionGroup>
        </Modal>
      </div>
    </>
  );
};
