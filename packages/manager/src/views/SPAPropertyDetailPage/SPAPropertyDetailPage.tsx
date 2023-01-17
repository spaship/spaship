/* eslint-disable no-underscore-dangle */
import { useMemo } from 'react';
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateIcon,
  Level,
  LevelItem,
  List,
  PageSection,
  Skeleton,
  Split,
  SplitItem,
  Tab,
  Tabs,
  TabTitleIcon,
  TabTitleText,
  Title
} from '@patternfly/react-core';
import Link from 'next/link';
import dayjs from 'dayjs';
import { useRouter } from 'next/router';

import { CogIcon, CubesIcon, PackageIcon, RunningIcon } from '@patternfly/react-icons';
import {
  Chart,
  ChartAxis,
  ChartDonut,
  ChartGroup,
  ChartLine,
  ChartVoronoiContainer
} from '@patternfly/react-charts';
import {
  useGetMonthlyDeploymentChart,
  useGetTotalDeploymentsForApps
} from '@app/services/analytics';
import { useTabs } from '@app/hooks';
import { Banner } from '@app/components';
import { pageLinks } from '@app/links';
import toast from 'react-hot-toast';
import { ActivityStream } from '@app/components/ActivityStream';

export const SPAPropertyDetailPage = (): JSX.Element => {
  const router = useRouter();
  const propertyIdentifier = router.query.propertyIdentifier as string;
  const spaProperty = router.query.spaProperty as string;

  const deploymentCount = useGetTotalDeploymentsForApps(propertyIdentifier, spaProperty);
  const monthlyDeployChart = useGetMonthlyDeploymentChart(propertyIdentifier, spaProperty);
  if (deploymentCount.isError === true) {
    toast.error(`Sorry cannot find ${spaProperty}`);
    router.push(`/properties/${propertyIdentifier}`);
  }

  const { handleTabChange, openTab } = useTabs(2);

  // TODO: Backend must sort this before giving
  const sortedDeployCount = deploymentCount?.data?.sort((x, y) => x.count - y.count);
  const donutChartData = useMemo(
    () => ({
      data: sortedDeployCount?.map(({ env, count }) => ({
        x: env,
        y: count
      })),
      names: sortedDeployCount?.map(({ env, count }) => ({
        name: `${env} ${count}`
      })),
      total: sortedDeployCount?.reduce((prev, curr) => curr.count + prev, 0)
    }),
    [sortedDeployCount]
  );

  const lineChartLegend = Object.keys(monthlyDeployChart?.data || {}).map((key) => ({ name: key }));

  return (
    <>
      <Banner
        title={propertyIdentifier.replace('-', ' ')}
        backRef={{
          pathname: pageLinks.webPropertyDetailPage,
          query: {
            propertyIdentifier
          }
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
                <TabTitleText>Dashboard</TabTitleText>
              </>
            }
            aria-label="SPA listing"
          >
            <Split hasGutter className="pf-u-mt-md">
              <SplitItem isFilled>
                <Card isFullHeight style={{ height: '320px' }}>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h6">Total Deployments</Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="x-y-center pf-u-h-100">
                    {deploymentCount.isLoading && <Skeleton shape="circle" width="160px" />}
                    {!deploymentCount.isLoading && !deploymentCount.data && (
                      <EmptyState>
                        <EmptyStateIcon icon={CubesIcon} />
                        <Title headingLevel="h4" size="lg">
                          No deployments found
                        </Title>
                      </EmptyState>
                    )}
                    {deploymentCount.isSuccess && (
                      <ChartDonut
                        ariaTitle="Number of deployments"
                        constrainToVisibleArea
                        data={donutChartData.data}
                        labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                        legendData={donutChartData.names}
                        legendOrientation="vertical"
                        legendPosition="right"
                        name="monthly-deployment"
                        padding={{
                          bottom: 40,
                          left: 20,
                          right: 140, // Adjusted to accommodate legend
                          top: 20
                        }}
                        subTitle="Deployments"
                        title={`${donutChartData.total}`}
                        width={320}
                        height={220}
                      />
                    )}
                  </CardBody>
                </Card>
              </SplitItem>
              <SplitItem isFilled>
                <Card isFullHeight style={{ height: '320px' }}>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h6">Deployment History</Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="x-y-center pf-u-h-100 ">
                    {monthlyDeployChart.isLoading && <Skeleton height="160px" width="90%" />}
                    {!monthlyDeployChart.isLoading && !monthlyDeployChart.data && (
                      <EmptyState>
                        <EmptyStateIcon icon={CubesIcon} />
                        <Title headingLevel="h4" size="lg">
                          No History found
                        </Title>
                      </EmptyState>
                    )}
                    {monthlyDeployChart.isSuccess && (
                      <Chart
                        ariaDesc="Average number of pets"
                        ariaTitle="Line chart example"
                        containerComponent={
                          <ChartVoronoiContainer
                            labels={({ datum }) => `${datum.name}: ${datum.y}`}
                            constrainToVisibleArea
                          />
                        }
                        legendData={lineChartLegend}
                        legendOrientation="vertical"
                        legendPosition="right"
                        name="chart1"
                        minDomain={0}
                        padding={{
                          bottom: 100,
                          left: 50,
                          right: 100, // Adjusted to accommodate legend
                          top: 50
                        }}
                        width={700}
                      >
                        <ChartAxis />
                        <ChartAxis dependentAxis showGrid tickFormat={(x) => Number(x)} />
                        <ChartGroup>
                          {lineChartLegend.map(({ name }) => (
                            <ChartLine
                              key={`key-${name}`}
                              data={monthlyDeployChart?.data?.[name].map(
                                ({ count, startDate, endDate }) => ({
                                  name,
                                  x: `${dayjs(startDate).format('DD MMM')} - ${dayjs(
                                    endDate
                                  ).format('DD MMM')}`,
                                  y: count
                                })
                              )}
                            />
                          ))}
                        </ChartGroup>
                      </Chart>
                    )}
                  </CardBody>
                </Card>
              </SplitItem>
            </Split>
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
            <List className="pf-u-mt-lg">
              <ActivityStream
                propertyIdentifier={propertyIdentifier}
                applicationIdentifier={spaProperty}
                action=" "
              />
            </List>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
