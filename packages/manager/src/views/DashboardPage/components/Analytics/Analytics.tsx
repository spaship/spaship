/* eslint-disable react/require-default-props */
import { pageLinks } from '@app/links';
import { TSPADeploymentCount } from '@app/services/analytics/types';
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
import { UseQueryResult } from '@tanstack/react-query';
import Link from 'next/link';

const TotalDeploymentCardFields = ['Dev', 'QA', 'Stage', 'Prod'];
const DeploymentTimeFrames = ['30 days', '90 days', '180 days', '365 days'];

type ITotalMonthlyDeploymentData = {
  [key: string]: {
    count: number;
    startDate: string;
    endDate: string;
  }[];
};
type Props = {
  TotalMonthlyDeploymentData: ITotalMonthlyDeploymentData;
  TotalDeployment?: number;
  TotalProperty: number;
  averageDeploymentTime: number[];
  bestDeploymentTime?: number;
  bestDeploymentTimeIndex: number;
  TotalDeploymentData: UseQueryResult<TSPADeploymentCount[]>;
  minCount: number;
  maxCount: number;
};

export const Analytics = ({
  TotalMonthlyDeploymentData,
  TotalDeployment,
  TotalProperty,
  averageDeploymentTime,
  bestDeploymentTime,
  bestDeploymentTimeIndex,
  TotalDeploymentData,
  minCount,
  maxCount
}: Props) => (
  <Card style={{ margin: '24px 24px' }}>
    <TextContent
      style={{ marginBottom: '10px', marginTop: '24px', marginLeft: '24px', fontSize: '20px' }}
    >
      <Text component={TextVariants.h1}>SPAship Deployment Analysis</Text>
    </TextContent>
    <Grid>
      <GridItem span={3}>
        <Link href={pageLinks.webPropertyListPage}>
          <a className="text-decoration-none">
            <Card
              isSelectable
              isFullHeight
              style={{
                // margin: '12px 12px',
                // overflow: 'auto',
                scrollbarWidth: 'none',
                height: '190px',
                border: '1px solid grey'
              }}
              isRounded
            >
              <CardTitle>Total Deployments</CardTitle>
              <CardBody>
                <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{TotalDeployment}</h1>
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
      <GridItem span={3}>
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
            {bestDeploymentTime ? (
              <div style={{ display: 'flex', flexDirection: 'row', alignItems: 'baseline' }}>
                <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{bestDeploymentTime}s</h1>
                <h1 style={{ fontSize: '14px', paddingLeft: '8px' }}>
                  in past {DeploymentTimeFrames[bestDeploymentTimeIndex]}
                </h1>
              </div>
            ) : (
              ''
            )}

            <div style={{ display: 'flex', flexDirection: 'row', gap: '35px', marginTop: '24px' }}>
              {DeploymentTimeFrames.map((field, index) => (
                <div key={field} style={{ display: 'flex', flexDirection: 'column' }}>
                  <h1 style={{ fontSize: '12px' }}>{`Past ${field}`}</h1>
                  <h1 style={{ fontSize: '12px' }}>
                    {averageDeploymentTime[index] ? `${averageDeploymentTime[index]}s` : ''}
                  </h1>
                </div>
              ))}
            </div>
          </CardBody>
        </Card>
      </GridItem>
      <GridItem span={3}>
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
              <CardTitle>Total Properties</CardTitle>
              <CardBody>
                <h1 style={{ color: '#0066CC', fontSize: '28px' }}>{TotalProperty}</h1>
              </CardBody>
            </Card>
          </a>
        </Link>
      </GridItem>
      <GridItem span={3}>
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
  </Card>
);
