import { Card, CardTitle, CardBody, Grid, GridItem } from '@patternfly/react-core';

import React from 'react';
import {
  useGetTotalDeployments,
  useGetDeploymentCounts,
  useGetDeploymentsTime,
  useGetMonthlyDeploymentChart
} from '@app/services/analytics';

const TotalDeploymentCardFields = ['Dev', 'QA', 'Stage', 'Prod'];

export const StatsGrid = () => {
  const TotalDeploymentData = useGetTotalDeployments();
  const Totaldeployment = TotalDeploymentData.data?.reduce((acc, obj) => acc + obj.count, 0);
  const TotalDeploymentCountsData = useGetDeploymentCounts();
  const TotalProperty = Object.keys(TotalDeploymentCountsData.data || {}).length;
  const TotalDeploymentsTimeData = useGetDeploymentsTime();
  const averageTime = TotalDeploymentsTimeData.data?.averageTime;
  const TotalMonthlyDeploymentData = useGetMonthlyDeploymentChart('', undefined, false);
  const lastMonthEphemeral = TotalMonthlyDeploymentData.data?.ephemeral?.reduce(
    (acc, obj) => acc + obj.count,
    0
  );

  return (
    <Grid style={{ padding: '12px 12px' }}>
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
          <CardTitle>Total Deployment</CardTitle>
          <CardBody>
            <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{Totaldeployment}</h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}>
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
                        !TotalDeploymentCardFields.map((str) => str.toLocaleLowerCase()).includes(
                          ele.env
                        )
                    )
                    .reduce((acc, ele) => acc + ele.count, 0)}
                </h1>
              </div>
            </div>
          </CardBody>
        </Card>
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
          <CardTitle>Total Ephemeral Deployment</CardTitle>
          <CardBody>
            <h1 style={{ color: '#0066CC', fontSize: '28px' }}>
              {TotalDeploymentData.data
                ?.filter((ele) => ele.env === 'ephemeral')
                .reduce((acc, ele) => acc + ele.count, 0)}
            </h1>
            <div style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}>
              <div style={{ display: 'flex', flexDirection: 'column' }}>
                <h1 style={{ fontSize: '12px' }}>Last month</h1>
                <h1 style={{ fontSize: '12px' }}>{lastMonthEphemeral}</h1>
              </div>
            </div>
          </CardBody>
        </Card>
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
          <CardTitle>Total Property</CardTitle>
          <CardBody>
            <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{TotalProperty}</h1>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={6}>
        <Card
          isSelectable
          isFullHeight
          style={{
            marginLeft: '12px',
            marginRight: '12px',
            marginTop: '12px',
            marginBottom: '12px',
            overflow: 'auto',
            scrollbarWidth: 'none',
            height: '130px'
          }}
          isRounded
        >
          <CardTitle>Average time to deploy</CardTitle>
          <CardBody style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
            <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{`${averageTime}s`} </h1>
            <h1 style={{ fontSize: '12px' }}>/ per property</h1>
          </CardBody>
        </Card>
      </GridItem>
    </Grid>
  );
};
