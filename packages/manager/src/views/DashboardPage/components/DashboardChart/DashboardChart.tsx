/* eslint-disable react/require-default-props */
import { useGetMonthlyDeploymentChartWithEphemeral } from '@app/services/analytics';
import {
  Chart,
  ChartAxis,
  ChartBar,
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
  Grid,
  Select,
  SelectOption,
  SelectOptionObject,
  SelectVariant,
  SplitItem,
  Tab,
  Tabs,
  TabTitleText,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import dayjs from 'dayjs';
import { MouseEvent, useEffect, useState } from 'react';

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
};

const DATE_FORMAT = 'DD MMM';
export const DashboardChart = ({ TotalMonthlyDeploymentData, minCount, maxCount }: Props) => {
  const lineChartLegend = Object.keys(TotalMonthlyDeploymentData || {}).map((key) => ({
    name: key
  }));
  const [activeTabKey, setActiveTabKey] = useState<string | number>(0);
  const [isOpen, setIsOpen] = useState(false);
  const [selected, setSelected] = useState<string>('');

  const { refetch } = useGetMonthlyDeploymentChartWithEphemeral('', selected);

  useEffect(() => {
    refetch();
  }, [refetch, selected]);

  const onToggle = (isSelectOpen: boolean) => {
    setIsOpen(isSelectOpen);
  };
  const clearSelection = () => {
    setSelected('');
    setIsOpen(false);
  };

  const onSelect = (
    event: React.MouseEvent | React.ChangeEvent,
    selection: string | SelectOptionObject,
    isPlaceholder?: boolean
  ) => {
    if (isPlaceholder) clearSelection();
    else {
      setSelected(selection as string);
      setIsOpen(false);
    }
  };

  const handleTabClick = (
    event: MouseEvent<any> | KeyboardEvent | MouseEvent,
    tabIndex: string | number
  ) => {
    setActiveTabKey(tabIndex);
  };

  return (
    <Grid>
      <TextContent style={{ marginTop: '24px', marginLeft: '24px', fontSize: '20px' }}>
        <Text component={TextVariants.h1}>Past 30 days Deployment History</Text>
      </TextContent>
      <Card
        isSelectable
        isFullHeight
        style={{
          margin: '24px 24px',
          overflow: 'auto',
          scrollbarWidth: 'none',
          height: '450px'
        }}
        isRounded
      >
        <CardHeader>
          <SplitItem>
            <CardTitle>Deployment</CardTitle>
          </SplitItem>
          <SplitItem isFilled />
          <SplitItem>
            <Select
              variant={SelectVariant.single}
              isPlain
              aria-label="Select Input with descriptions"
              onToggle={onToggle}
              onSelect={onSelect}
              selections={selected}
              isOpen={isOpen}
            >
              <SelectOption key={0} value="1" isPlaceholder>
                Past 30 Days
              </SelectOption>
              <SelectOption key={1} value="3">
                Past 90 Days
              </SelectOption>
              <SelectOption key={2} value="6">
                Past 180 Days
              </SelectOption>
            </Select>
          </SplitItem>
        </CardHeader>
        <CardBody>
          {/* //bar chart */}
          <Tabs
            activeKey={activeTabKey}
            onSelect={handleTabClick}
            aria-label="Tabs in the default example"
            role="region"
          >
            <Tab
              eventKey={0}
              title={<TabTitleText>Bar Chart</TabTitleText>}
              aria-label="Default content - users"
            >
              <div style={{ height: '300px' }}>
                <Chart
                  ariaDesc="Number of deployments per env"
                  ariaTitle="Bar chart example"
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
                    bottom: 70,
                    left: 20,
                    right: 50, // Adjusted to accommodate legend
                    top: 50
                  }}
                  // themeColor={ChartThemeColor.multiUnordered}
                  width={800}
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
                        .map(({ count, startDate, endDate }) => ({
                          name,
                          x: `${dayjs(startDate).format(DATE_FORMAT)} - ${dayjs(endDate).format(
                            DATE_FORMAT
                          )}`,
                          y: count
                        }));
                      return <ChartBar key={`key-${name}`} barWidth={15} data={chartData} />;
                    })}
                  </ChartGroup>
                </Chart>
              </div>
            </Tab>
            <Tab eventKey={1} title={<TabTitleText>Line Chart</TabTitleText>}>
              <div style={{ height: '275px' }}>
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
                  height={275}
                  name="chart1"
                  maxDomain={{ y: maxCount + (maxCount - minCount) * 0.2 }}
                  minDomain={{ y: 0 }}
                  padding={{
                    bottom: 75,
                    left: 50,
                    right: 50,
                    top: 50
                  }}
                  themeColor={ChartThemeColor.multiUnordered}
                  width={850}
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
                        .map(({ count, startDate, endDate }) => ({
                          name,
                          x: `${dayjs(startDate).format(DATE_FORMAT)} - ${dayjs(endDate).format(
                            DATE_FORMAT
                          )}`,
                          y: count
                        }));
                      return <ChartLine key={`key-${name}`} data={chartData} />;
                    })}
                  </ChartGroup>
                </Chart>
              </div>
            </Tab>
          </Tabs>
        </CardBody>
      </Card>
    </Grid>
  );
};
