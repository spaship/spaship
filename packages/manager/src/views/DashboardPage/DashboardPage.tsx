import {
  useGetDeploymentCounts,
  useGetHalfYearlyDeploymentsTime,
  useGetMonthlyDeploymentChartWithEphemeral,
  useGetMonthlyDeploymentsTime,
  useGetQuarterlyDeploymentsTime,
  useGetTotalDeployments,
  useGetTotalTimeSaved,
  useGetYearlyDeploymentsTime
} from '@app/services/analytics';
import Head from 'next/head';
import { ActivityStreamDashboard } from './components/ActivityStreamDashboard';
import { Analytics } from './components/Analytics';
import { DashboardChart } from './components/DashboardChart';

export const DashboardPage = (): JSX.Element => {
  const TotalDeploymentData = useGetTotalDeployments();
  const TotalDeployment = TotalDeploymentData.data?.reduce((acc, obj) => acc + obj.count, 0);
  const TotalDeploymentCountsData = useGetDeploymentCounts();

  const TotalProperty = Object.keys(TotalDeploymentCountsData.data || {}).length;
  const TotalMonthlyDeploymentData = useGetMonthlyDeploymentChartWithEphemeral('', '').data;
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
  const totalTimeSaved = useGetTotalTimeSaved();

  return (
    <>
      <Head>
        <title>SPAship Dashboard</title>
        <meta name="description" content="This is the home page description." />
      </Head>
      <Analytics
        TotalDeployment={TotalDeployment}
        TotalProperty={TotalProperty}
        averageDeploymentTime={averageDeploymentTime}
        bestDeploymentTime={bestDeploymentTime}
        bestDeploymentTimeIndex={bestDeploymentTimeIndex || 0}
        TotalDeploymentData={TotalDeploymentData}
        totalTimeSaved={totalTimeSaved?.data?.timeSavedInHours}
      />

      <div style={{ display: 'flex', flexDirection: 'row', height: '10%' }}>
        <div style={{ width: '50%' }}>
          <DashboardChart
            TotalMonthlyDeploymentData={{
              qa: TotalMonthlyDeploymentData?.qa ?? [],
              prod: TotalMonthlyDeploymentData?.prod ?? [],
              dev: TotalMonthlyDeploymentData?.dev ?? [],
              stage: TotalMonthlyDeploymentData?.stage ?? []
            }}
            minCount={TotalMonthlyDeploymentData?.minDeploymentCount || 0}
            maxCount={TotalMonthlyDeploymentData?.maxDeploymentCount || 0}
            TotalDeploymentData={TotalDeploymentData}
            propertyIdentifier=""
            applicationIdentifier=""
          />
        </div>
        <div style={{ width: '50%' }}>
          <ActivityStreamDashboard />
        </div>
      </div>
    </>
  );
};
