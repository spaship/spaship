/* eslint-disable react/require-default-props */
import { pageLinks } from '@app/links';
import { TSPADeploymentCount } from '@app/services/analytics/types';
import {
  Card,
  CardBody,
  Grid,
  GridItem,
  Text,
  TextContent,
  TextVariants
} from '@patternfly/react-core';
import { UseQueryResult } from '@tanstack/react-query';
import Link from 'next/link';

const TotalDeploymentCardFields = ['Dev', 'QA', 'Stage', 'Prod'];
const DeploymentTimeFrames = ['30 days', '90 days', '180 days', '365 days'];

type Props = {
  TotalDeployment?: number;
  TotalProperty: number;
  averageDeploymentTime: number[];
  bestDeploymentTime?: number;
  bestDeploymentTimeIndex: number;
  TotalDeploymentData: UseQueryResult<TSPADeploymentCount[]>;
  totalTimeSaved?: number;
};

export const Analytics = ({
  TotalDeployment,
  TotalProperty,
  averageDeploymentTime,
  bestDeploymentTime,
  bestDeploymentTimeIndex,
  TotalDeploymentData,
  totalTimeSaved
}: Props) => (
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
    <Grid span={3}>
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
                    <Text component={TextVariants.p} style={{ fontSize: '20px', color: '#151515' }}>
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
                <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                  <Text component={TextVariants.p} className="dashboard-card">
                    {bestDeploymentTime}s
                  </Text>
                  <Text
                    component={TextVariants.p}
                    style={{ fontSize: '14px', paddingLeft: '8px', fontFamily: 'Red Hat Text' }}
                  >
                    in past {DeploymentTimeFrames[bestDeploymentTimeIndex]}
                  </Text>
                </div>
                <Text component={TextVariants.h2}>Average time to deploy</Text>
              </>
            ) : (
              ''
            )}

            <div style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}>
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
                <Text component={TextVariants.p} className="dashboard-card">
                  {TotalProperty}
                </Text>
                <Text component={TextVariants.h2}>Total Web Properties</Text>
                <div
                  style={{
                    marginTop: '24px'
                  }}
                >
                  <Text component={TextVariants.p} className="dashboard-card-subheadings">
                    {totalTimeSaved} hrs
                  </Text>
                  <Text
                    component={TextVariants.p}
                    style={{
                      fontSize: '14px',
                      fontWeight: 400,
                      color: '#3C3F42'
                    }}
                  >
                    Total Time Saved
                  </Text>
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
            <Text component={TextVariants.p} className="dashboard-card">
              {TotalDeploymentData.data
                ?.filter((ele) => ele.env === 'ephemeral')
                .reduce((acc, ele) => acc + ele.count, 0)}
            </Text>
            <Text component={TextVariants.h2}>Total Ephemeral Deployments</Text>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  </Card>
);
