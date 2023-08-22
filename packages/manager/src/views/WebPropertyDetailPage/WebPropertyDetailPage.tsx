import { useEffect, useState } from 'react';
import Link from 'next/link';
import Router, { useRouter } from 'next/router';
import {
  Badge,
  Button,
  Label,
  Level,
  LevelItem,
  PageSection,
  SearchInput,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleIcon,
  TabTitleText,
  Select,
  SelectOption,
  SelectVariant,
  Modal,
  ModalVariant,
  Spinner,
  Tooltip
} from '@patternfly/react-core';

import { Banner, TableRowSkeleton } from '@app/components';
import { useGetSPAPropGroupByName, useGetSPAProperties } from '@app/services/spaProperty';
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
  GithubIcon,
  PackageIcon,
  PlusCircleIcon,
  TimesCircleIcon
} from '@patternfly/react-icons';
import { useDebounce, useFormatDate, useTabs, useToggle, usePopUp } from '@app/hooks';
import { pageLinks } from '@app/links';

import toast from 'react-hot-toast';
import { Ephemeral } from './components/Ephemeral';
import { EmptyInfo } from './components/EmptyInfo';
import { Dashboard } from './components/Dashboard';
import { AddDeplyoment } from './components/addDeployment';
import { Access } from './components/SSR/Access';

const URL_LENGTH_LIMIT = 100;
const INTERNAL_ACCESS_URL_LENGTH = 25;

export const WebPropertyDetailPage = (): JSX.Element => {
  const { query } = useRouter();
  const [isRowExpanded, setIsRowExpanded] = useState<Record<string, boolean>>({});
  const [searchTerm, setSearchTerm] = useState('');
  const [filterByEnv, setFilterByEnv] = useState('');
  const propertyIdentifier = (query?.propertyIdentifier as string) || '';
  const formatDate = useFormatDate();
  const { openTab, handleTabChange } = useTabs(4);
  const debouncedSearchTerm = useDebounce(searchTerm, 200);
  const [isFilterOpen, setIsFilterOpen] = useToggle();

  // api calls
  const spaProperties = useGetSPAPropGroupByName(propertyIdentifier, filterByEnv);
  const webProperties = useGetWebPropertyGroupedByEnv(propertyIdentifier);
  const ephemeralPreview = useGetEphemeralListForProperty(propertyIdentifier);
  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;
  const webPropertiesKeys = Object.keys(webProperties.data || {});
  const countOfSpas = useGetSPAProperties(propertyIdentifier, '');
  const isCountOfSpasListEmpty = Object.keys(countOfSpas).length === 0;

  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['createSSRDeployment'] as const);

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
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-xl">
        <Tabs
          activeKey={openTab}
          onSelect={(_, tab) => handleTabChange(tab as number)}
          style={{ backgroundColor: '#fff' }}
        >
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
            {!spaProperties.isLoading &&
            !isCountOfSpasListEmpty &&
            Object.values(countOfSpas.data || {}).length === 0 ? (
              <>
                <Split hasGutter className="pf-u-mt-md">
                  <Button
                    onClick={() => handlePopUpOpen('createSSRDeployment')}
                    icon={<PlusCircleIcon />}
                  >
                    Add New App
                  </Button>
                </Split>
                <EmptyInfo propertyIdentifier={propertyIdentifier} />
              </>
            ) : (
              <>
                <div className="pf-u-w-70 pf-u-mb-lg pf-u-mt-md">
                  <Split hasGutter className="pf-u-mb-md">
                    <SplitItem>
                      <Button
                        onClick={() => handlePopUpOpen('createSSRDeployment')}
                        icon={<PlusCircleIcon />}
                      >
                        Add New App
                      </Button>
                    </SplitItem>

                    <SplitItem>
                      {' '}
                      <SearchInput
                        placeholder="Search by name"
                        value={searchTerm}
                        onChange={(value) => setSearchTerm(value?.toLowerCase())}
                        onClear={() => setSearchTerm('')}
                      />
                    </SplitItem>

                    <SplitItem>
                      <Select
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
                    <SplitItem
                      isFilled
                      style={{
                        display: 'flex',
                        justifyContent: 'flex-end'
                      }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            marginRight: '8px',
                            height: '12px',
                            width: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'var(--pf-global--default-color--200)'
                          }}
                        />
                        <span>Containerized Deployment</span>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', marginLeft: '16px' }}>
                        <span
                          style={{
                            display: 'inline-block',
                            marginRight: '8px',
                            height: '12px',
                            width: '12px',
                            borderRadius: '50%',
                            backgroundColor: 'gold'
                          }}
                        />
                        <span>Static Deployment</span>
                      </div>
                    </SplitItem>
                  </Split>
                  {filterByEnv === 'Select Environment' || filterByEnv === '' ? (
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
                  <TableComposable aria-label="spa-property-list">
                    <>
                      <Caption>SPA&apos;s DEPLOYED</Caption>
                      <Thead noWrap>
                        <Tr>
                          <Th />
                          <Th>Name</Th>
                          <Th textCenter>URL Path</Th>
                          <Th>Environments</Th>
                        </Tr>
                      </Thead>
                    </>

                    {(spaProperties.isLoading && webProperties.isLoading) ||
                    (spaProperties.isLoading && isSpaPropertyListEmpty) ? (
                      <TableRowSkeleton rows={3} columns={4} />
                    ) : (
                      spaProperties.isSuccess &&
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
                              <Td style={{ maxWidth: '25ch', wordWrap: 'break-word' }}>
                                <Link
                                  href={{
                                    pathname: '/properties/[propertyIdentifier]/[spaProperty]',
                                    query: { propertyIdentifier, spaProperty: identifier }
                                  }}
                                >
                                  {`${spaProperties.data[identifier]?.[0]?.name.slice(
                                    0,
                                    URL_LENGTH_LIMIT
                                  )} ${
                                    spaProperties.data[identifier]?.[0]?.name.length >
                                    URL_LENGTH_LIMIT
                                      ? '...'
                                      : ''
                                  }`}
                                </Link>
                              </Td>
                              <Td textCenter style={{ maxWidth: '25ch', wordWrap: 'break-word' }}>
                                {`${spaProperties.data[identifier]?.[0]?.path?.slice(
                                  0,
                                  URL_LENGTH_LIMIT
                                )} ${
                                  spaProperties.data[identifier]?.[0]?.path?.length >
                                  URL_LENGTH_LIMIT
                                    ? '...'
                                    : ''
                                }`}
                              </Td>
                              <Td textCenter style={{ wordWrap: 'break-word' }}>
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
                            </Tr>
                            <Tr isExpanded={Boolean(isRowExpanded?.[identifier])}>
                              <Td colSpan={4} noPadding={false} textCenter>
                                <ExpandableRowContent>
                                  <TableComposable aria-label="expandable-table">
                                    <Thead noWrap>
                                      <Tr>
                                        <Th textCenter>Environment Name</Th>
                                        <Th textCenter>Ref</Th>
                                        <Th textCenter>Publish Domain</Th>
                                        <Th textCenter>Internal Access URL</Th>
                                        <Th textCenter>Updated At</Th>
                                      </Tr>
                                    </Thead>
                                    <Tbody>
                                      {spaProperties?.data?.[identifier].map(
                                        ({
                                          _id,
                                          env,
                                          ref,
                                          isContainerized,
                                          accessUrl,
                                          updatedAt
                                        }) => (
                                          <Tr key={_id}>
                                            <Td
                                              textCenter
                                              style={{ maxWidth: '20ch', wordWrap: 'break-word' }}
                                            >
                                              <Label
                                                color={isContainerized ? 'cyan' : 'gold'}
                                                isCompact
                                              >
                                                {env}
                                              </Label>
                                            </Td>
                                            <Td
                                              textCenter
                                              style={{ maxWidth: '20ch', wordWrap: 'break-word' }}
                                            >
                                              {`${ref.slice(0, URL_LENGTH_LIMIT)} ${
                                                ref.length > URL_LENGTH_LIMIT ? '...' : ''
                                              }`}
                                            </Td>
                                            <Td
                                              textCenter
                                              style={{ maxWidth: '20ch', wordWrap: 'break-word' }}
                                            >
                                              <a
                                                href={`https://${webProperties?.data?.[env]?.url}`}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                              >
                                                {`${webProperties?.data?.[env]?.url.slice(
                                                  0,
                                                  URL_LENGTH_LIMIT
                                                )} ${
                                                  webProperties?.data?.[env]?.url &&
                                                  webProperties?.data?.[env]?.url.length >
                                                    URL_LENGTH_LIMIT
                                                    ? '...'
                                                    : ''
                                                }`}
                                              </a>
                                            </Td>
                                            <Td
                                              textCenter
                                              style={{ maxWidth: '20ch', wordWrap: 'break-word' }}
                                            >
                                              {accessUrl?.map((access_url: string) => (
                                                <div key={access_url}>
                                                  {access_url === 'NA' ? (
                                                    <Spinner isSVG diameter="30px" />
                                                  ) : (
                                                    <div style={{ textAlign: 'center' }}>
                                                      <Tooltip
                                                        className="my-custom-tooltip"
                                                        content={
                                                          <div>
                                                            <a
                                                              className="text-decoration-none"
                                                              href={access_url}
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                            >
                                                              {access_url}
                                                            </a>
                                                          </div>
                                                        }
                                                      >
                                                        <a
                                                          href={access_url}
                                                          target="_blank"
                                                          rel="noopener noreferrer"
                                                          style={{
                                                            textDecoration: 'none',
                                                            marginRight: '8px'
                                                          }}
                                                        >
                                                          {`${access_url.slice(
                                                            0,
                                                            INTERNAL_ACCESS_URL_LENGTH
                                                          )} ${
                                                            access_url.length >
                                                            INTERNAL_ACCESS_URL_LENGTH
                                                              ? '...'
                                                              : ''
                                                          }`}
                                                        </a>
                                                      </Tooltip>{' '}
                                                      <Access link={access_url} _id={String(_id)} />
                                                    </div>
                                                  )}
                                                </div>
                                              ))}
                                            </Td>
                                            <Td textCenter>
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
                        ))
                    )}
                  </TableComposable>
                )}
              </>
            )}
          </Tab>

          <Tab
            eventKey={1}
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
          <Tab
            eventKey={2}
            title={
              <>
                <TabTitleIcon>
                  <PackageIcon />
                </TabTitleIcon>
                <TabTitleText>Dashboard</TabTitleText>
              </>
            }
            aria-label="Dashboard"
          >
            <Dashboard type="web-property" />
          </Tab>
        </Tabs>
      </PageSection>

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
    </>
  );
};
