import { Divider } from "@patternfly/react-core";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import styled from 'styled-components';
import Body from "../../../components/layout/body";
import { AnyProps, ContextProps, Properties } from "../../../components/models/props";
import ActivityStream from "../../../components/web-property/activityStream";
import SPAProperty from "../../../components/web-property/spaProperty";
import { post } from "../../../utils/api.utils";
import { getAllEventCountUrl, getEventAnalyticsUrl } from "../../../utils/endpoint.utils";

interface WebPropertyPageProps { }

export const StyledDivider = styled(Divider)`
  --pf-c-divider--BackgroundColor: var(--spaship-global--Color--bright-gray);
  margin: 1.5rem 0;
`;

export const getServerSidePaths = async () => {
    try {
        const url = getAllEventCountUrl();
        const payload = {
            "count": {
                "spa": true
            }
        }
        const response = await post<AnyProps>(url, payload);
        const paths: AnyProps = [];
        for (let prop of response) {
            if (prop?.propertyName)
                paths.push({ params: { propertyName: prop?.propertyName } });
        }
        return { paths, fallback: false }
    } catch (error) {
        return { props: {} };
    }
}

export const getServerSideProps = async (context: ContextProps) => {
    try {
        const propertyReq = getPropertyRequest(context);
        const urlEvent = getEventAnalyticsUrl();
        const payloadActivites = {
            "activities": {
                "propertyName": propertyReq
            }
        };
        const payloadCount = {
            "count": {
                "propertyName": propertyReq
            }
        };
        const response = await Promise.all([await post<Properties>(urlEvent, payloadActivites), await post<Properties>(urlEvent, payloadCount)]);
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
    const propertyName = router.query.propertyName || 'NA';
    const meta = getHeaderMeta(propertyName)
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
            { path: `/properties`, title: 'Home' },
            { path: `/properties`, title: 'Properties' },
            { path: `/properties/${propertyName}`, title: `${propertyName}` }
        ],
        previous: `/properties`,
        settings: `/properties/${propertyName}/settings`
    };
}

function getPropertyRequest(context: AnyProps) {
    return context.params.propertyName;
}