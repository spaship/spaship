import { useGetMonthlyDeploymentChart } from '@app/services/analytics';

import { Card, CardTitle, CardBody, CardHeader } from '@patternfly/react-core';
import { Chart, ChartAxis, ChartGroup, ChartLine, ChartThemeColor } from '@patternfly/react-charts';
import { VictoryZoomContainer } from 'victory-zoom-container';

interface IDeploymentData {
  env: string;
  count: number;
  startDate: string;
  endDate: string;
}

export const LineChart = () => {
  const TotalMonthlyDeploymentData = useGetMonthlyDeploymentChart('', undefined, false).data;
  const QAData = TotalMonthlyDeploymentData?.qa
    .sort((a: IDeploymentData, b: IDeploymentData) => (a.startDate > b.startDate ? 1 : -1))
    .map((ele: IDeploymentData, index: number) => ({
      name: 'QA',
      x: `Week ${index + 1}`,
      y: ele.count
    }));

  const StageData = TotalMonthlyDeploymentData?.stage
    .sort((a: IDeploymentData, b: IDeploymentData) => (a.startDate > b.startDate ? 1 : -1))
    .map((ele: IDeploymentData, index: number) => ({
      name: 'Stage',
      x: `Week ${index + 1}`,
      y: ele.count
    }));

  const DevData = TotalMonthlyDeploymentData?.dev
    .sort((a: IDeploymentData, b: IDeploymentData) => (a.startDate > b.startDate ? 1 : -1))
    .map((ele: IDeploymentData, index: number) => ({
      name: 'Dev',
      x: `Week ${index + 1}`,
      y: ele.count
    }));

  const ProdData = TotalMonthlyDeploymentData?.uatprod
    .sort((a: IDeploymentData, b: IDeploymentData) => (a.startDate > b.startDate ? 1 : -1))
    .map((ele: IDeploymentData, index: number) => ({
      name: 'Prod',
      x: `Week ${index + 1}`,
      y: ele.count
    }));

  let minCount = 0;
  let maxCount = 0;
  if (ProdData && StageData && QAData && DevData) {
    minCount = Math.min(
      ProdData?.reduce((min, p) => (p.y < min ? p.y : min), ProdData[0].y),
      StageData?.reduce((min, p) => (p.y < min ? p.y : min), StageData[0].y),
      QAData?.reduce((min, p) => (p.y < min ? p.y : min), QAData[0].y),
      DevData?.reduce((min, p) => (p.y < min ? p.y : min), DevData[0].y)
    );
    maxCount = Math.max(
      ProdData?.reduce((max, p) => (p.y > max ? p.y : max), ProdData[0].y),
      StageData?.reduce((max, p) => (p.y > max ? p.y : max), StageData[0].y),
      QAData?.reduce((max, p) => (p.y > max ? p.y : max), QAData[0].y),
      DevData?.reduce((max, p) => (p.y > max ? p.y : max), DevData[0].y)
    );
  }

  return (
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
            containerComponent={<VictoryZoomContainer zoomDimension="x" />}
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
              <ChartLine data={ProdData} />
              <ChartLine data={StageData} />
              <ChartLine data={QAData} />
              <ChartLine data={DevData} />
            </ChartGroup>
          </Chart>
        </div>
      </CardBody>
    </Card>
  );
};
