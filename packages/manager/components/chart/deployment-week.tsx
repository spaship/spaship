import { Text, TextContent, TextVariants } from "@patternfly/react-core";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import { Properties } from "../models/props";
import AggregateChart from "./aggregate-chart";

const ChartBorder = styled.div`
  height: 250px;
  width: 600px;
  border: 1px solid var(--spaship-global--Color--light-gray);
  opacity: 1;
`;


const DeploymentWeek: FunctionComponent<Properties> = ({ webprop }: Properties) => {
  const dependentAxisTickValues = getDependentAxisTickValues(webprop);
  const maxDomain = getMaxDomain(dependentAxisTickValues);
  const chartAxisTickValues = getChartAxisTickValues(webprop);
  const chartData = getChartData(webprop);
  const legendData = getLegendData(webprop);
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
    maxDomain: { y: maxDomain + (maxDomain / 3) },
    minDomain: { y: 0 },
    height: 250,
    width: 600,
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
    dependentAxisTickValues: dependentAxisTickValues,
  };
  return (
    <>
      <TextContent>
        <Text component={TextVariants.h1}> Deployments/Week </Text>
      </TextContent>
      <br />
      <ChartBorder>
        <div>
          <AggregateChart
            type={chartType}
            props={{
              chartConfig: chartConfig,
              chartData: chartData,
              chartAxisTickValues: chartAxisTickValues,
              dependentAxisTickValues: dependentAxisTickValues,
            }}
          ></AggregateChart>
        </div>
      </ChartBorder>
    </>
  );
};

export default DeploymentWeek;
function getLegendData(webprop: any) {
  return webprop.legendData;
}

function getChartData(webprop: any) {
  return webprop.processedMonthlyDeployments;
}

function getChartAxisTickValues(webprop: any) {
  return webprop.axisFrame;
}

function getMaxDomain(dependentAxisTickValues: any) {
  return dependentAxisTickValues[0] || 60;
}

function getDependentAxisTickValues(webprop: any) {
  return webprop?.axisValues || [10, 30, 50];
}

