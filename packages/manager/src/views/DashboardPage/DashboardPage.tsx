import {
  useGetTotalDeployments,
  useGetDeploymentCounts,
  useGetMonthlyDeploymentsTime,
  useGetQuarterlyDeploymentsTime,
  useGetHalfYearlyDeploymentsTime,
  useGetYearlyDeploymentsTime,
  useGetMonthlyDeploymentChartWithEphemeral
} from '@app/services/analytics';
import { ActivityStreamDashboard } from './components/ActivityStreamDashboard';
import { Analytics } from './components/Analytics';

export const DashboardPage = (): JSX.Element => {
  const TotalDeploymentData = useGetTotalDeployments();
  const TotalDeployment = TotalDeploymentData.data?.reduce((acc, obj) => acc + obj.count, 0);
  const TotalDeploymentCountsData = useGetDeploymentCounts();
  const TotalProperty = Object.keys(TotalDeploymentCountsData.data || {}).length;
  const TotalMonthlyDeploymentData = useGetMonthlyDeploymentChartWithEphemeral().data;
  const averageDeploymentTime = [
    useGetMonthlyDeploymentsTime().data || 0,
    useGetQuarterlyDeploymentsTime().data || 0,
    useGetHalfYearlyDeploymentsTime().data || 0,
    useGetYearlyDeploymentsTime().data || 0
  ];
  const bestDeploymentTime = Math.min(...averageDeploymentTime.map((time) => time || 0));
  const bestDeploymentTimeIndex = averageDeploymentTime.findIndex(
    (time) => time === bestDeploymentTime
  );
  return (
    <div style={{ display: 'flex', flexDirection: 'row', height: '10%' }}>
      <div style={{ width: '55%' }}>
        <Analytics
          TotalMonthlyDeploymentData={{
            qa: TotalMonthlyDeploymentData?.qa,
            prod: TotalMonthlyDeploymentData?.prod,
            dev: TotalMonthlyDeploymentData?.dev,
            stage: TotalMonthlyDeploymentData?.stage
          }}
          TotalDeployment={TotalDeployment}
          TotalProperty={TotalProperty}
          averageDeploymentTime={averageDeploymentTime}
          bestDeploymentTime={bestDeploymentTime}
          bestDeploymentTimeIndex={bestDeploymentTimeIndex || 0}
          TotalDeploymentData={TotalDeploymentData}
          minCount={TotalMonthlyDeploymentData?.minDeploymentCount || 0}
          maxCount={TotalMonthlyDeploymentData?.maxDeploymentCount || 0}
        />
      </div>
      <div style={{ width: '45%' }}>
        <ActivityStreamDashboard />
      </div>
    </div>
  );
};
