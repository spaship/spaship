/* eslint-disable no-underscore-dangle */
import {
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateIcon,
  Grid,
  GridItem,
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
import dayjs from 'dayjs';
import { useRouter } from 'next/router';
import { useMemo } from 'react';

import { Banner } from '@app/components';
import { ActivityStream } from '@app/components/ActivityStream';
import { useTabs } from '@app/hooks';
import { pageLinks } from '@app/links';
import {
  useGetHalfYearlyDeploymentsTime,
  useGetMonthlyDeploymentChart,
  useGetMonthlyDeploymentsTime,
  useGetQuarterlyDeploymentsTime,
  useGetTotalDeploymentsForApps,
  useGetYearlyDeploymentsTime
} from '@app/services/analytics';
import {
  Chart,
  ChartAxis,
  ChartDonut,
  ChartGroup,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer
} from '@patternfly/react-charts';
import {
  BuildIcon,
  BundleIcon,
  CogIcon,
  CubesIcon,
  PackageIcon,
  RunningIcon
} from '@patternfly/react-icons';
import toast from 'react-hot-toast';
import { SSRDetails } from '../WebPropertyDetailPage/components/SSR/SSRDetails';
import { StaticDeployment } from '../WebPropertyDetailPage/components/SSR/StaticDeployment';

const TotalDeploymentCardFields = ['Dev', 'QA', 'Stage', 'Prod'];
const DeploymentTimeFrames = ['30 days', '90 days', '180 days', '365 days'];
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

  const { handleTabChange, openTab } = useTabs(4);

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
  const TotalDeployment = deploymentCount.data?.reduce((acc, obj) => acc + obj.count, 0);

  const averageDeploymentTime = [
    useGetMonthlyDeploymentsTime(propertyIdentifier, spaProperty).data,
    useGetQuarterlyDeploymentsTime(propertyIdentifier, spaProperty).data,
    useGetHalfYearlyDeploymentsTime(propertyIdentifier, spaProperty).data,
    useGetYearlyDeploymentsTime(propertyIdentifier, spaProperty).data
  ];

  const bestDeploymentFiltered = averageDeploymentTime.filter((e) => e);
  const bestDeploymentTime = Math.min(...bestDeploymentFiltered.map((time) => time || 0));
  const bestDeploymentTimeIndex = averageDeploymentTime.findIndex(
    (time) => time === bestDeploymentTime
  );
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
            <Button variant="link" icon={<CogIcon />}>
              Settings
            </Button>
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
                  <BuildIcon />
                </TabTitleIcon>
                <TabTitleText>Containerized Deployment</TabTitleText>{' '}
              </>
            }
            aria-label="SSR SPA Deployment"
          >
            <List className="pf-u-mt-lg">
              <SSRDetails />
            </List>
          </Tab>
          <Tab
            eventKey={1}
            title={
              <>
                <TabTitleIcon>
                  <BundleIcon />
                </TabTitleIcon>
                <TabTitleText>Static Deployment</TabTitleText>{' '}
              </>
            }
            aria-label="SSR SPA Deployment"
          >
            <List className="pf-u-mt-lg">
              <StaticDeployment />
            </List>
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
            aria-label="SPA listing"
          >
            <>
              <Grid style={{ padding: '12px 12px' }}>
                <GridItem span={6}>
                  <Card
                    isFullHeight
                    style={{
                      margin: '12px 12px',
                      overflow: 'auto',
                      scrollbarWidth: 'none',
                      height: '190px'
                    }}
                    isRounded
                  >
                    <CardTitle>Total Deployments</CardTitle>
                    <CardBody>
                      <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{TotalDeployment}</h1>
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '35px',
                          marginTop: '24px'
                        }}
                      >
                        {TotalDeploymentCardFields.map((field) => (
                          <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                            <h1 style={{ fontSize: '12px' }}>{field}</h1>
                            <h1 style={{ fontSize: '12px' }}>
                              {deploymentCount?.data
                                ?.filter((ele) => ele.env === field.toLocaleLowerCase())
                                .map((ele) => ele.count)
                                .reduce((a, b) => a + b, 0) ?? 0}
                            </h1>
                          </div>
                        ))}
                        <div style={{ display: 'flex', flexDirection: 'column' }}>
                          <h1 style={{ fontSize: '12px' }}>Others</h1>
                          <h1 style={{ fontSize: '12px' }}>
                            {deploymentCount.data
                              ?.filter(
                                (ele) =>
                                  !TotalDeploymentCardFields.map((str) =>
                                    str.toLocaleLowerCase()
                                  ).includes(ele.env)
                              )
                              .reduce((acc, ele) => acc + ele.count, 0) || 0}
                          </h1>
                        </div>
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
                <GridItem span={6}>
                  <Card
                    isFullHeight
                    style={{
                      margin: '12px 12px',
                      overflow: 'auto',
                      scrollbarWidth: 'none',
                      height: '190px'
                    }}
                    isRounded
                  >
                    <CardTitle>Average time to deploy</CardTitle>
                    <CardBody>
                      {bestDeploymentTime && bestDeploymentTime !== Infinity ? (
                        <div
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
                        >
                          <h1 style={{ color: '#0066CC', fontSize: '28px' }}>
                            {bestDeploymentTime}s
                          </h1>
                          <h1 style={{ fontSize: '14px', paddingLeft: '8px' }}>
                            in past {DeploymentTimeFrames[bestDeploymentTimeIndex]}
                          </h1>
                        </div>
                      ) : (
                        <div
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
                        >
                          <h1 style={{ color: '#0066CC', fontSize: '28px' }}>NA</h1>
                        </div>
                      )}
                      <div
                        style={{
                          display: 'flex',
                          flexDirection: 'row',
                          gap: '35px',
                          marginTop: '24px'
                        }}
                      >
                        {DeploymentTimeFrames.map((field, index) => (
                          <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                            <h1 style={{ fontSize: '12px' }}>{`Past ${field}`}</h1>
                            <h1 style={{ fontSize: '12px' }}>
                              {averageDeploymentTime[index]
                                ? `${averageDeploymentTime[index]}s`
                                : 'NA'}
                            </h1>
                          </div>
                        ))}
                      </div>
                    </CardBody>
                  </Card>
                </GridItem>
              </Grid>
              <Split
                hasGutter
                className="pf-u-mt-md"
                style={{ padding: '0px 12px 0px 12px', margin: '0px 12px 0px 12px' }}
              >
                <SplitItem isFilled>
                  <Card isFullHeight style={{ height: '320px' }}>
                    <CardHeader>
                      <CardTitle>
                        <Title headingLevel="h6">Total Deployments per Environment</Title>
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
                        <Title headingLevel="h6">Past 30 days Deployment History</Title>
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
                          themeColor={ChartThemeColor.multiUnordered}
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
            </>
          </Tab>
          <Tab
            eventKey={3}
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
                isGlobal={false}
              />
            </List>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
