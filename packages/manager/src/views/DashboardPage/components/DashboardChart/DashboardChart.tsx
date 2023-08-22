/* eslint-disable react/require-default-props */
import { useGetMonthlyDeploymentChartWithEphemeral } from '@app/services/analytics';
import { TSPADeploymentCount } from '@app/services/analytics/types';
import {
  Chart,
  ChartAxis,
  ChartBar,
  ChartDonut,
  ChartGroup,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer
} from '@patternfly/react-charts';
import {
  Card,
  CardBody,
  CardHeader,
  CardTitle,
  EmptyState,
  EmptyStateIcon,
  Grid,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  Skeleton,
  SplitItem,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextVariants,
  Title
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import { UseQueryResult } from '@tanstack/react-query';
import dayjs from 'dayjs';
import { MouseEvent, useEffect, useMemo, useState } from 'react';

type ITotalMonthlyDeploymentData = {
  [key: string]: {
    count: number;
    startDate: string;
    endDate: string;
  }[];
};
type Props = {
  TotalMonthlyDeploymentData: ITotalMonthlyDeploymentData;
  minCount: number;
  maxCount: number;
  TotalDeploymentData: UseQueryResult<TSPADeploymentCount[]>;
  propertyIdentifier: string;
  applicationIdentifier: string;
};

interface Result {
  x: string;
  y: number;
}
interface DataItem {
  count: number;
  env: string;
}
const DATE_FORMAT = 'DD MMM';
export const DashboardChart = ({
  TotalMonthlyDeploymentData,
  minCount,
  maxCount,
  TotalDeploymentData,
  propertyIdentifier,
  applicationIdentifier
}: Props) => {
  const lineChartLegend = Object.keys(TotalMonthlyDeploymentData || {}).map((key) => ({
    name: key
  }));
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [previous, setPrevious] = useState<string>('');

  const { refetch } = useGetMonthlyDeploymentChartWithEphemeral(
    propertyIdentifier,
    applicationIdentifier,
    previous
  );

  useEffect(() => {
    refetch();
  }, [refetch, previous]);

  const onToggle = (isSelectOpen: boolean) => {
    setIsOpen(isSelectOpen);
  };
  const clearSelection = () => {
    setPrevious('');
    setIsOpen(false);
  };

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      setPrevious(selection as string);
      setIsOpen(false);
    }
  };

  const handleTabClick = (
    event: MouseEvent<any> | KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };
  const sortedDeployCount = TotalDeploymentData?.data?.sort((x, y) => x.count - y.count);
  const donutChartAggregatedData: Result[] = sortedDeployCount?.reduce(
    (acc: Result[], { count, env }: DataItem) => {
      if (['dev', 'qa', 'stage', 'prod'].includes(env)) {
        const existingIndex = acc.findIndex((item) => item.x === env);
        if (existingIndex !== -1) {
          acc[existingIndex].y += count;
        } else {
          acc.push({ x: env, y: count });
        }
      } else {
        const otherItem = acc.find((item) => item.x === 'other');
        if (otherItem) {
          otherItem.y += count;
        } else {
          acc.push({ x: 'other', y: count });
        }
      }
      return acc;
    },
    []
  ) as Result[];

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

  const legendValues: any = [];

  donutChartAggregatedData?.forEach((item: Result) => {
    legendValues.push({ name: item.x });
  });

  const EmptyChart = (
    <EmptyState>
      <EmptyStateIcon icon={CubesIcon} />
      <Title headingLevel="h4" size="lg">
        No Deployment data found
      </Title>
    </EmptyState>
  );

  return (
    <Grid>
      <Card
        isSelectable
        isFullHeight
        style={{
          margin: '0px 24px 24px 24px',
          overflow: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        <CardHeader>
          <SplitItem>
            <CardTitle>
              <Text component={TextVariants.h5}>Deployment</Text>
            </CardTitle>
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Select
              variant={SelectVariant.single}
              isPlain
              aria-label="Select Input with descriptions"
              onToggle={onToggle}
              onSelect={onSelect}
              selections={previous}
              isOpen={isOpen}
            >
              <SelectOption key={0} value="1" isPlaceholder>
                Past 30 Days
              </SelectOption>
              <SelectOption key={1} value="3">
                Past 3 months
              </SelectOption>
              <SelectOption key={2} value="6">
                Past 6 Months
              </SelectOption>
            </Select>
          </SplitItem>
        </CardHeader>
        <CardBody style={{ paddingBottom: '0px' }}>
          <Tabs activeKey={activeTabKey} onSelect={handleTabClick}>
            <Tab
              eventKey={0}
              title={<TabTitleText>Bar Chart</TabTitleText>}
              aria-label="deployment-chart"
            >
              {lineChartLegend.some(
                ({ name }) => TotalMonthlyDeploymentData?.[name]?.length > 0
              ) ? (
                <Chart
                  ariaDesc="Number of deployments per env"
                  ariaTitle="Number of deployments per env"
                  containerComponent={
                    <ChartVoronoiContainer
                      labels={({ datum }) => `${datum.name}: ${datum.y}`}
                      constrainToVisibleArea
                    />
                  }
                  domain={{ y: [0, maxCount + (maxCount - minCount) * 0.2] }}
                  minDomain={{ y: 0 }}
                  domainPadding={{ x: [50, 25] }}
                  legendData={lineChartLegend}
                  legendOrientation="vertical"
                  legendPosition="right"
                  height={300}
                  name="chart1"
                  padding={{
                    bottom: 50,
                    left: 50,
                    right: 150,
                    top: 50
                  }}
                  width={700}
                  themeColor={ChartThemeColor.multiUnordered}
                >
                  <ChartAxis />
                  <ChartAxis dependentAxis showGrid />

                  <ChartGroup offset={17}>
                    {lineChartLegend.map(({ name }) => {
                      const chartData = (TotalMonthlyDeploymentData?.[name] || [])
                        .sort(
                          (a, b) =>
                            new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
                        )
                        .map(({ count, startDate, endDate }) => {
                          const xLabel =
                            previous === '3' || previous === '6'
                              ? dayjs(startDate).format('MMM')
                              : `${dayjs(startDate).format(DATE_FORMAT)} - ${dayjs(endDate).format(
                                  DATE_FORMAT
                                )}`;
                          return {
                            name,
                            x: xLabel,
                            y: count
                          };
                        });

                      return <ChartBar key={`key-${name}`} barWidth={15} data={chartData} />;
                    })}
                  </ChartGroup>
                </Chart>
              ) : (
                EmptyChart
              )}
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Line Chart</TabTitleText>}>
              {lineChartLegend.some(
                ({ name }) => TotalMonthlyDeploymentData?.[name]?.length > 0
              ) ? (
                <Chart
                  ariaDesc="Line chart for no of deployments/env"
                  containerComponent={
                    <ChartVoronoiContainer
                      labels={({ datum }) => `${datum.name}: ${datum.y}`}
                      constrainToVisibleArea
                    />
                  }
                  legendData={lineChartLegend}
                  legendOrientation="vertical"
                  legendPosition="right"
                  height={300}
                  name="chart1"
                  maxDomain={{ y: maxCount + (maxCount - minCount) * 0.2 }}
                  minDomain={{ y: 0 }}
                  padding={{
                    bottom: 50,
                    left: 50,
                    right: 150,
                    top: 50
                  }}
                  themeColor={ChartThemeColor.multiUnordered}
                  width={700}
                >
                  <ChartAxis />
                  <ChartAxis dependentAxis showGrid tickFormat={(x) => Number(x)} />
                  <ChartGroup>
                    {lineChartLegend.map(({ name }) => {
                      const chartData = (TotalMonthlyDeploymentData?.[name] || [])
                        .sort(
                          (a, b) =>
                            new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
                        )
                        .map(({ count, startDate, endDate }) => {
                          const xLabel =
                            previous === '3' || previous === '6'
                              ? dayjs(startDate).format('MMM')
                              : `${dayjs(startDate).format(DATE_FORMAT)} - ${dayjs(endDate).format(
                                  DATE_FORMAT
                                )}`;

                          return {
                            name,
                            x: xLabel,
                            y: count
                          };
                        });

                      return <ChartLine key={`key-${name}`} data={chartData} />;
                    })}
                  </ChartGroup>
                </Chart>
              ) : (
                EmptyChart
              )}
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
      <br />

      <Card
        style={{
          margin: '0px 24px 24px 24px',
          overflow: 'auto',
          scrollbarWidth: 'none'
        }}
      >
        <CardHeader>
          <CardTitle>
            <Title headingLevel="h6">Total Deployments per Environment</Title>
          </CardTitle>
        </CardHeader>
        <CardBody className="x-y-center pf-u-h-100">
          {TotalDeploymentData.isLoading && <Skeleton shape="circle" width="160px" />}
          {!TotalDeploymentData.isLoading && !TotalDeploymentData.data && (
            <EmptyState>
              <EmptyStateIcon icon={CubesIcon} />
              <Title headingLevel="h4" size="lg">
                No Deployment found
              </Title>
            </EmptyState>
          )}

          {donutChartAggregatedData?.length === 1 &&
          donutChartAggregatedData &&
          donutChartAggregatedData[0]?.y === 0
            ? EmptyChart
            : TotalDeploymentData.isSuccess && (
                <div style={{ height: '250px', width: '350px' }}>
                  <ChartDonut
                    ariaTitle="Number of deployments per env"
                    constrainToVisibleArea
                    data={donutChartAggregatedData}
                    labels={({ datum }) => `${datum.x}: ${datum.y}`}
                    legendData={legendValues}
                    legendOrientation="vertical"
                    legendPosition="right"
                    name="monthly-deployment"
                    padding={{
                      bottom: 20,
                      left: 20,
                      right: 140,
                      top: 20
                    }}
                    subTitle="Deployments"
                    title={`${donutChartData.total}`}
                    themeColor={ChartThemeColor.multiOrdered}
                    width={350}
                  />
                </div>
              )}
        </CardBody>
      </Card>
    </Grid>
  );
};
