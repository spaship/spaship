import { Divider } from "@patternfly/react-core";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import Body from "../../../components/layout/body";
import { AnyProps, ContextProps, Properties } from "../../../components/models/props";
import ActivityStream from "../../../components/web-property/activityStream";
import SPAProperty from "../../../components/web-property/spaProperty";
import { post } from "../../../utils/api.utils";
import { getEventAnalyticsUrl } from "../../../utils/endpoint.utils";

interface WebPropertyPageProps {}

export const StyledDivider = styled(Divider)`
  --pf-c-divider--BackgroundColor: var(--spaship-global--Color--bright-gray);
  margin: 1.5rem 0;
`;

export const getServerSideProps = async (context: ContextProps) => {
  try {
    const token = ((await getSession(context as any)) as any).accessToken;
    const propertyReq = getPropertyRequest(context);
    const urlEvent = getEventAnalyticsUrl();
    const payloadActivites = {
      activities: {
        propertyName: propertyReq,
      },
    };
    const payloadCount = {
      count: {
        propertyName: propertyReq,
      },
    };
    const response = await Promise.all([
      await post<Properties>(urlEvent, payloadActivites, token),
      await post<Properties>(urlEvent, payloadCount, token),
    ]);
    const [activitesResponse, countResponse]: AnyProps = response;
    return {
      props: { webprop: countResponse, activites: activitesResponse },
    };
  } catch (error) {
    return { props: {} };
  }
};

const WebPropertyPage: FunctionComponent<WebPropertyPageProps> = ({ webprop, activites }: AnyProps) => {
  const router = useRouter();
  const propertyName = router.query.propertyName || "NA";
  const meta = getHeaderMeta(propertyName);
  return (
    <Body {...meta}>
      <SPAProperty webprop={webprop}></SPAProperty>
      <StyledDivider />
      <ActivityStream webprop={activites}></ActivityStream>
    </Body>
  );
};

export default WebPropertyPage;

function getHeaderMeta(propertyName: string | string[]) {
  return {
    title: propertyName.toString(),
    breadcrumbs: [
      { path: `/properties`, title: "Home" },
      { path: `/properties`, title: "Properties" },
      { path: `/properties/${propertyName}`, title: `${propertyName}` },
    ],
    previous: `/properties`,
    settings: `/properties/${propertyName}/settings`,
  };
}

function getPropertyRequest(context: AnyProps) {
  return context.params.propertyName;
}
