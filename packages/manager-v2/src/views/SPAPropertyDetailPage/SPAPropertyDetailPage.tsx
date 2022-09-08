import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  Label,
  Level,
  LevelItem,
  List,
  PageSection,
  ProgressStep,
  ProgressStepper,
  Spinner,
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
import Link from 'next/link';
import { CogIcon, PackageIcon, RunningIcon } from '@patternfly/react-icons';
import {
  Chart,
  ChartAxis,
  ChartDonut,
  ChartGroup,
  ChartLine,
  ChartVoronoiContainer
} from '@patternfly/react-charts';
import { useRouter } from 'next/router';
import {
  useGetMonthyDeploymentChart,
  useGetTotalDeployments,
  useGetWebPropActivityStream
} from '@app/services/analytics';
import { useFormatDate, useTabs } from '@app/hooks';
import { useMemo } from 'react';
import dayjs from 'dayjs';

export const SPAPropertyDetailPage = (): JSX.Element => {
  const router = useRouter();
  const formatDate = useFormatDate();
  const propertyName = router.query.propertyName as string;
  const spaProperty = router.query.spaProperty as string;

  const deploymentCount = useGetTotalDeployments(propertyName, spaProperty);
  const monthyDeployChart = useGetMonthyDeploymentChart(propertyName, spaProperty);
  const activityStream = useGetWebPropActivityStream(propertyName, spaProperty);

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
      }))
    }),
    [sortedDeployCount]
  );

  const lineChartLegend = Object.keys(monthyDeployChart?.data || {}).map((key) => ({ name: key }));

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
                <TabTitleText>Dashboard</TabTitleText>
              </>
            }
            aria-label="SPA listing"
          >
            <Split hasGutter className="pf-u-mt-md">
              <SplitItem isFilled>
                <Card style={{ maxWidth: '100%' }} isFullHeight>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h6">Total Deployments</Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody className="x-y-center">
                    {deploymentCount.isLoading && (
                      <Bullseye>
                        <Spinner size="lg" />
                      </Bullseye>
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
                        name="chart2"
                        padding={{
                          bottom: 20,
                          left: 20,
                          right: 140, // Adjusted to accommodate legend
                          top: 20
                        }}
                        subTitle="Deployments"
                        title="100"
                        width={350}
                      />
                    )}
                  </CardBody>
                </Card>
              </SplitItem>
              <SplitItem isFilled>
                <Card>
                  <CardHeader>
                    <CardTitle>
                      <Title headingLevel="h6">Deployment History</Title>
                    </CardTitle>
                  </CardHeader>
                  <CardBody>
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
                      height={250}
                      name="chart1"
                      padding={{
                        bottom: 50,
                        left: 50,
                        right: 200, // Adjusted to accommodate legend
                        top: 50
                      }}
                      width={600}
                    >
                      <ChartAxis tickFormat={(y) => dayjs(y).format('DD MMM')} />
                      <ChartAxis dependentAxis showGrid tickFormat={(x) => Number(x)} />
                      <ChartGroup>
                        {lineChartLegend.map(({ name }) => (
                          <ChartLine
                            key={`key-${name}`}
                            data={monthyDeployChart?.data?.[name].map(({ count, startDate }) => ({
                              name,
                              x: startDate,
                              y: count
                            }))}
                          />
                        ))}
                      </ChartGroup>
                    </Chart>
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
