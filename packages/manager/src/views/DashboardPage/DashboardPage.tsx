import {
  useGetTotalDeployments,
  useGetDeploymentCounts,
  useGetDeploymentsTime,
  useGetMonthlyDeploymentChartWithEphemeral
} from '@app/services/analytics';
import { ActivityStream } from './components/ActivityStream';
import { Analytics } from './components/Analytics';

interface IDeploymentData {
  env: string;
  count: number;
  startDate: string;
  endDate: string;
}

export const DashboardPage = (): JSX.Element => {
  const TotalDeploymentData = useGetTotalDeployments();
  const Totaldeployment = TotalDeploymentData.data?.reduce((acc, obj) => acc + obj.count, 0);
  const TotalDeploymentCountsData = useGetDeploymentCounts();
  const TotalProperty = Object.keys(TotalDeploymentCountsData.data || {}).length;
  const TotalDeploymentsTimeData = useGetDeploymentsTime();
  const averageTime = TotalDeploymentsTimeData.data?.averageTime;
  const TotalMonthlyDeploymentData = useGetMonthlyDeploymentChartWithEphemeral().data;
  const lastMonthEphemeral = TotalMonthlyDeploymentData?.ephemeral?.reduce(
    (acc, obj) => acc + obj.count,
    0
  );

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

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '10%' }}>
      <div style={{ width: '55%' }}>
        <Analytics
          QAData={QAData}
          ProdData={ProdData}
          StageData={StageData}
          DevData={DevData}
          Totaldeployment={Totaldeployment}
          TotalProperty={TotalProperty}
          averageTime={averageTime}
          lastMonthEphemeral={lastMonthEphemeral}
          TotalDeploymentData={TotalDeploymentData}
        />
      </div>
      <div style={{ width: '45%' }}>
        <ActivityStream />
      </div>
    </div>
  );
};
