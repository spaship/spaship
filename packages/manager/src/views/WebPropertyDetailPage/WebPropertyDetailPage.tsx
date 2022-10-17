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
  ProgressStep,
  ProgressStepper,
  SearchInput,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleIcon,
  TabTitleText,
  Text,
  TextContent,
  TextVariants,
  Title
} from '@patternfly/react-core';

import { Banner, TableRowSkeleton } from '@app/components';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { useGetWebPropertyGroupedByEnv } from '@app/services/webProperty';
import { useGetEphemeralList } from '@app/services/ephemeral';
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
  SearchIcon
} from '@patternfly/react-icons';
import { useDebounce, useFormatDate, useTabs } from '@app/hooks';
import { useGetWebPropActivityStream } from '@app/services/analytics';
import { pageLinks } from '@app/links';

import toast from 'react-hot-toast';
import { Ephemeral } from './components/Ephemeral';
import { EmptyInfo } from './components/EmptyInfo';

const URL_LENGTH_LIMIT = 50;

export const WebPropertyDetailPage = (): JSX.Element => {
  const { query } = useRouter();
  const [isRowExpanded, setIsRowExpanded] = useState<Record<string, boolean>>({});
  const propertyName = (query?.propertyName as string) || '';
  const formatDate = useFormatDate();
  // TODO: To be removed once backend has a date standard
  const dateFormatter = (date: string) =>
    formatDate(`${date.slice(9)} ${date.split(' ')[0]}`, 'MMM DD, hh:mm a');
  const { openTab, handleTabChange } = useTabs(3);
  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 200);

  // api calls
  const spaProperties = useGetSPAPropGroupByName(propertyName);
  const webProperties = useGetWebPropertyGroupedByEnv(propertyName);
  const activityStream = useGetWebPropActivityStream(propertyName);
  const ephemeralPreview = useGetEphemeralList(propertyName);

  useEffect(() => {
    if (spaProperties.isError) {
      toast.error(`Sorry cannot find ${propertyName}`);
      Router.push('/properties');
    }
  }, [spaProperties.isError, propertyName]);

  const spaPropertyKeys = Object.keys(spaProperties.data || {});
  const isSpaPropertyListEmpty = spaPropertyKeys.length === 0;

  const onToggleRowExpanded = (name: string) => {
    const state = { ...isRowExpanded };
    if (state?.[name]) {
      state[name] = !state[name];
    } else {
      state[name] = true;
    }
    setIsRowExpanded(state);
  };

  return (
    <>
      <Banner
        title={propertyName.replace('-', ' ')}
        backRef={{
          pathname: pageLinks.webPropertyListPage
        }}
      >
        <Level>
          <LevelItem />
          <LevelItem>
            <Link href={{ pathname: pageLinks.webPropertySettingPage, query: { propertyName } }}>
              <a>
                <Button variant="link" icon={<CogIcon />}>
                  Settings
                </Button>
              </a>
            </Link>
          </LevelItem>
        </Level>
      </Banner>
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-3xl">
        <div className="pf-u-w-33 pf-u-mb-lg">
          <SearchInput
            placeholder="Search by name"
            value={searchTerm}
            onChange={(value) => setSearchTerm(value?.toLowerCase())}
            onClear={() => setSearchTerm('')}
          />
        </div>
        {!spaProperties.isLoading && isSpaPropertyListEmpty ? (
          <EmptyInfo propertyName={propertyName} />
        ) : (
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
                  spaProperties.isLoading) && (
                  <Tbody>
                    {spaProperties.isLoading && <TableRowSkeleton rows={3} columns={4} />}
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
                                pathname: '/properties/[propertyName]/[spaProperty]',
                                query: { propertyName, spaProperty: identifier }
                              }}
                            >
                              {spaProperties.data[identifier]?.[0]?.name}
                            </Link>
                          </Td>
                          <Td>{spaProperties.data[identifier]?.[0]?.path}</Td>
                          <Td>
                            <Split hasGutter>
                              {spaProperties.data[identifier].map(({ id, env }) => (
                                <SplitItem key={id}>
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
                                  {spaProperties?.data?.[identifier].map((prop) => (
                                    <Tr key={`expandable-property${prop.id}`}>
                                      <Td>
                                        <Label color="gold" isCompact>
                                          {prop.env}
                                        </Label>
                                      </Td>
                                      <Td>{prop.ref}</Td>
                                      <Td>
                                        <a
                                          href={`https://${webProperties?.data?.[prop.env]?.url}`}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <ExternalLinkAltIcon />{' '}
                                          {webProperties?.data?.[prop.env]?.url}
                                        </a>
                                      </Td>

                                      <Td>
                                        <a
                                          href={prop.accessUrl}
                                          target="_blank"
                                          rel="noopener noreferrer"
                                        >
                                          <ExternalLinkAltIcon />{' '}
                                          {`${prop.accessUrl.slice(0, URL_LENGTH_LIMIT)} ${
                                            prop.accessUrl.length > URL_LENGTH_LIMIT ? '...' : ''
                                          }`}
                                        </a>
                                      </Td>
                                      <Td>
                                        {formatDate(prop.updatedAt, 'MMM DD, YYYY - hh:mm:ss A')}
                                      </Td>
                                    </Tr>
                                  ))}
                                </Tbody>
                              </TableComposable>
                            </ExpandableRowContent>
                          </Td>
                        </Tr>
                      </Tbody>
                    ))}
              </TableComposable>
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
                <ProgressStepper isVertical>
                  {activityStream?.data?.map((activity) => {
                    // This should be changed to more activities in the future.
                    const variant = activity.code === 'WEBSITE_CREATED' ? 'success' : 'danger';
                    return (
                      <ProgressStep
                        id={activity.id}
                        titleId={activity.id}
                        key={activity.id}
                        variant={variant}
                        // Description does not support elements yet. Hence they are rendered as text.
                        description={dateFormatter(activity.createdAt)}
                      >
                        <TextContent className="pf-u-mb-sm">
                          <Text component={TextVariants.small}>
                            <Label color="blue" isCompact>
                              {activity.spaName}
                            </Label>{' '}
                            has been deployed for
                            <Label color="blue" isCompact>
                              {activity.propertyName}
                            </Label>{' '}
                            on {activity.env}
                          </Text>
                        </TextContent>
                      </ProgressStep>
                    );
                  })}
                </ProgressStepper>
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
        )}
      </PageSection>
    </>
  );
};
