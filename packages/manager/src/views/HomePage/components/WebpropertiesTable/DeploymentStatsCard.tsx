import React from 'react';
import {
  Card,
  CardBody,
  CardHeader,
  Split,
  SplitItem,
  Text,
  TextVariants
} from '@patternfly/react-core';
import {
  useGetMonthlyDeploymentsTime,
  useGetQuarterlyDeploymentsTime,
  useGetHalfYearlyDeploymentsTime,
  useGetYearlyDeploymentsTime
} from '@app/services/analytics';

export const DeploymentStatsCard = () => {
  const monthlyDeployments = useGetMonthlyDeploymentsTime('', '').data ?? 0;
  const quarterlyDeployments = useGetQuarterlyDeploymentsTime('', '').data ?? 0;
  const halfYearlyDeployments = useGetHalfYearlyDeploymentsTime('', '').data ?? 0;
  const yearlyDeployments = useGetYearlyDeploymentsTime('', '').data ?? 0;

  return (
    <Card className="pf-u-my-md pf-u-mr-md">
      <CardHeader className="card-header">Deployment stats</CardHeader>
      <CardBody>
        <p className="sub-text">
          <span className="large-text">{monthlyDeployments}</span> in past 30 days
        </p>
        <Text component={TextVariants.p} className="average-time">
          Average Time to Deploy
        </Text>
        <Split hasGutter className="pf-u-pt-md">
          <SplitItem isFilled>
            <div className="item-text">
              {quarterlyDeployments}
              <Text component={TextVariants.p} className="sub-text">
                Past 90 days
              </Text>
            </div>
          </SplitItem>
          <SplitItem isFilled>
            <div className="item-text">
              {halfYearlyDeployments}
              <Text component={TextVariants.p} className="sub-text">
                Past 180 days
              </Text>
            </div>
          </SplitItem>
          <SplitItem isFilled>
            <div className="item-text">
              {yearlyDeployments}
              <Text component={TextVariants.p} className="sub-text">
                Past 365 days
              </Text>
            </div>
          </SplitItem>
        </Split>
      </CardBody>
    </Card>
  );
};
