import { useRouter } from 'next/router';
import {
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
  Skeleton,
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

import { Banner } from '@app/components';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import { useGetWebPropertyGroupedByEnv } from '@app/services/webProperty';
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
import { CogIcon, PackageIcon, RunningIcon, SearchIcon } from '@patternfly/react-icons';
import { useState } from 'react';
import { useFormatDate, useTabs } from '@app/hooks';
import { useGetWebPropActivityStream } from '@app/services/analytics';
import Link from 'next/link';

const URL_LENGTH_LIMIT = 25;

const TableRowSkeleton = () => (
  <Tr>
    <Td>
      <Skeleton height="20px" width="50%" />
    </Td>
    <Td>
      <Skeleton height="20px" width="10%" />
    </Td>
    <Td>
      <Skeleton height="20px" width="10%" />
    </Td>
    <Td>
      <Skeleton height="20px" width="100%" />
    </Td>
  </Tr>
);

export const WebPropertyDetailPage = (): JSX.Element => {
  const { query } = useRouter();
  const [isRowExpanded, setIsRowExpanded] = useState<Record<string, boolean>>({});
  const propertyName = (query?.propertyName as string) || '';
  const formatDate = useFormatDate();
  const { openTab, handleTabChange } = useTabs(2);

  // api calls
  const spaProperties = useGetSPAPropGroupByName(propertyName);
  const webProperties = useGetWebPropertyGroupedByEnv(propertyName);
  const activityStream = useGetWebPropActivityStream(propertyName);

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
      <Banner>
        <Level>
          <LevelItem>
            <Title headingLevel="h1" size="2xl">
              Ecosystem Catalog
            </Title>
          </LevelItem>
          <LevelItem>
            <Link
              href={{ pathname: '/properties/[propertyName]/settings', query: { propertyName } }}
            >
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
              {((spaProperties.isSuccess && isSpaPropertyListEmpty) || spaProperties.isLoading) && (
                <Tbody>
                  {spaProperties.isLoading &&
                    Array.apply(0, Array(3)).map((x, i) => (
                      <TableRowSkeleton key={`spa=prop-loading-${i + 1}`} />
                    ))}
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
                spaPropertyKeys.map((name, rowIndex) => (
                  <Tbody isExpanded={Boolean(isRowExpanded?.[name])} key={name}>
                    <Tr isStriped={Boolean(rowIndex % 2)}>
                      <Td
                        expand={{
                          rowIndex,
                          isExpanded: Boolean(isRowExpanded?.[name]),
                          onToggle: () => onToggleRowExpanded(name),
                          expandId: 'composable-property-table'
                        }}
                      />
                      <Td>
                        <Link
                          href={{
                            pathname: '/properties/[propertyName]/[spaProperty]',
                            query: { propertyName, spaProperty: name }
                          }}
                        >
                          {name}
                        </Link>
                      </Td>
                      <Td>{spaProperties.data[name]?.[0].path}</Td>
                      <Td>
                        <Split hasGutter>
                          {spaProperties.data[name].map(({ id, env }) => (
                            <SplitItem key={id}>
                              <Label color="gold" isCompact>
                                {env}
                              </Label>
                            </SplitItem>
                          ))}
                        </Split>
                      </Td>
                    </Tr>
                    <Tr isExpanded={Boolean(isRowExpanded?.[name])}>
                      <Td colSpan={4} noPadding={false}>
                        <ExpandableRowContent>
                          <TableComposable variant="compact" aria-label="expandable-table">
                            <Thead>
                              <Tr>
                                <Th>Environment Name</Th>
                                <Th>Ref</Th>
                                <Th>URL</Th>
                                <Th>Internal Access URL</Th>
                                <Th>Updated At</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {spaProperties?.data?.[name].map((prop) => (
                                <Tr key={`expandable-property${prop.id}`}>
                                  <Td>
                                    <Label color="gold" isCompact>
                                      {prop.env}
                                    </Label>
                                  </Td>
                                  <Td>{prop.ref}</Td>
                                  <Td>{webProperties?.data?.[prop.env].url}</Td>
                                  <Td>
                                    {`${prop.accessUrl.slice(0, 25)} ${
                                      prop.accessUrl.length > URL_LENGTH_LIMIT ? '...' : ''
                                    }`}
                                  </Td>
                                  <Td>{formatDate(prop.updatedAt, 'MMM DD, YYYY - hh:mm:ss A')}</Td>
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
                      description={formatDate(activity.createdAt, 'MMM DD, hh:mm a')}
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
        </Tabs>
      </PageSection>
    </>
  );
};
