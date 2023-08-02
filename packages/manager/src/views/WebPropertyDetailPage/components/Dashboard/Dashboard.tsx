import { ActivityStream } from '@app/components/ActivityStream';
import { pageLinks } from '@app/links';
import {
  useGetHalfYearlyDeploymentsTime,
  // useGetMonthlyDeploymentChart,
  useGetMonthlyDeploymentChartWithEphemeral,
  useGetMonthlyDeploymentsTime,
  useGetQuarterlyDeploymentsTime,
  useGetTotalDeployments,
  useGetTotalDeploymentsForApps,
  useGetYearlyDeploymentsTime
} from '@app/services/analytics';
import { DashboardChart } from '@app/views/DashboardPage/components/DashboardChart';
import {
  Card,
  CardBody,
  CardTitle,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { css } from '@patternfly/react-styles';
import Link from 'next/link';
import { useRouter } from 'next/router';
// import { useMemo } from 'react';
import toast from 'react-hot-toast';
import SimpleBarReact from 'simplebar-react';
import 'simplebar/src/simplebar.css';

const TotalDeploymentCardFields = ['Dev', 'QA', 'Stage', 'Prod'];
const DeploymentTimeFrames = ['30 days', '90 days', '180 days', '365 days'];
// const DATE_FORMAT = 'DD MMM';

export const Dashboard = (): JSX.Element => {
  const router = useRouter();
  const propertyIdentifier = router.query.propertyIdentifier as string;
  const spaProperty = router.query.spaProperty as string;
  const deploymentCount = useGetTotalDeploymentsForApps(propertyIdentifier);
  // const monthlyDeployChart = useGetMonthlyDeploymentChart(propertyIdentifier, spaProperty);
  if (deploymentCount.isError === true) {
    toast.error(`Sorry cannot find ${spaProperty}`);
    router.push(`/properties/${propertyIdentifier}`);
  }

  const TotalDeploymentData = useGetTotalDeployments(propertyIdentifier);

  const TotalDeployment = TotalDeploymentData.data?.reduce((acc, obj) => acc + obj.count, 0);
  const TotalMonthlyDeploymentData = useGetMonthlyDeploymentChartWithEphemeral(
    propertyIdentifier,
    ''
  ).data;
  const averageDeploymentTime = [
    useGetMonthlyDeploymentsTime(propertyIdentifier).data || 0,
    useGetQuarterlyDeploymentsTime(propertyIdentifier).data || 0,
    useGetHalfYearlyDeploymentsTime(propertyIdentifier).data || 0,
    useGetYearlyDeploymentsTime(propertyIdentifier).data || 0
  ];
  const bestDeploymentFiltered = averageDeploymentTime.filter((e) => e);
  const bestDeploymentTime = Math.min(...bestDeploymentFiltered.map((time) => time || 0));
  const bestDeploymentTimeIndex = averageDeploymentTime.findIndex(
    (time) => time === bestDeploymentTime
  );
  console.log('>>TotalDeploymentData inpd', TotalDeploymentData, TotalMonthlyDeploymentData);
  return (
    <div style={{ backgroundColor: '#15' }}>
      <div style={{ display: 'flex', flexDirection: 'row', height: '10%' }}>
        <div style={{ width: '50%' }}>
          <Card style={{ margin: '24px 24px' }}>
            <TextContent
              style={{
                paddingBottom: '24px',
                marginTop: '24px',
                paddingLeft: '24px',
                fontSize: '16px',
                borderBottom: '1px solid #D2D2D2'
              }}
            >
              <Text component={TextVariants.h5}>Deployment Analysis</Text>
            </TextContent>
            <Grid span={6}>
              <GridItem>
                <Link href={pageLinks.webPropertyListPage}>
                  <a className="text-decoration-none">
                    <Card
                      isSelectable
                      isFullHeight
                      style={{
                        overflow: 'auto',
                        scrollbarWidth: 'none',
                        borderRight: '1px  solid #D2D2D2'
                      }}
                    >
                      <CardBody>
                        <Text className="dashboard-card">{TotalDeployment}</Text>

                        <Text component={TextVariants.h2} style={{ fontFamily: 'Red Hat Text' }}>
                          Total Deployments
                        </Text>
                        <div
                          style={{
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '7%',
                            marginTop: '24px'
                          }}
                          className="dashboard-card-subheadings"
                        >
                          {TotalDeploymentCardFields.map((field) => (
                            <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                              <Text
                                component={TextVariants.p}
                                style={{ fontSize: '20px', color: '#151515' }}
                              >
                                {TotalDeploymentData.data
                                  ?.filter((ele) => ele.env === field.toLocaleLowerCase())
                                  .map((ele) => ele.count)}
                              </Text>
                              <Text
                                component={TextVariants.p}
                                style={{
                                  fontSize: '14px',
                                  fontWeight: 400,
                                  color: '#3C3F42'
                                }}
                              >
                                {field}
                              </Text>
                            </div>
                          ))}

                          <div style={{ display: 'flex', flexDirection: 'column' }}>
                            <Text
                              component={TextVariants.p}
                              style={{ fontSize: '20px', color: '#151515' }}
                            >
                              {TotalDeploymentData.data
                                ?.filter(
                                  (ele) =>
                                    !TotalDeploymentCardFields.map((str) =>
                                      str.toLocaleLowerCase()
                                    ).includes(ele.env)
                                )
                                .reduce((acc, ele) => acc + ele.count, 0)}
                            </Text>
                            <Text
                              component={TextVariants.p}
                              style={{
                                fontSize: '14px',
                                fontWeight: 400,
                                color: '#3C3F42'
                              }}
                            >
                              Others
                            </Text>
                          </div>
                        </div>
                      </CardBody>
                    </Card>
                  </a>
                </Link>
              </GridItem>
              <GridItem>
                <Card
                  isSelectable
                  isFullHeight
                  style={{
                    overflow: 'auto',
                    scrollbarWidth: 'none',
                    borderRight: '1px  solid #D2D2D2'
                  }}
                >
                  <CardBody>
                    {bestDeploymentTime ? (
                      <>
                        <div
                          style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}
                        >
                          <Text component={TextVariants.p} className="dashboard-card">
                            {bestDeploymentTime}s
                          </Text>
                          <Text
                            component={TextVariants.p}
                            style={{
                              fontSize: '14px',
                              paddingLeft: '8px',
                              fontFamily: 'Red Hat Text'
                            }}
                          >
                            in past {DeploymentTimeFrames[bestDeploymentTimeIndex]}
                          </Text>
                        </div>
                        <Text component={TextVariants.h2}>Average time to deploy</Text>
                      </>
                    ) : (
                      ''
                    )}

                    <div
                      style={{
                        display: 'flex',
                        flexDirection: 'row',
                        gap: '35px',
                        marginTop: '24px'
                      }}
                    >
                      {DeploymentTimeFrames.map((field, index) => (
                        <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                          <Text component={TextVariants.p} className="dashboard-card-subheadings">
                            {averageDeploymentTime[index] ? `${averageDeploymentTime[index]}s` : ''}
                          </Text>
                          <Text
                            component={TextVariants.p}
                            style={{
                              fontSize: '14px',
                              fontWeight: 400,
                              color: '#3C3F42'
                            }}
                          >{`Past ${field}`}</Text>
                        </div>
                      ))}
                    </div>
                  </CardBody>
                </Card>
              </GridItem>
            </Grid>
          </Card>
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
          />
        </div>
        <div style={{ width: '50%' }}>
          <Card
            // isSelectable
            isFullHeight
            style={{
              margin: '0px 24px 24px 0px',
              paddingLeft: '12px',
              height: '770px',
              overflow: 'hidden'
            }}
            className={css('pf-u-px-lg rounded-md transition hover:shadow-sm')}
          >
            <CardTitle style={{ borderBottom: '1px solid #D2D2D2' }}>
              <Text component={TextVariants.h5}>Activity Stream</Text>
            </CardTitle>

            <SimpleBarReact style={{ maxHeight: 600 }}>
              <div style={{ marginTop: '30px' }}>
                <ActivityStream action="APPLICATION_DEPLOYED" isGlobal />
              </div>
            </SimpleBarReact>
          </Card>
        </div>
      </div>
    </div>
    // <>
    //   <Grid style={{ padding: '12px 12px' }}>
    //     <GridItem span={6}>
    //       <Card
    //         isFullHeight
    //         style={{
    //           margin: '12px 12px',
    //           overflow: 'auto',
    //           scrollbarWidth: 'none',
    //           height: '190px'
    //         }}
    //         isRounded
    //       >
    //         <CardTitle>Total Deployments</CardTitle>
    //         <CardBody>
    //           <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{TotalDeployment}</h1>
    //           <div
    //             style={{
    //               display: 'flex',
    //               flexDirection: 'row',
    //               gap: '35px',
    //               marginTop: '24px'
    //             }}
    //           >
    //             {TotalDeploymentCardFields.map((field) => (
    //               <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
    //                 <h1 style={{ fontSize: '12px' }}>{field}</h1>
    //                 <h1 style={{ fontSize: '12px' }}>
    //                   {TotalDeploymentData?.data
    //                     ?.filter((ele) => ele.env === field.toLocaleLowerCase())
    //                     .map((ele) => ele.count)
    //                     .reduce((a, b) => a + b, 0) ?? 0}
    //                 </h1>
    //               </div>
    //             ))}
    //             <div style={{ display: 'flex', flexDirection: 'column' }}>
    //               <h1 style={{ fontSize: '12px' }}>Others</h1>
    //               <h1 style={{ fontSize: '12px' }}>
    //                 {TotalDeploymentData.data
    //                   ?.filter(
    //                     (ele) =>
    //                       !TotalDeploymentCardFields.map((str) => str.toLocaleLowerCase()).includes(
    //                         ele.env
    //                       )
    //                   )
    //                   .reduce((acc, ele) => acc + ele.count, 0)}
    //               </h1>
    //             </div>
    //           </div>
    //         </CardBody>
    //       </Card>
    //     </GridItem>
    //     <GridItem span={6}>
    //       <Card
    //         isFullHeight
    //         style={{
    //           margin: '12px 12px',
    //           overflow: 'auto',
    //           scrollbarWidth: 'none',
    //           height: '190px'
    //         }}
    //         isRounded
    //       >
    //         <CardTitle>Average time to deploy</CardTitle>
    //         <CardBody>
    //           {bestDeploymentTime && bestDeploymentTime !== Infinity ? (
    //             <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
    //               <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{bestDeploymentTime}s</h1>
    //               <h1 style={{ fontSize: '14px', paddingLeft: '8px' }}>
    //                 in past {DeploymentTimeFrames[bestDeploymentTimeIndex]}
    //               </h1>
    //             </div>
    //           ) : (
    //             <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
    //               <h1 style={{ color: '#0066CC', fontSize: '28px' }}>NA</h1>
    //             </div>
    //           )}
    //           <div
    //             style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}
    //           >
    //             {DeploymentTimeFrames.map((field, index) => (
    //               <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
    //                 <h1 style={{ fontSize: '12px' }}>{`Past ${field}`}</h1>
    //                 <h1 style={{ fontSize: '12px' }}>
    //                   {averageDeploymentTime[index] ? `${averageDeploymentTime[index]}s` : 'NA'}
    //                 </h1>
    //               </div>
    //             ))}
    //           </div>
    //         </CardBody>
    //       </Card>
    //     </GridItem>
    //     <GridItem span={6}>
    //       <Card
    //         isFullHeight
    //         style={{
    //           margin: '12px 12px',
    //           overflow: 'auto',
    //           scrollbarWidth: 'none',
    //           height: '130px'
    //         }}
    //         isRounded
    //       >
    //         <CardTitle>Total SPA&apos;s</CardTitle>
    //         <CardBody>
    //           <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{TotalProperty}</h1>
    //         </CardBody>
    //       </Card>
    //     </GridItem>
    //     <GridItem span={6}>
    //       <Card
    //         isFullHeight
    //         style={{
    //           margin: '12px 12px',
    //           overflow: 'auto',
    //           scrollbarWidth: 'none',
    //           height: '130px'
    //         }}
    //         isRounded
    //       >
    //         <CardTitle>Total Ephemeral Deployments</CardTitle>
    //         <CardBody>
    //           <h1 style={{ color: '#0066CC', fontSize: '28px' }}>
    //             {TotalDeploymentData.data
    //               ?.filter((ele) => ele.env === 'ephemeral')
    //               .reduce((acc, ele) => acc + ele.count, 0)}
    //           </h1>
    //         </CardBody>
    //       </Card>
    //     </GridItem>
    //   </Grid>
    //   <Split hasGutter className="pf-u-mt-md" style={{ padding: '12px', margin: '12px' }}>
    //     <SplitItem isFilled>
    //       <Card isFullHeight>
    //         <CardHeader>
    //           <CardTitle>
    //             <Title headingLevel="h6">Total Deployments per Environment</Title>
    //           </CardTitle>
    //         </CardHeader>
    //         <CardBody className="x-y-center pf-u-h-100">
    //           {deploymentCount.isLoading && <Skeleton shape="circle" width="160px" />}
    //           {!deploymentCount.isLoading && !deploymentCount.data && (
    //             <EmptyState>
    //               <EmptyStateIcon icon={CubesIcon} />
    //               <Title headingLevel="h4" size="lg">
    //                 No deployments found
    //               </Title>
    //             </EmptyState>
    //           )}
    //           {deploymentCount.isSuccess && (
    //             <ChartDonut
    //               ariaTitle="Number of deployments"
    //               constrainToVisibleArea
    //               data={donutChartData.data}
    //               labels={({ datum }) => `${datum.x}: ${datum.y}%`}
    //               legendData={donutChartData.names}
    //               legendOrientation="vertical"
    //               legendPosition="right"
    //               name="monthly-deployment"
    //               padding={{
    //                 bottom: 40,
    //                 left: 20,
    //                 right: 140,
    //                 top: 20
    //               }}
    //               subTitle="Deployments"
    //               title={`${donutChartData.total}`}
    //               width={400}
    //               height={220}
    //             />
    //           )}
    //         </CardBody>
    //       </Card>
    //     </SplitItem>
    //     <SplitItem isFilled>
    //       <Card
    //         isFullHeight
    //         style={{
    //           // overflow: 'auto',
    //           scrollbarWidth: 'none'
    //           // height: '400px'
    //         }}
    //         // isRounded
    //       >
    //         <CardHeader>
    //           <CardTitle>Past 30 days Deployment History</CardTitle>
    //         </CardHeader>
    //         <CardBody className="x-y-center pf-u-h-100 ">
    //           {monthlyDeployChart.isLoading && <Skeleton height="160px" width="90%" />}
    //           {monthlyDeployChart.isSuccess && Object.keys(monthlyDeployChart?.data).length ? (
    //             <Chart
    //               ariaDesc="Average number of pets"
    //               containerComponent={
    //                 <ChartVoronoiContainer
    //                   labels={({ datum }) => `${datum.name}: ${datum.y}`}
    //                   constrainToVisibleArea
    //                 />
    //               }
    //               legendData={lineChartLegend}
    //               legendOrientation="vertical"
    //               legendPosition="right"
    //               name="chart1"
    //               minDomain={{ y: 0 }}
    //               padding={{
    //                 bottom: 100,
    //                 left: 50,
    //                 right: 100, // Adjusted to accommodate legend
    //                 top: 50
    //               }}
    //               themeColor={ChartThemeColor.multiUnordered}
    //               width={700}
    //             >
    //               <ChartAxis />
    //               <ChartAxis dependentAxis showGrid tickFormat={(x) => Number(x)} />
    //               <ChartGroup>
    //                 {lineChartLegend.map(({ name }) => {
    //                   const chartData = monthlyDeployChart?.data?.[name]
    //                     .sort(
    //                       (a, b) =>
    //                         new Date(a.startDate).valueOf() - new Date(b.startDate).valueOf()
    //                     )

    //                     .map(({ count, startDate, endDate }) => ({
    //                       name,
    //                       x: `${dayjs(startDate).format(DATE_FORMAT)} - ${dayjs(endDate).format(
    //                         DATE_FORMAT
    //                       )}`,
    //                       y: count
    //                     }));
    //                   return <ChartLine key={`key-${name}`} data={chartData} />;
    //                 })}
    //               </ChartGroup>
    //             </Chart>
    //           ) : (
    //             <EmptyState>
    //               <EmptyStateIcon icon={CubesIcon} />
    //               <Title headingLevel="h4" size="lg">
    //                 No History found
    //               </Title>
    //             </EmptyState>
    //           )}
    //         </CardBody>
    //       </Card>
    //     </SplitItem>
    //   </Split>
    // </>
  );
};
