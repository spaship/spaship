import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import styled from 'styled-components';
import Body from "../../../components/layout/body";
import { DataPoint } from "../../../components/models/chart";
import { AnyProps, ContextProps, Properties } from "../../../components/models/props";
import ActivityStream from "../../../components/web-property/activityStream";
import SPAProperty from "../../../components/web-property/spaProperty";
import { get, post } from "../../../utils/api.utils";
import { getEventAnalyticsUrl, getSpaListUrl, getWebPropertyListUrl } from "../../../utils/endpoint.utils";

interface WebPropertyPageProps { }

export const DividerComp = styled.hr`
  border-top: 1px solid var(--spaship-global--Color--bright-gray);
  width: 60vw;
`;

export const getStaticPaths = async () => {
    const url = getWebPropertyListUrl();
    const propertyListResponse = await get<AnyProps>(url);
    const paths = propertyListResponse.map((property: AnyProps) => ({
        params: { propertyName: property.webPropertyName },
    }))
    return { paths, fallback: false }
}

export const getStaticProps = async (context: ContextProps) => {
    const propertyReq = getPropertyRequest(context);
    const urlList = getSpaListUrl(propertyReq);
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
    const response = await Promise.all([await get<Properties>(urlList), await post<Properties>(urlEvent, payloadActivites), await post<Properties>(urlEvent, payloadCount)]);
    const [listResponse, activitesResponse, countResponse]: AnyProps = response;
    let processedListResponse: DataPoint[] = [];
    const checkSpa = new Set();
    if (listResponse) {
        const data = await listResponse;
        processedListResponse = processProperties(data, checkSpa, processedListResponse);
    }
    for (let i in processedListResponse) {
        let obj = countResponse.find((prop: AnyProps) => prop.spaName === processedListResponse[i].spaName);
        processedListResponse[i].count = obj?.count || 0;
    }


    return {
        props: { webprop: processedListResponse, activites: activitesResponse },
    };
};

const WebPropertyPage: FunctionComponent<WebPropertyPageProps> = ({ webprop, activites }: AnyProps) => {
    const router = useRouter();
    const propertyName = router.query.propertyName || 'NA';
    const meta = getHeaderMeta(propertyName)
    return (
        <Body {...meta}>
            <SPAProperty webprop={webprop}></SPAProperty>
            <br />
            <DividerComp />
            <br />
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
        previous: `properties`,
        settings: `/properties/${propertyName}/settings`
    };
}

function getPropertyRequest(context: AnyProps) {
    return context.params.propertyName;
}

function getSpaName(eachSpa: AnyProps): string {
    if (!eachSpa.spaName) return '';
    return eachSpa?.spaName?.trim().replace(/^\/|\/$/g, '') || null;
}

function processProperties(data: AnyProps, checkSpa: Set<AnyProps>, response: AnyProps) {
    for (let prop of data) {
        let spas = prop?.spa;
        for (let eachSpa of spas) {
            const reqSpaName = getSpaName(eachSpa);
            if (eachSpa?.spaName && reqSpaName.length > 0 && !checkSpa.has(reqSpaName)) {
                checkSpa.add(reqSpaName);
                response.push({
                    spaName: reqSpaName,
                    envs: eachSpa.envs,
                    contextPath: eachSpa.contextPath,
                    propertyName: prop.webPropertyName,
                    createdAt: prop.createdAt
                });
            }
        }
    }
    return response;
}
