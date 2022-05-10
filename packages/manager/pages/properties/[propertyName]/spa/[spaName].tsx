import { Divider, Gallery, GalleryItem, Tab, Tabs, TabTitleIcon, TabTitleText } from "@patternfly/react-core";
import { PackageIcon, RunningIcon } from "@patternfly/react-icons";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import DeploymentWeek from "../../../../components/chart/deployment-week";
import TotalDeployment from "../../../../components/chart/total-deployment";
import Body from "../../../../components/layout/body";
import { AnyProps, ContextProps, Properties, SPAIndexProps } from "../../../../components/models/props";
import ActivityStream from "../../../../components/web-property/activityStream";
import { post } from "../../../../utils/api.utils";
import { ComponentWithAuth } from "../../../../utils/auth.utils";
import { getEventAnalyticsUrl } from "../../../../utils/endpoint.utils";

export const StyledDivider = styled(Divider)`
  --pf-c-divider--BackgroundColor: var(--spaship-global--Color--bright-gray);
  margin: 1.5rem 0;
`;

const StyledGallery = styled(Gallery)`
  margin-top: 1.5rem;
`;

export const getServerSideProps = async (context: ContextProps) => {
  try {
    const token = ((await getSession(context as any)) as any).accessToken;
    const propertyReq = getPropertyReq(context);
    const spaReq = getSpaReq(context);
    const url = getEventAnalyticsUrl();
    const payloadActivites = {
      activities: {
        propertyName: propertyReq,
        spaName: spaReq,
      },
    };
    const payloadTotalDeploymenets = {
      count: {
        propertyName: propertyReq,
        spaName: spaReq,
      },
    };
    const payloadMonthlyDeploymenets = {
      chart: {
        month: true,
        propertyName: propertyReq,
        spaName: spaReq,
      },
    };
    const response = await Promise.all([
      await post<Properties>(url, payloadActivites, token),
      await post<Properties>(url, payloadTotalDeploymenets, token),
      await post<Properties>(url, payloadMonthlyDeploymenets, token),
    ]);
    const [activitesResponse, totalDeploymentsResponse, monthlyDeploymentResponse]: AnyProps = response;
    let chartData: AnyProps = [];
    let labelData: AnyProps = [];
    let count = 0;
    if (totalDeploymentsResponse) {
      for (let item of totalDeploymentsResponse) {
        count = processTotalDeployments(item, count, chartData, labelData);
      }
    }
    const legendData = [];
    let tempLegendData: AnyProps = new Set();
    const { maxAxisValue, processedMonthlyDeployments } = getProcessedMonthlyDeployments(monthlyDeploymentResponse, tempLegendData);
    for (let env of tempLegendData) {
      legendData.push({ name: env });
    }
    const axisValues: AnyProps = [];
    getMaxAxisValues(maxAxisValue, axisValues);
    const axisFrame = [];
    let recentDate = new Date();
    for (let i = 1; i <= 4; i++) {
      const startDate = new Date(recentDate);
      startDate.setDate(recentDate.getDate() - 7);
      const axisTick = startDate.getDate() + "-" + startDate.toLocaleDateString('en-us', { month: 'long' });
      axisFrame.push(axisTick);
      recentDate = startDate;
    }
    return {
      props: {
        activites: activitesResponse,
        totalDeployments: { chartData: chartData, labelData: labelData, count: count },
        monthlyDeployments: { processedMonthlyDeployments: processedMonthlyDeployments, legendData: legendData, axisValues: axisValues, axisFrame: axisFrame },
      },
    };
  } catch (error) {
    return { props: {} };
  }
};

const SPAProperties: ComponentWithAuth<SPAIndexProps> = ({
  activites,
  totalDeployments,
  monthlyDeployments,
}: SPAIndexProps) => {
  const maxWidths = {
    md: "780px",
    lg: "380px",
    "2xl": "400px",
  };
  const [activeTabKey, setActiveTabKey] = useState(0);
  const handleTab = (_event: any, tabIndex: any) => {
    setActiveTabKey(tabIndex);
  };
  const router = useRouter();
  const propertyName = router.query.propertyName || "";
  const spaName = router.query.spaName;
  const meta = getHeaderData(propertyName, spaName);
  return (
    <Body {...meta}>
      <Tabs
        activeKey={activeTabKey}
        onSelect={handleTab}
        isBox
        aria-label="Tabs for users and containers">
        <Tab
          eventKey={0}
          title={
            <>
              <TabTitleIcon>
                <PackageIcon />
              </TabTitleIcon>
              <TabTitleText>Deployments Dashboard</TabTitleText>
            </>
          }
        >
          <StyledGallery hasGutter maxWidths={maxWidths}>
            <GalleryItem>
              <TotalDeployment webprop={totalDeployments}></TotalDeployment>{" "}
            </GalleryItem>
            <GalleryItem>
              <DeploymentWeek webprop={monthlyDeployments}></DeploymentWeek>{" "}
            </GalleryItem>
          </StyledGallery>
        </Tab>
        <Tab
          eventKey={1}
          title={
            <>
              <TabTitleIcon>
                <RunningIcon />
              </TabTitleIcon>
              <TabTitleText>Deployment Log</TabTitleText>
            </>
          }
        >
          <ActivityStream webprop={activites}></ActivityStream>
        </Tab>
      </Tabs>
    </Body>
  );
};

function getMaxAxisValues(maxAxisValue: number, axisValues: any[]) {
  if (maxAxisValue != 0) {
    axisValues.push(maxAxisValue);
    axisValues.push(Math.floor(maxAxisValue / 3) * 2);
    axisValues.push(Math.floor(maxAxisValue / 3));
  }
}

function getProcessedMonthlyDeployments(monthlyDeploymentResponse: any, tempLegendData: any) {
  let maxAxisValue = 0;
  const processedMonthlyDeployments = [];
  for (const item in monthlyDeploymentResponse) {
    const data = monthlyDeploymentResponse[item];
    const temp = [];
    let i = 1;
    for (const prop of data) {
      tempLegendData.add(prop.env);
      const startDate = new Date(prop.startDate);
      const axisTick = startDate.getDate() + "-" + startDate.toLocaleDateString('en-us', { month: 'long' });
      temp.push({ name: prop.env, x: axisTick, y: prop?.count });
      maxAxisValue = Math.max(maxAxisValue, prop?.count);
    }
    processedMonthlyDeployments.push(temp);
  }
  return { maxAxisValue, processedMonthlyDeployments };
}

function getHeaderData(propertyName: string | string[], spaName: string | string[] | undefined) {
  return {
    title: getPropertyTitle(),
    breadcrumbs: [
      { path: `/properties`, title: 'Home' },
      { path: `/properties`, title: 'Properties' },
      { path: `/properties/${propertyName}`, title: `${getPropertyTitle()}` },
      { path: `/properties/${propertyName}/spa/${spaName}`, title: `${spaName}` },
    ],
    previous: `/properties/${propertyName}`,
    settings: `/properties/${propertyName}/settings`
  };
  function getPropertyTitle() {
    return propertyName.toString().replace("-", " ");
  }
}

function getSpaReq(context: AnyProps) {
  return context.params.spaName;
}

function getPropertyReq(context: AnyProps) {
  return context.params.propertyName;
}

function processTotalDeployments(item: AnyProps, count: number, chartData: AnyProps, labelData: AnyProps) {
  const value = JSON.parse(JSON.stringify(item));
  count += value.count;
  const dataPoint = {
    x: value.env,
    y: value.count,
  };
  chartData.push(dataPoint);
  const label = {
    name: value.env + " : " + value.count,
  };
  labelData.push(label);
  return count;
}

SPAProperties.authenticationEnabled = true;
export default SPAProperties;
