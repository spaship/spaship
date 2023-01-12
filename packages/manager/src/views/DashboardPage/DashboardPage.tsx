import {
  useGetTotalDeployments,
  useGetDeploymentCounts,
  useGetDeploymentsTime,
  useGetMonthlyDeploymentChartWithEphemeral
} from '@app/services/analytics';
import { ActivityStream } from './components/ActivityStream';
import { Analytics } from './components/Analytics';

export const DashboardPage = (): JSX.Element => {
  const TotalDeploymentData = useGetTotalDeployments();
  const Totaldeployment = TotalDeploymentData.data?.reduce((acc, obj) => acc + obj.count, 0);
  const TotalDeploymentCountsData = useGetDeploymentCounts();
  const TotalProperty = Object.keys(TotalDeploymentCountsData.data || {}).length;
  const TotalDeploymentsTimeData = useGetDeploymentsTime();
  const averageTime = TotalDeploymentsTimeData.data?.averageTime;
  const TotalMonthlyDeploymentData = useGetMonthlyDeploymentChartWithEphemeral().data;
  const QADeployments = TotalMonthlyDeploymentData?.filter((ele) => ele.env === 'qa');
  const StageDeployments = TotalMonthlyDeploymentData?.filter((ele) => ele.env === 'stage');
  const DevDeployments = TotalMonthlyDeploymentData?.filter((ele) => ele.env === 'dev');
  const ProdDeployments = TotalMonthlyDeploymentData?.filter((ele) => ele.env === 'uatprod');
  const lastMonthEphemeral =
    TotalMonthlyDeploymentData?.filter((ele) => ele.env === 'ephemeral')?.[0]?.data.reduce(
      (acc, obj) => acc + obj.y,
      0
    ) || 0;

  const minCount = Math.min(
    QADeployments?.[0]?.data.reduce(
      (acc, obj) => Math.min(acc, obj.y),
      QADeployments?.[0]?.data?.[0]?.y
    ) || 0,
    StageDeployments?.[0]?.data.reduce(
      (acc, obj) => Math.min(acc, obj.y),
      StageDeployments?.[0]?.data?.[0]?.y
    ) || 0,
    DevDeployments?.[0]?.data.reduce(
      (acc, obj) => Math.min(acc, obj.y),
      DevDeployments?.[0]?.data?.[0]?.y
    ) || 0,
    ProdDeployments?.[0]?.data.reduce(
      (acc, obj) => Math.min(acc, obj.y),
      ProdDeployments?.[0]?.data?.[0]?.y
    ) || 0
  );

  const maxCount = Math.max(
    QADeployments?.[0]?.data.reduce((acc, obj) => Math.max(acc, obj.y), 0) || 0,
    StageDeployments?.[0]?.data.reduce((acc, obj) => Math.max(acc, obj.y), 0) || 0,
    DevDeployments?.[0]?.data.reduce((acc, obj) => Math.max(acc, obj.y), 0) || 0,
    ProdDeployments?.[0]?.data.reduce((acc, obj) => Math.max(acc, obj.y), 0) || 0
  );

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '10%' }}>
      <div style={{ width: '55%' }}>
        <Analytics
          QAData={QADeployments?.[0]?.data}
          ProdData={ProdDeployments?.[0]?.data}
          DevData={DevDeployments?.[0]?.data}
          StageData={StageDeployments?.[0]?.data}
          Totaldeployment={Totaldeployment}
          TotalProperty={TotalProperty}
          averageTime={averageTime}
          lastMonthEphemeral={lastMonthEphemeral}
          TotalDeploymentData={TotalDeploymentData}
          minCount={minCount}
          maxCount={maxCount}
        />
      </div>
      <div style={{ width: '45%' }}>
        <ActivityStream />
      </div>
    </div>
  );
};
