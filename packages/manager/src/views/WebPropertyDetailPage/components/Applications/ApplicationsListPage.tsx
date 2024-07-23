import { TableRowSkeleton } from '@app/components';
import { useDebounce, usePopUp, useToggle } from '@app/hooks';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetSPAPropGroupByName, useGetSPAProperties } from '@app/services/spaProperty';
import {
  Button,
  Drawer,
  DrawerActions,
  DrawerCloseButton,
  DrawerContent,
  DrawerContentBody,
  DrawerHead,
  DrawerPanelContent,
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
import Link from 'next/link';
import { useRouter } from 'next/router';
import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { EmptyInfo } from '../EmptyInfo';
import { AddDeployment } from '../AddDeployment';
import { ApplicationDetailsSection } from './ApplicationDetailsSection';

const URL_LENGTH_LIMIT = 100;
const perPageOptions = [
  { title: '5', value: 5 },
  { title: '10', value: 10 },
  { title: '15', value: 15 },
  { title: '20', value: 20 },
  { title: '50', value: 50 }
];

export const Applications = (): JSX.Element => {
  const { query, push } = useRouter();
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [filterByEnv, setFilterByEnv] = useState<string>('');
  const propertyIdentifier: string = (query?.propertyIdentifier as string) || '';
  const debouncedSearchTerm: string = useDebounce(searchTerm, 200);
  const [isFilterOpen, toggleFilterOpen] = useToggle();
  // api calls
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, filterByEnv);
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const spaPropertyKeys: string[] = Object.keys(spaProperties?.data || {});
  const isSpaPropertyListEmpty: boolean = spaPropertyKeys.length === 0;
  const webPropertiesKeys: string[] = Object.keys(webProperties?.data || {});
  const countOfSpas: Record<string, any> = useGetSPAProperties(propertyIdentifier, '');
  const isCountOfSpasListEmpty: boolean = Object.keys(countOfSpas).length === 0;
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['addApplication'] as const);
  const [page, setPage] = useState<number>(1);
  const [perPage, setPerPage] = useState<number>(10);
  const [selectedAppIdentifier, setSelectedAppIdentifier] = useState<string>('');

  useEffect(() => {
    if (spaProperties.isError || webProperties.isError) {
      toast.error(`Sorry cannot find ${propertyIdentifier}`);
      push('/properties');
    }
  }, [spaProperties.isError, webProperties.isError, propertyIdentifier, push]);

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
  const [isExpanded, setIsExpanded] = React.useState(false);
  const drawerRef = React.useRef<HTMLDivElement>();

  const onExpand = () => {
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
    drawerRef.current && drawerRef.current.focus();
  };

  const onClick = (identifier: string) => {
    setSelectedAppIdentifier(identifier);
    setIsExpanded(true);
  };

  const onCloseClick = () => {
    setIsExpanded(false);
  };

  const panelContent = (
    <DrawerPanelContent style={{ marginTop: '80px' }}>
      <DrawerHead>
        {/* eslint-disable-next-line jsx-a11y/no-noninteractive-tabindex */}
        <span tabIndex={isExpanded ? 0 : -1}>
          {spaProperties && spaProperties.data && (
            <ApplicationDetailsSection
              data={spaProperties.data[selectedAppIdentifier]}
              webProperties={webProperties}
            />
          )}
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={onCloseClick} />
        </DrawerActions>
      </DrawerHead>
    </DrawerPanelContent>
  );

  const drawerContent = (
    <>
      <Pagination
        itemCount={
          spaPropertyKeys.filter((el) => el.toLowerCase().includes(debouncedSearchTerm)).length || 0
        }
        widgetId="bottom-example"
        perPage={perPage}
        page={page}
        perPageOptions={perPageOptions}
        variant={PaginationVariant.top}
        onSetPage={onPageSet}
        onPerPageSelect={onPerPageSelect}
      />
      <TableComposable>
        <Thead>
          <Tr>
            <Th>Application name</Th>
            <Th>Environment</Th>
            <Th>URL Path</Th>
          </Tr>
        </Thead>
        <Tbody>
          {(spaProperties.isLoading && webProperties.isLoading) ||
          (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
            <TableRowSkeleton rows={3} columns={4} />
          ) : (
            spaProperties.isSuccess &&
            paginatedData.map((identifier) => (
              <Tr key={identifier}>
                <Td>
                  <Link
                    href={{
                      pathname: '/properties/[propertyIdentifier]/[spaProperty]',
                      query: {
                        propertyIdentifier,
                        spaProperty: identifier,
                        initialTab: spaProperties.data[identifier]?.[0]?.isContainerized ? 0 : 1
                      }
                    }}
                  >
                    {`${spaProperties.data[identifier]?.[0]?.name.slice(0, URL_LENGTH_LIMIT)} ${
                      spaProperties.data[identifier]?.[0]?.name.length > URL_LENGTH_LIMIT
                        ? '...'
                        : ''
                    }`}
                  </Link>
                </Td>

                <Td style={{ wordWrap: 'break-word' }}>
                  <Split hasGutter>
                    {spaProperties?.data[identifier].map(({ _id, env, isContainerized, isGit }) => (
                      <SplitItem key={_id} style={{ marginRight: '8px' }}>
                        <Label
                          icon={
                            // eslint-disable-next-line no-nested-ternary
                            isContainerized && isGit ? (
                              <GithubIcon />
                            ) : isContainerized && !isGit ? (
                              <BuildIcon />
                            ) : (
                              <BundleIcon />
                            )
                          }
                          color="grey"
                        >
                          {env}
                        </Label>
                      </SplitItem>
                    ))}
                  </Split>
                </Td>
                <Td style={{ wordWrap: 'break-word' }}>
                  {`${spaProperties?.data[identifier]?.[0]?.path?.slice(0, URL_LENGTH_LIMIT)} ${
                    spaProperties?.data[identifier]?.[0]?.path?.length > URL_LENGTH_LIMIT
                      ? '...'
                      : ''
                  }`}
                </Td>
                <Td>
                  <Split>
                    <SplitItem isFilled />
                    <SplitItem>
                      <Link
                        href={{
                          pathname: '/properties/[propertyIdentifier]/[spaProperty]',
                          query: {
                            propertyIdentifier,
                            spaProperty: identifier,
                            initialTab: spaProperties.data[identifier]?.[0]?.isContainerized ? 0 : 1
                          }
                        }}
                      >
                        <a>
                          <Button
                            variant="link"
                            icon={<ExternalLinkAltIcon />}
                            iconPosition="right"
                            aria-expanded={isExpanded}
                          >
                            Application details
                          </Button>{' '}
                        </a>
                      </Link>

                      <Button
                        variant="secondary"
                        ouiaId="Secondary"
                        onClick={() => onClick(identifier)}
                      >
                        Environment details
                      </Button>
                    </SplitItem>
                  </Split>
                </Td>
              </Tr>
            ))
          )}
        </Tbody>
      </TableComposable>
    </>
  );
  return (
    <div>
      {!spaProperties.isLoading &&
      !isCountOfSpasListEmpty &&
      Object.values(countOfSpas.data || {}).length === 0 ? (
        <>
          <Split hasGutter className="pf-u-mt-md">
            <Button onClick={() => handlePopUpOpen('addApplication')}>Add application</Button>
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
                  onToggle={toggleFilterOpen.toggle}
                  onSelect={(e, value) => {
                    if (value === 'Select environment') {
                      setFilterByEnv('' as string);
                    } else {
                      setFilterByEnv(value as string);
                    }
                    toggleFilterOpen.off();
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
                <Button onClick={() => handlePopUpOpen('addApplication')}>Add application</Button>
              </SplitItem>

              <SplitItem
                isFilled
                style={{
                  display: 'flex',
                  justifyContent: 'flex-end'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center' }}>
                  <Label icon={<GithubIcon />}>Containerized deployment (Git)</Label>{' '}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
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
            <Drawer isExpanded={isExpanded} onExpand={onExpand}>
              <DrawerContent panelContent={panelContent}>
                <DrawerContentBody>{drawerContent}</DrawerContentBody>
              </DrawerContent>
            </Drawer>
          )}
        </>
      )}
      <Modal
        title="Create Deployment"
        variant={ModalVariant.large}
        isOpen={popUp.addApplication.isOpen}
        onClose={() => handlePopUpClose('addApplication')}
      >
        <AddDeployment
          propertyIdentifier={propertyIdentifier}
          onClose={() => handlePopUpClose('addApplication')}
        />
      </Modal>
    </div>
  );
};
