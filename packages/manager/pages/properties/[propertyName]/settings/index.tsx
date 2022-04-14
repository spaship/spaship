import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import Body from "../../../../components/layout/body";
import { DataPoint } from "../../../../components/models/chart";
import { AnyProps, ContextProps, Properties } from "../../../../components/models/props";
import ApiKey from "../../../../components/settings/apiKey";
import DeleteSpa from "../../../../components/settings/deleteSpa";
import ManageSpa from "../../../../components/settings/manageSpa";
import { get } from "../../../../utils/api.utils";
import { getSpaListUrl, getWebPropertyListUrl } from "../../../../utils/endpoint.utils";

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
    const response = await get<Properties>(urlList);
    let listResponse: DataPoint[] = [];
    const checkSpa = new Set();
    if (response) {
        const data = await response;
        listResponse = processProperties(data, checkSpa, listResponse);
    }
    return {
        props: { webprop: listResponse },
    };
};

const SettingsPage: FunctionComponent<Properties> = ({ webprop }: Properties) => {
    const router = useRouter();
    const propertyName = router.query.propertyName || '';
    const meta = getHeaderData(propertyName)
    return (
        <Body {...meta}>
            <ManageSpa webprop={webprop}></ManageSpa>
            <ApiKey></ApiKey>
            <DeleteSpa></DeleteSpa>
        </Body>
    );
};

export default SettingsPage;

function getHeaderData(propertyName: string | string[]) {
    return {
        title: propertyName.toString(),
        breadcrumbs: [
            { path: `/properties`, title: 'Home' },
            { path: `/properties`, title: 'Properties' },
            { path: `/properties/${propertyName}`, title: `${propertyName}` },
        ],
        previous: `/properties`,
        settings: `/properties/${propertyName}/settings`
    };
}

function getPropertyRequest(context: AnyProps) {
    return context.params.propertyName;
}

function getSpaName(eachSpa: AnyProps): string {
    if (!eachSpa.spaName) return '';
    return eachSpa?.spaName.trim().replace(/^\/|\/$/g, '') || null;
}

function processProperties(data: AnyProps, checkSpa: Set<AnyProps>, response: AnyProps) {
    for (let item of data) {
        let spas = item?.spa;
        for (let eachSpa of spas) {
            const reqSpaName = getSpaName(eachSpa);
            if (eachSpa?.spaName && reqSpaName.length > 0 && !checkSpa.has(reqSpaName)) {
                checkSpa.add(reqSpaName);
                response.push({
                    spaName: reqSpaName,
                    envs: eachSpa.envs,
                    contextPath: eachSpa.contextPath,
                    propertyName: item.webPropertyName,
                    createdAt: item.createdAt
                });
            }
        }
    }
    return response;
}


