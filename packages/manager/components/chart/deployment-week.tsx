import {
  Text, TextContent, TextVariants
} from "@patternfly/react-core";
import React, { FunctionComponent } from "react";
import styled from 'styled-components';
import { Properties } from "../models/props";
import AggregateChart from "./aggregate-chart";

const ChartBorder = styled.div`
  height: 250px;
  width: 600px;
  border: 1px solid var(--spaship-global--Color--light-gray);
  opacity: 1;
`;

const dependentAxisTickValues = [10, 30, 50];
const chartAxisTickValues = ['week 1', 'week 2', 'week 3', 'week 4'];

const DeploymentWeek: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const chartData = webprop.processedMonthlyDeployments;
  const legendData = webprop.legendData;
  const chartType = "month";
  const padding = {
    bottom: 50,
    left: 50,
    right: 200,
    top: 50,
  };
  const areaConfig = {
    ariaTitle: "Deployments/Week",
    legendOrientation: "vertical",
    legendPosition: "right",
    maxDomain: { y: 60 },
    minDomain: { y: 0 },
    height: 250,
    width: 600
  };
  const chartConfig = {
    ariaTitle: areaConfig.ariaTitle,
    legendData: legendData,
    legendOrientation: areaConfig.legendOrientation,
    legendPosition: areaConfig.legendPosition,
    height: areaConfig.height,
    maxDomain: areaConfig.maxDomain,
    minDomain: areaConfig.minDomain,
    padding: padding,
    width: areaConfig.width,
    chartData: chartData,
    chartAxisTickValues: chartAxisTickValues,
    dependentAxisTickValues: dependentAxisTickValues
  };
  return (
    <>
      <TextContent>
        <Text component={TextVariants.h1}> Deployments/Week </Text>
      </TextContent><br />
      <ChartBorder>
        <div>
          <AggregateChart type={chartType} props={{
            chartConfig: chartConfig, chartData: chartData,
            chartAxisTickValues: chartAxisTickValues,
            dependentAxisTickValues: dependentAxisTickValues
          }}></AggregateChart>
        </div>
      </ChartBorder>
    </>
  );
}

export default DeploymentWeek;