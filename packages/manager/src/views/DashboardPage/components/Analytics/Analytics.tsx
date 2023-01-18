/* eslint-disable react/require-default-props */
import {
  Card,
  CardTitle,
  CardBody,
  CardHeader,
  Grid,
  GridItem,
  TextContent,
  Text,
  TextVariants
} from '@patternfly/react-core';
import {
  Chart,
  ChartAxis,
  ChartGroup,
  ChartLine,
  ChartThemeColor,
  ChartVoronoiContainer
} from '@patternfly/react-charts';
import { TSPADeploymentCount } from '@app/services/analytics/types';
import { UseQueryResult } from '@tanstack/react-query';

const TotalDeploymentCardFields = ['Dev', 'QA', 'Stage', 'Prod'];
const DeploymentTimeFrames = ['month', 'quarter', 'half year', 'year'];

type IGraphData = {
  name: string;
  x: string;
  y: number;
};

type Props = {
  QAData: IGraphData[] | undefined;
  ProdData: IGraphData[] | undefined;
  StageData: IGraphData[] | undefined;
  DevData: IGraphData[] | undefined;
  Totaldeployment: number | undefined;
  TotalProperty: number;
  averageDeploymentTime: (number | undefined)[];
  bestDeploymentTime: number | undefined;
  bestDeploymentTimeIndex: number;
  TotalDeploymentData: UseQueryResult<TSPADeploymentCount[]>;
  minCount: number;
  maxCount: number;
};

export const Analytics = ({
  QAData,
  ProdData,
  StageData,
  DevData,
  Totaldeployment,
  TotalProperty,
  averageDeploymentTime,
  bestDeploymentTime,
  bestDeploymentTimeIndex,
  TotalDeploymentData,
  minCount,
  maxCount
}: Props) => (
  <>
    <TextContent
      style={{ marginBottom: '10px', marginTop: '24px', marginLeft: '24px', fontSize: '20px' }}
    >
      <Text component={TextVariants.h1}>Stats</Text>
    </TextContent>
    <Grid style={{ padding: '12px 12px' }}>
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
          <CardTitle>Total Deployment</CardTitle>
          <CardBody>
            <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{Totaldeployment}</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}>
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
                        !TotalDeploymentCardFields.map((str) => str.toLocaleLowerCase()).includes(
                          ele.env
                        )
                    )
                    .reduce((acc, ele) => acc + ele.count, 0)}
                </h1>
              </div>
            </div>
          </CardBody>
        </Card>
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
            <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
              <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{bestDeploymentTime}s</h1>
              <h1 style={{ fontSize: '14px', paddingLeft: '8px' }}>
                in last {DeploymentTimeFrames[bestDeploymentTimeIndex]}
              </h1>
            </div>

            <div style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}>
              {DeploymentTimeFrames.map((field, index) => (
                <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                  <h1 style={{ fontSize: '12px' }}>{`Last ${field}`}</h1>
                  <h1 style={{ fontSize: '12px' }}>{averageDeploymentTime[index]}</h1>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
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
          <CardTitle>Total Property</CardTitle>
          <CardBody>
            <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{TotalProperty}</h1>
          </CardBody>
        </Card>
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
          <CardTitle>Total Ephemeral Deployment</CardTitle>
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
      <Text component={TextVariants.h1}>SPAship Deployment History</Text>
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
        <CardTitle>Total Deployment</CardTitle>
      </CardHeader>
      <CardBody>
        <div style={{ height: '275px' }}>
          <Chart
            ariaDesc="Average number of pets"
            ariaTitle="Line chart example"
            containerComponent={
              <ChartVoronoiContainer
                labels={({ datum }) => `${datum.name}: ${datum.y}`}
                constrainToVisibleArea
              />
            }
            legendData={[
              { name: 'Prod' },
              { name: 'Stage', symbol: { type: 'dash' } },
              { name: 'QA' },
              { name: 'Dev' }
            ]}
            legendPosition="bottom-left"
            height={275}
            maxDomain={{ y: maxCount + (maxCount - minCount) * 0.2 }}
            minDomain={{ y: 0 }}
            name="chart3"
            padding={{
              bottom: 75,
              left: 50,
              right: 50,
              top: 50
            }}
            themeColor={ChartThemeColor.multiUnordered}
            width={850}
          >
            <ChartAxis tickValues={[]} />
            <ChartAxis
              dependentAxis
              showGrid
              tickValues={[Math.ceil(maxCount / 3), Math.ceil((2 * maxCount) / 3), maxCount]}
            />
            <ChartGroup>
              {ProdData && <ChartLine data={ProdData} />}
              {StageData && <ChartLine data={StageData} />}
              {QAData && <ChartLine data={QAData} />}
              {DevData && <ChartLine data={DevData} />}
            </ChartGroup>
          </Chart>
        </div>
      </CardBody>
    </Card>
  </>
);
