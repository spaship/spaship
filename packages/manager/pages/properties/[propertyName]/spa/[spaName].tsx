import { Divider, Gallery, GalleryItem } from "@patternfly/react-core";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
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
    const processedMonthlyDeployments = [];
    const legendData = [];
    let tempLegendData: AnyProps = new Set();
    for (const item in monthlyDeploymentResponse) {
      const data = monthlyDeploymentResponse[item];
      const temp = [];
      let i = 1;
      for (const prop of data) {
        tempLegendData.add(prop.envs);
        temp.push({ name: prop.envs, x: `week ${i++}`, y: prop?.count });
      }
      processedMonthlyDeployments.push(temp);
    }
    for (let env of tempLegendData) {
      legendData.push({ name: env });
    }
    return {
      props: {
        activites: activitesResponse,
        totalDeployments: { chartData: chartData, labelData: labelData, count: count },
        monthlyDeployments: { processedMonthlyDeployments: processedMonthlyDeployments, legendData: legendData },
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
  const router = useRouter();
  const propertyName = router.query.propertyName || "";
  const spaName = router.query.spaName;
  const meta = getHeaderData(propertyName, spaName);
  return (
    <Body {...meta}>
      <Gallery hasGutter maxWidths={maxWidths}>
        <GalleryItem>
          <TotalDeployment webprop={totalDeployments}></TotalDeployment>{" "}
        </GalleryItem>
        <GalleryItem>
          <DeploymentWeek webprop={monthlyDeployments}></DeploymentWeek>{" "}
        </GalleryItem>
      </Gallery>
      <br />
      <StyledDivider />
      <br />
      <ActivityStream webprop={activites}></ActivityStream>
    </Body>
  );
};

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
