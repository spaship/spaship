import { pageLinks } from '@app/links';
import {
  useGetHalfYearlyDeploymentsTime,
  useGetMonthlyDeploymentChart,
  useGetMonthlyDeploymentChartWithEphemeral,
  useGetMonthlyDeploymentsTime,
  useGetQuarterlyDeploymentsTime,
  useGetTotalDeployments,
  useGetTotalDeploymentsForApps,
  useGetYearlyDeploymentsTime
} from '@app/services/analytics';
import { useGetSPAPropGroupByName } from '@app/services/spaProperty';
import {
  Chart,
  ChartAxis,
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
  GridItem,
  Skeleton,
  Split,
  SplitItem,
  Title
} from '@patternfly/react-core';
import { CubesIcon } from '@patternfly/react-icons';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { useMemo } from 'react';
import toast from 'react-hot-toast';

const TotalDeploymentCardFields = ['Dev', 'QA', 'Stage', 'Prod'];
const DeploymentTimeFrames = ['month', 'quarter', 'half year', 'year'];
type IGraphData = {
  name: string;
  x: string;
  y: number;
};
type ITotalMonthlyDeploymentData = {
  dev?: IGraphData[];
  qa?: IGraphData[];
  stage?: IGraphData[];
  prod?: IGraphData[];
};
export const Dashboard = (): JSX.Element => {
  const router = useRouter();
  const propertyIdentifier = router.query.propertyIdentifier as string;
  const spaProperty = router.query.spaProperty as string;
  const deploymentCount = useGetTotalDeploymentsForApps(propertyIdentifier);
  const monthlyDeployChart = useGetMonthlyDeploymentChart(propertyIdentifier, spaProperty);
  if (deploymentCount.isError === true) {
    toast.error(`Sorry cannot find ${spaProperty}`);
    router.push(`/properties/${propertyIdentifier}`);
  }
  const sortedDeployCount = deploymentCount?.data?.sort((x, y) => x.count - y.count);
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
  const lineChartLegend = Object.keys(monthlyDeployChart?.data || {}).map((key) => ({ name: key }));
  const TotalDeploymentData = useGetTotalDeployments(propertyIdentifier);

  const Totaldeployment = TotalDeploymentData.data?.reduce((acc, obj) => acc + obj.count, 0);
  const TotalSpasCountsData = useGetSPAPropGroupByName(propertyIdentifier, '');
  const TotalProperty = Object.keys(TotalSpasCountsData.data || {}).length;
  const TotalMonthlyDeploymentData = useGetMonthlyDeploymentChartWithEphemeral().data ?? {};
  const minCount = TotalMonthlyDeploymentData?.minDeploymentCount || 0;
  const maxCount = TotalMonthlyDeploymentData?.maxDeploymentCount || 0;

  const averageDeploymentTime = [
    useGetMonthlyDeploymentsTime(propertyIdentifier).data,
    useGetQuarterlyDeploymentsTime(propertyIdentifier).data,
    useGetHalfYearlyDeploymentsTime(propertyIdentifier).data,
    useGetYearlyDeploymentsTime(propertyIdentifier).data
  ];
  const bestDeploymentFiltered = averageDeploymentTime.filter((e) => e);
  const bestDeploymentTime = Math.min(...bestDeploymentFiltered.map((time) => time || 0));
  const bestDeploymentTimeIndex = averageDeploymentTime.findIndex(
    (time) => time === bestDeploymentTime
  );
  return (
    <>
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
                  <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{Totaldeployment}</h1>
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
              {bestDeploymentTime && bestDeploymentTime !== Infinity ? (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{bestDeploymentTime}s</h1>
                  <h1 style={{ fontSize: '14px', paddingLeft: '8px' }}>
                    in past {DeploymentTimeFrames[bestDeploymentTimeIndex]}
                  </h1>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <h1 style={{ color: '#0066CC', fontSize: '28px' }}>NA</h1>
                </div>
              )}
              <div
                style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}
              >
                {DeploymentTimeFrames.map((field, index) => (
                  <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                    <h1 style={{ fontSize: '12px' }}>{`Past ${field}`}</h1>
                    <h1 style={{ fontSize: '12px' }}>
                      {averageDeploymentTime[index] ? `${averageDeploymentTime[index]}s` : 'NA'}
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
                <CardTitle>Total SPA&apos;s</CardTitle>
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
      <Split hasGutter className="pf-u-mt-md" style={{ padding: '12px', margin: '12px' }}>
        <SplitItem isFilled>
          <Card isFullHeight>
            <CardHeader>
              <CardTitle>
                <Title headingLevel="h6">Total Deployments / Environment</Title>
              </CardTitle>
            </CardHeader>
            <CardBody className="x-y-center pf-u-h-100">
              {deploymentCount.isLoading && <Skeleton shape="circle" width="160px" />}
              {!deploymentCount.isLoading && !deploymentCount.data && (
                <EmptyState>
                  <EmptyStateIcon icon={CubesIcon} />
                  <Title headingLevel="h4" size="lg">
                    No deployments found
                  </Title>
                </EmptyState>
              )}
              {deploymentCount.isSuccess && (
                <ChartDonut
                  ariaTitle="Number of deployments"
                  constrainToVisibleArea
                  data={donutChartData.data}
                  labels={({ datum }) => `${datum.x}: ${datum.y}%`}
                  legendData={donutChartData.names}
                  legendOrientation="vertical"
                  legendPosition="right"
                  name="monthly-deployment"
                  padding={{
                    bottom: 40,
                    left: 20,
                    right: 140,
                    top: 20
                  }}
                  subTitle="Deployments"
                  title={`${donutChartData.total}`}
                  width={400}
                  height={220}
                />
              )}
            </CardBody>
          </Card>
        </SplitItem>
        <SplitItem isFilled>
          <Card
            isSelectable
            isFullHeight
            style={{
              // overflow: 'auto',
              scrollbarWidth: 'none'
              // height: '400px'
            }}
            isRounded
          >
            <CardHeader>
              <CardTitle>Past 30 days Deployment History</CardTitle>
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
                    {lineChartLegend.map(({ name }) => (
                      <ChartLine
                        key={`key-${name}`}
                        data={
                          TotalMonthlyDeploymentData[name as keyof ITotalMonthlyDeploymentData] ||
                          []
                        }
                      />
                    ))}
                  </ChartGroup>
                </Chart>
              </div>
            </CardBody>
          </Card>
        </SplitItem>
      </Split>
    </>
  );
};
