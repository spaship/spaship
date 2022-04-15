import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import Body from "../../../../components/layout/body";
import { AnyProps, ContextProps, Properties } from "../../../../components/models/props";
import ApiKey from "../../../../components/settings/apiKey";
import DeleteSpa from "../../../../components/settings/deleteSpa";
import ManageSpa from "../../../../components/settings/manageSpa";
import { post } from "../../../../utils/api.utils";
import { getAllEventCountUrl, getEventAnalyticsUrl } from "../../../../utils/endpoint.utils";

export const getStaticPaths = async () => {
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
}

export const getStaticProps = async (context: ContextProps) => {
    const propertyReq = getPropertyRequest(context);
    const urlEvent = getEventAnalyticsUrl();
    const payloadCount = {
        "count": {
            "propertyName": propertyReq
        }
    };
    const response = await post<Properties>(urlEvent, payloadCount);
    return {
        props: { webprop: response },
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