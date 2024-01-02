import { TableRowSkeleton } from '@app/components';
import { useDebounce, usePopUp, useToggle } from '@app/hooks';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName, useGetSPAProperties } from '@app/services/spaProperty';
import {
  Button,
  Label,
  Modal,
  ModalVariant,
  Pagination,
  PaginationVariant,
  SearchInput,
  Select,
  SelectOption,
  SelectVariant,
  Split,
  SplitItem
} from '@patternfly/react-core';
import {
  BuildIcon,
  BundleIcon,
  ExternalLinkAltIcon,
  GithubIcon,
  TimesCircleIcon
} from '@patternfly/react-icons';
import { TableComposable, Tbody, Td, Th, Thead, Tr } from '@patternfly/react-table';
import { Router, useRouter } from 'next/router';
import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyInfo } from '../EmptyInfo';
import { AddDeplyoment } from '../addDeployment';

const URL_LENGTH_LIMIT = 100;
const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];

export const Applications = (): JSX.Element => {
  const { query } = useRouter();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByEnv, setFilterByEnv] = useState('');
  const propertyIdentifier = (query?.propertyIdentifier as string) || '';
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const [isFilterOpen, setIsFilterOpen] = useToggle();
  // api calls
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, filterByEnv);
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;
  const webPropertiesKeys = Object.keys(webProperties.data || {});
  const countOfSpas = useGetSPAProperties(propertyIdentifier, '');
  const isCountOfSpasListEmpty = Object.keys(countOfSpas).length === 0;
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['createSSRDeployment'] as const);
  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(5);

  useEffect(() => {
    if (spaProperties.isError || webProperties.isError) {
      toast.error(`Sorry cannot find ${propertyIdentifier}`);
      Router.push('/properties');
    }
  }, [spaProperties.isError, webProperties.isError, propertyIdentifier]);

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

  const paginatedData = spaPropertyKeys
    .filter((el) => el.toLowerCase().includes(debouncedSearchTerm))
    ?.slice(startIdx, endIdx);

  const removeValues = () => {
    setFilterByEnv('' as string);
  };

  return (
    <div>
      {!spaProperties.isLoading &&
      !isCountOfSpasListEmpty &&
      Object.values(countOfSpas.data || {}).length === 0 ? (
        <>
          <Split hasGutter className="pf-u-mt-md">
            <Button onClick={() => handlePopUpOpen('createSSRDeployment')}>Add application</Button>
          </Split>
          <EmptyInfo propertyIdentifier={propertyIdentifier} />
        </>
      ) : (
        <>
          <div className="pf-u-w-70  pf-u-mt-md">
            <Split hasGutter>
              <SplitItem>
                {' '}
                <SearchInput
                  placeholder="Filter by name"
                  value={searchTerm}
                  onChange={(value) => setSearchTerm(value?.toLowerCase())}
                  onClear={() => setSearchTerm('')}
                />
              </SplitItem>

              <SplitItem>
                <Select
                  variant={SelectVariant.single}
                  aria-label="filter Input"
                  value="Select environment"
                  onToggle={setIsFilterOpen.toggle}
                  onSelect={(e, value) => {
                    if (value === 'Select environment') {
                      setFilterByEnv('' as string);
                    } else {
                      setFilterByEnv(value as string);
                    }
                    setIsFilterOpen.off();
                  }}
                  selections="Select environment" // To be kept as Select
                  isOpen={isFilterOpen}
                  aria-labelledby="filter"
                >
                  {webPropertiesKeys.map((envName, index) => (
                    <SelectOption key={`${envName} + ${index + 1}`} value={envName} />
                  ))}
                </Select>
              </SplitItem>
              <SplitItem>
                <Button onClick={() => handlePopUpOpen('createSSRDeployment')}>
                  Add application
                </Button>
              </SplitItem>

              <SplitItem
                isFilled
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Label icon={<BuildIcon />}>Containerized deployment</Label>{' '}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
                  <Label icon={<BundleIcon />}>Static deploymentt</Label>{' '}
                </div>
              </SplitItem>
            </Split>
            {filterByEnv === 'Select environment' || filterByEnv === '' ? (
              <p />
            ) : (
              <div
                style={{
                  backgroundColor: '#F1F1F1',
                  height: '40px',
                  width: '120px',
                  borderRadius: '25px',
                  display: 'flex',
                  flexDirection: 'row'
                }}
              >
                <div style={{ marginLeft: '20px', marginRight: '15px', marginTop: '7px' }}>
                  {filterByEnv}
                </div>
                <TimesCircleIcon
                  style={{ marginTop: '11px', marginLeft: '6px' }}
                  onClick={removeValues}
                />
              </div>
            )}
          </div>

          {spaProperties.isSuccess && isSpaPropertyListEmpty ? (
            <EmptyInfo propertyIdentifier={propertyIdentifier} />
          ) : (
            <>
              {/* <Split>
                <SplitItem isFilled>
                  <Pagination
                    itemCount={
                      spaPropertyKeys.filter((el) => el.toLowerCase().includes(debouncedSearchTerm))
                        .length || 0
                    }
                    widgetId="bottom-example"
                    perPage={perPage}
                    page={page}
                    perPageOptions={perPageOptions}
                    variant={PaginationVariant.top}
                    onSetPage={onPageSet}
                    onPerPageSelect={onPerPageSelect}
                  />
                </SplitItem>
              </Split> */}
              <TableComposable>
                <Thead>
                  <Tr>
                    <Th>Application name</Th>
                    <Th>Environment</Th>
                    <Th>URL Path</Th>
                    <Th colSpan={2}>
                      {' '}
                      <Pagination
                        itemCount={
                          spaPropertyKeys.filter((el) =>
                            el.toLowerCase().includes(debouncedSearchTerm)
                          ).length || 0
                        }
                        widgetId="bottom-example"
                        perPage={perPage}
                        page={page}
                        perPageOptions={perPageOptions}
                        variant={PaginationVariant.top}
                        onSetPage={onPageSet}
                        onPerPageSelect={onPerPageSelect}
                      />
                    </Th>
                  </Tr>
                </Thead>
                {(spaProperties.isLoading && webProperties.isLoading) ||
                (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
                  <TableRowSkeleton rows={3} columns={4} />
                ) : (
                  spaProperties.isSuccess &&
                  paginatedData.map((identifier) => (
                    <Tbody key={identifier}>
                      <Tr>
                        <Td dataLabel="nikh">{identifier}</Td>

                        <Td style={{ wordWrap: 'break-word' }}>
                          <Split hasGutter>
                            {spaProperties.data[identifier].map(
                              ({ _id, env, isContainerized, isGit }) => (
                                <SplitItem key={_id} style={{ marginRight: '8px' }}>
                                  <Label
                                    icon={isGit && <GithubIcon />}
                                    color={isContainerized || isGit ? 'cyan' : 'gold'}
                                    isCompact
                                  >
                                    {env}
                                  </Label>
                                </SplitItem>
                              )
                            )}
                          </Split>
                        </Td>
                        <Td style={{ wordWrap: 'break-word' }}>
                          {`${spaProperties.data[identifier]?.[0]?.path?.slice(
                            0,
                            URL_LENGTH_LIMIT
                          )} ${
                            spaProperties.data[identifier]?.[0]?.path?.length > URL_LENGTH_LIMIT
                              ? '...'
                              : ''
                          }`}
                        </Td>
                        <Td>
                          <Split>
                            <SplitItem isFilled />
                            <SplitItem>
                              <Button
                                variant="link"
                                icon={<ExternalLinkAltIcon />}
                                iconPosition="right"
                              >
                                Application deatils
                              </Button>{' '}
                              <Button variant="secondary" ouiaId="Secondary">
                                Environment details
                              </Button>{' '}
                            </SplitItem>
                          </Split>
                        </Td>
                      </Tr>
                    </Tbody>
                  ))
                )}
              </TableComposable>
            </>
          )}
        </>
      )}
      <Modal
        title="Create Containerized Deployment"
        variant={ModalVariant.large}
        isOpen={popUp.createSSRDeployment.isOpen}
        onClose={() => handlePopUpClose('createSSRDeployment')}
        style={{ minHeight: '600px' }}
      >
        <AddDeplyoment
          propertyIdentifier={propertyIdentifier}
          onClose={() => handlePopUpClose('createSSRDeployment')}
        />
      </Modal>
    </div>
  );
};
