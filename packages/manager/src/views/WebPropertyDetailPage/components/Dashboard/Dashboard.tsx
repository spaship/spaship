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
                                {TotalDeploymentData.data?.filter(
                                  (ele) => ele.env === field.toLocaleLowerCase()
                                ).length
                                  ? TotalDeploymentData.data
                                      ?.filter((ele) => ele.env === field.toLocaleLowerCase())
                                      .map((ele) => ele.count)
                                  : 0}
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
              margin: '24px 24px 24px 0px',
              paddingLeft: '12px',
              height: '1010px',
              overflow: 'hidden'
            }}
            className={css('pf-u-px-lg rounded-md transition hover:shadow-sm')}
          >
            <CardTitle style={{ borderBottom: '1px solid #D2D2D2' }}>
              <Text component={TextVariants.h5}>Activity Stream</Text>
            </CardTitle>

            <SimpleBarReact style={{ maxHeight: 900 }}>
              <div style={{ marginTop: '30px' }}>
                <ActivityStream action="APPLICATION_DEPLOYED" isGlobal />
              </div>
            </SimpleBarReact>
          </Card>
        </div>
      </div>
    </div>
  );
};
