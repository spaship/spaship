/* eslint-disable react/require-default-props */
import { pageLinks } from '@app/links';
import { TSPADeploymentCount } from '@app/services/analytics/types';
import {
  Chart,
  ChartAxis,
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
  GridItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { UseQueryResult } from '@tanstack/react-query';
import dayjs from 'dayjs';
import Link from 'next/link';

const TotalDeploymentCardFields = ['Dev', 'QA', 'Stage', 'Prod'];
const DeploymentTimeFrames = ['30 days', '90 days', '180 days', '365 days'];

interface ITotalMonthlyDeploymentData {
  [key: string]: {
    count: number;
    startDate: string;
    endDate: string;
  }[];
}
type Props = {
  TotalMonthlyDeploymentData: ITotalMonthlyDeploymentData;
  TotalDeployment?: number;
  TotalProperty: number;
  averageDeploymentTime: number[];
  bestDeploymentTime?: number;
  bestDeploymentTimeIndex: number;
  TotalDeploymentData: UseQueryResult<TSPADeploymentCount[]>;
  minCount: number;
  maxCount: number;
};

export const Analytics = ({
  TotalMonthlyDeploymentData,
  TotalDeployment,
  TotalProperty,
  averageDeploymentTime,
  bestDeploymentTime,
  bestDeploymentTimeIndex,
  TotalDeploymentData,
  minCount,
  maxCount
}: Props) => {
  const lineChartLegend = Object.keys(TotalMonthlyDeploymentData || {}).map((key) => ({
    name: key
  }));

  console.log('TotalMonthlyDeploymentData', TotalMonthlyDeploymentData);
  return (
    <>
      <TextContent
        style={{ marginBottom: '10px', marginTop: '24px', marginLeft: '24px', fontSize: '20px' }}
      >
        <Text component={TextVariants.h1}>SPAship Deployment Analysis</Text>
      </TextContent>
      <Grid style={{ padding: '12px 12px' }}>
        <GridItem span={6}>
          <Link href={pageLinks.webPropertyListPage}>
            <a className="text-decoration-none">
              <Card
                isSelectable
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
                          {TotalDeploymentData.data
                            ?.filter((ele) => ele.env === field.toLocaleLowerCase())
                            .map((ele) => ele.count)}
                        </h1>
                      </div>
                    ))}
                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                      <h1 style={{ fontSize: '12px' }}>Others</h1>
                      <h1 style={{ fontSize: '12px' }}>
                        {TotalDeploymentData.data
                          ?.filter(
                            (ele) =>
                              !TotalDeploymentCardFields.map((str) =>
                                str.toLocaleLowerCase()
                              ).includes(ele.env)
                          )
                          .reduce((acc, ele) => acc + ele.count, 0)}
                      </h1>
                    </div>
                  </div>
                </CardBody>
              </Card>
            </a>
          </Link>
        </GridItem>
        <GridItem span={6}>
          <Card
            isSelectable
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
              {bestDeploymentTime ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{bestDeploymentTime}s</h1>
                  <h1 style={{ fontSize: '14px', paddingLeft: '8px' }}>
                    in past {DeploymentTimeFrames[bestDeploymentTimeIndex]}
                  </h1>
                </div>
              ) : (
                ''
              )}

              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}
              >
                {DeploymentTimeFrames.map((field, index) => (
                  <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '12px' }}>{`Past ${field}`}</h1>
                    <h1 style={{ fontSize: '12px' }}>
                      {averageDeploymentTime[index] ? `${averageDeploymentTime[index]}s` : ''}
                    </h1>
                  </div>
                ))}
              </div>
            </CardBody>
          </Card>
        </GridItem>
        <GridItem span={6}>
          <Link href={pageLinks.webPropertyListPage}>
            <a className="text-decoration-none">
              <Card
                isSelectable
                isFullHeight
                style={{
                  margin: '12px 12px',
                  overflow: 'auto',
                  scrollbarWidth: 'none',
                  height: '130px'
                }}
                isRounded
              >
                <CardTitle>Total Properties</CardTitle>
                <CardBody>
                  <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{TotalProperty}</h1>
                </CardBody>
              </Card>
            </a>
          </Link>
        </GridItem>
        <GridItem span={6}>
          <Card
            isSelectable
            isFullHeight
            style={{
              margin: '12px 12px',
              overflow: 'auto',
              scrollbarWidth: 'none',
              height: '130px'
            }}
            isRounded
          >
            <CardTitle>Total Ephemeral Deployments</CardTitle>
            <CardBody>
              <h1 style={{ color: '#0066CC', fontSize: '28px' }}>
                {TotalDeploymentData.data
                  ?.filter((ele) => ele.env === 'ephemeral')
                  .reduce((acc, ele) => acc + ele.count, 0)}
              </h1>
            </CardBody>
          </Card>
        </GridItem>
      </Grid>
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
          height: '380px'
        }}
        isRounded
      >
        <CardHeader>
          <CardTitle>Total Deployments</CardTitle>
        </CardHeader>
        <CardBody>
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
              legendPosition="bottom-left"
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
                      (a, b) => new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
                    )
                    .map(({ count, startDate, endDate }) => ({
                      name,
                      x: `${dayjs(startDate).format('DD MMM')} - ${dayjs(endDate).format(
                        'DD MMM'
                      )}`,
                      y: count
                    }));
                  return <ChartLine key={`key-${name}`} data={chartData} />;
                })}
              </ChartGroup>
            </Chart>
          </div>
        </CardBody>
      </Card>
    </>
  );
};
