import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import {
  Badge,
  Bullseye,
  Button,
  EmptyState,
  EmptyStateIcon,
  EmptyStateVariant,
  Label,
  Level,
  LevelItem,
  List,
  PageSection,
  SearchInput,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleIcon,
  TabTitleText,
  Title,
  Select,
  SelectOption,
  SelectVariant
} from '@patternfly/react-core';

import { Banner, TableRowSkeleton } from '@app/components';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { useGetWebPropertyGroupedByEnv } from '@app/services/persistent';
import { useGetEphemeralListForProperty } from '@app/services/ephemeral';
import {
  Caption,
  ExpandableRowContent,
  TableComposable,
  Tbody,
  Td,
  Th,
  Thead,
  Tr
} from '@patternfly/react-table';
import {
  CogIcon,
  CubeIcon,
  ExternalLinkAltIcon,
  PackageIcon,
  RunningIcon,
  SearchIcon,
  TimesCircleIcon
} from '@patternfly/react-icons';
import { useDebounce, useFormatDate, useTabs, useToggle } from '@app/hooks';
import { pageLinks } from '@app/links';

import toast from 'react-hot-toast';
import { ActivityStream } from '@app/components/ActivityStream';
import { Ephemeral } from './components/Ephemeral';
import { EmptyInfo } from './components/EmptyInfo';

const URL_LENGTH_LIMIT = 50;

export const WebPropertyDetailPage = (): JSX.Element => {
  const { query } = useRouter();
  const [isRowExpanded, setIsRowExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByEnv, setFilterByEnv] = useState('');
  const propertyIdentifier = (query?.propertyIdentifier as string) || '';
  const formatDate = useFormatDate();
  const { openTab, handleTabChange } = useTabs(3);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const [isFilterOpen, setIsFilterOpen] = useToggle();

  // api calls
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, filterByEnv);
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const ephemeralPreview = useGetEphemeralListForProperty(propertyIdentifier);
  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;
  const webPropertiesKeys = Object.keys(webProperties.data || {});
  const isWebPropertiesListEmpty = webPropertiesKeys.length === 0;

  useEffect(() => {
    if (spaProperties.isError || webProperties.isError) {
      toast.error(`Sorry cannot find ${propertyIdentifier}`);
      Router.push('/properties');
    }
  }, [spaProperties.isError, webProperties.isError, propertyIdentifier]);

  const onToggleRowExpanded = (name: string) => {
    const state = { ...isRowExpanded };
    if (state?.[name]) {
      state[name] = !state[name];
    } else {
      state[name] = true;
    }
    setIsRowExpanded(state);
  };
  const removeValues = () => {
    setFilterByEnv('' as string);
  };

  return (
    <>
      <Banner
        title={propertyIdentifier.replace('-', ' ')}
        backRef={{
          pathname: pageLinks.webPropertyListPage
        }}
      >
        <Level>
          <LevelItem />
          <LevelItem>
            <Link
              href={{
                pathname: pageLinks.webPropertySettingPage,
                query: { propertyIdentifier }
              }}
            >
              <Button variant="link" icon={<CogIcon />}>
                Settings
              </Button>
            </Link>
          </LevelItem>
        </Level>
      </Banner>
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
        <Tabs activeKey={openTab} onSelect={(_, tab) => handleTabChange(tab as number)}>
          <Tab
            eventKey={0}
            title={
              <>
                <TabTitleIcon>
                  <PackageIcon />
                </TabTitleIcon>
                <TabTitleText>SPAs</TabTitleText>{' '}
              </>
            }
            aria-label="SPA listing"
          >
            {!spaProperties.isLoading && isSpaPropertyListEmpty ? (
              <EmptyInfo propertyIdentifier={propertyIdentifier} />
            ) : (
              <>
                <div className="pf-u-w-50 pf-u-mb-lg pf-u-mt-md">
                  <Split hasGutter className="pf-u-mb-md">
                    <SearchInput
                      placeholder="Search by name"
                      value={searchTerm}
                      onChange={(value) => setSearchTerm(value?.toLowerCase())}
                      onClear={() => setSearchTerm('')}
                    />
                    <SplitItem isFilled />
                    <SplitItem isFilled />
                    <SplitItem>
                      <Select
                        variant={SelectVariant.single}
                        aria-label="filter Input"
                        value="Select Enviroment"
                        onToggle={setIsFilterOpen.toggle}
                        onSelect={(e, value) => {
                          if (value === 'Select Enviroment') {
                            setFilterByEnv('' as string);
                          } else {
                            setFilterByEnv(value as string);
                          }
                          setIsFilterOpen.off();
                        }}
                        selections="Select Enviroment" // To be kept as Select
                        isOpen={isFilterOpen}
                        aria-labelledby="filter"
                      >
                        {webPropertiesKeys.map((envName, index) => (
                          <SelectOption key={`${envName} + ${index + 1}`} value={envName} />
                        ))}
                      </Select>
                    </SplitItem>
                  </Split>
                  {filterByEnv === 'Select Enviroment' || filterByEnv === '' ? (
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
                <TableComposable aria-label="spa-property-list" className="">
                  <Caption>SPA&apos;s DEPLOYED</Caption>
                  <Thead>
                    <Tr>
                      <Th />
                      <Th>Name</Th>
                      <Th>URL Path</Th>
                      <Th>Environments</Th>
                    </Tr>
                  </Thead>

                  {((spaProperties.isSuccess && isSpaPropertyListEmpty) ||
                    (webProperties.isSuccess && isWebPropertiesListEmpty) ||
                    spaProperties.isLoading ||
                    webProperties.isLoading) && (
                    <Tbody>
                      {(spaProperties.isLoading || webProperties.isLoading) && (
                        <TableRowSkeleton rows={3} columns={4} />
                      )}
                      {spaProperties.isSuccess && isSpaPropertyListEmpty && (
                        <Tr>
                          <Td colSpan={4}>
                            <Bullseye>
                              <EmptyState variant={EmptyStateVariant.small}>
                                <EmptyStateIcon icon={SearchIcon} />
                                <Title headingLevel="h2" size="lg">
                                  No results found
                                </Title>
                                <Button>Clear all filters</Button>
                              </EmptyState>
                            </Bullseye>
                          </Td>
                        </Tr>
                      )}
                    </Tbody>
                  )}
                  {spaProperties.isSuccess &&
                    webPropertiesKeys &&
                    spaPropertyKeys
                      .filter((el) => el.toLowerCase().includes(debouncedSearchTerm))
                      .map((identifier, rowIndex) => (
                        <Tbody isExpanded={Boolean(isRowExpanded?.[identifier])} key={identifier}>
                          <Tr isStriped={Boolean(rowIndex % 2)}>
                            <Td
                              expand={{
                                rowIndex,
                                isExpanded: Boolean(isRowExpanded?.[identifier]),
                                onToggle: () => onToggleRowExpanded(identifier),
                                expandId: 'composable-property-table'
                              }}
                            />
                            <Td>
                              <Link
                                href={{
                                  pathname: '/properties/[propertyIdentifier]/[spaProperty]',
                                  query: { propertyIdentifier, spaProperty: identifier }
                                }}
                              >
                                {spaProperties.data[identifier]?.[0]?.name}
                              </Link>
                            </Td>
                            <Td>{spaProperties.data[identifier]?.[0]?.path}</Td>
                            <Td>
                              <Split hasGutter>
                                {spaProperties.data[identifier].map(({ _id, env }) => (
                                  <SplitItem key={_id}>
                                    <Label color="gold" isCompact>
                                      {env}
                                    </Label>
                                  </SplitItem>
                                ))}
                              </Split>
                            </Td>
                          </Tr>
                          <Tr isExpanded={Boolean(isRowExpanded?.[identifier])}>
                            <Td colSpan={4} noPadding={false}>
                              <ExpandableRowContent>
                                <TableComposable
                                  variant="compact"
                                  aria-label="expandable-table"
                                  borders={false}
                                >
                                  <Thead>
                                    <Tr>
                                      <Th>Environment Name</Th>
                                      <Th>Ref</Th>
                                      <Th>Publish Domain</Th>
                                      <Th>Internal Access URL</Th>
                                      <Th>Updated At</Th>
                                    </Tr>
                                  </Thead>
                                  <Tbody>
                                    {spaProperties?.data?.[identifier].map(
                                      ({ _id, env, ref, accessUrl, updatedAt }) => (
                                        <Tr key={_id}>
                                          <Td>
                                            <Label color="gold" isCompact>
                                              {env}
                                            </Label>
                                          </Td>
                                          <Td>{ref}</Td>
                                          <Td>
                                            <a
                                              href={`https://${webProperties?.data?.[env]?.url}`}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <ExternalLinkAltIcon />{' '}
                                              {webProperties?.data?.[env]?.url}
                                            </a>
                                          </Td>

                                          <Td>
                                            <a
                                              href={accessUrl}
                                              target="_blank"
                                              rel="noopener noreferrer"
                                            >
                                              <ExternalLinkAltIcon />{' '}
                                              {`${accessUrl.slice(0, URL_LENGTH_LIMIT)} ${
                                                accessUrl.length > URL_LENGTH_LIMIT ? '...' : ''
                                              }`}
                                            </a>
                                          </Td>
                                          <Td>
                                            {formatDate(updatedAt, 'MMM DD, YYYY - hh:mm:ss A')}
                                          </Td>
                                        </Tr>
                                      )
                                    )}
                                  </Tbody>
                                </TableComposable>
                              </ExpandableRowContent>
                            </Td>
                          </Tr>
                        </Tbody>
                      ))}
                </TableComposable>
              </>
            )}
          </Tab>
          <Tab
            eventKey={1}
            title={
              <>
                <TabTitleIcon>
                  <RunningIcon />
                </TabTitleIcon>
                <TabTitleText>Activity Stream</TabTitleText>{' '}
              </>
            }
            aria-label="SPA activity"
          >
          
            <List>
              
              <ActivityStream propertyIdentifier={propertyIdentifier}  applicationIdentifier="" action=''/>
            </List>
          </Tab>
          <Tab
            eventKey={2}
            title={
              <>
                <TabTitleIcon>
                  <CubeIcon />
                </TabTitleIcon>
                <TabTitleText>
                  Ephemeral Preview{' '}
                  <Badge isRead={!ephemeralPreview.data?.length}>
                    {ephemeralPreview.data?.length}
                  </Badge>
                </TabTitleText>
              </>
            }
            aria-label="Ephemeral Environment"
          >
            <Ephemeral
              isSuccess={ephemeralPreview.isSuccess}
              ephemeralEnvs={ephemeralPreview.data}
            />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
