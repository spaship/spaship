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

  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '10%' }}>
      <div style={{ width: '55%' }}>
        <Analytics
          QAData={TotalMonthlyDeploymentData?.qa}
          ProdData={TotalMonthlyDeploymentData?.uatprod}
          DevData={TotalMonthlyDeploymentData?.dev}
          StageData={TotalMonthlyDeploymentData?.stage}
          Totaldeployment={Totaldeployment}
          TotalProperty={TotalProperty}
          averageTime={averageTime}
          lastMonthEphemeral={TotalMonthlyDeploymentData?.lastMonthEphemeral}
          TotalDeploymentData={TotalDeploymentData}
          minCount={TotalMonthlyDeploymentData?.minDeploymentCount || 0}
          maxCount={TotalMonthlyDeploymentData?.maxDeploymentCount || 0}
        />
      </div>
      <div style={{ width: '45%' }}>
        <ActivityStream />
      </div>
    </div>
  );
};
