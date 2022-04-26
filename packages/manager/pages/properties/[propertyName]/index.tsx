import {
    Divider,
    Title,
    Button,
    EmptyState,
    EmptyStateVariant,
    EmptyStateIcon,
    EmptyStateBody,
    EmptyStateSecondaryActions
} from "@patternfly/react-core";
import { CubesIcon, FileIcon, OutlinedWindowRestoreIcon } from "@patternfly/react-icons";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import Body from "../../../components/layout/body";
import { AnyProps, ContextProps, Properties } from "../../../components/models/props";
import ActivityStream from "../../../components/web-property/activityStream";
import SPAProperty from "../../../components/web-property/spaProperty";
import { post } from "../../../utils/api.utils";
import { getGuideUrl } from "../../../utils/config.utils";
import { getEventAnalyticsUrl } from "../../../utils/endpoint.utils";

interface WebPropertyPageProps {}

export const StyledDivider = styled(Divider)`
  --pf-c-divider--BackgroundColor: var(--spaship-global--Color--bright-gray);
  margin: 1.5rem 0;
`;

export const getServerSideProps = async (context: ContextProps) => {
    try {
        const token = (await getSession(context as any) as any).accessToken;
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
        const response = await Promise.all(
            [
                await post<Properties>(urlEvent, payloadActivites, token),
                await post<Properties>(urlEvent, payloadCount, token)
            ]
        );
        const [activitesResponse, countResponse]: AnyProps = response;
        if (activitesResponse == null || countResponse == null) {
            return { props: { url: getGuideUrl() } };
        }
        return {
            props: { webprop: countResponse, activites: activitesResponse },
        };

    } catch (error) {
        return { props: {} };
    }
};

const WebPropertyPage: FunctionComponent<WebPropertyPageProps> = ({ webprop, activites, url }: AnyProps) => {
    const router = useRouter();
    const propertyName = router.query.propertyName || 'NA';
    const meta = getHeaderMeta(propertyName);
    if (!webprop || !activites) {
        return (
            <Body {...meta}>
                <EmptyState variant={EmptyStateVariant.xl}>
                    <EmptyStateIcon icon={OutlinedWindowRestoreIcon} />
                    <Title headingLevel="h5" size="4xl">
                        No SPA Deployed yet
                    </Title>
                    <EmptyStateBody>
                        Hey, Currently you don't have any spa deployed, hurry up and deploy you spa.  <br />
                        Follow these steps to quickly Deploy your SPA:  <br /><br />
                        Step 1 : Generate API Key (Go to Settings)<br />
                        Step 2 : install spaship cli in your local system < br />
                        Step 3 : set env (spaship env -name={"''"}   -url={"''"} -apikey={"''"} )< br />
                        Step 4 : initialize spaship.yaml (spaship init)< br />
                        Step 5 : pack your build (npm pack)< br />
                        Step 6 : deploy your spa (spaship deploy -env={"''"} zipfile)< br />
                    </EmptyStateBody>
                    <EmptyStateSecondaryActions>
                        <a target="_blank" href={url}>SPAship Instruction Guide</a>
                    </EmptyStateSecondaryActions>
                </EmptyState>
            </Body>
        );
    }
    else {
        return (
            <Body {...meta}>
                <SPAProperty webprop={webprop}></SPAProperty>
                <StyledDivider />
                <ActivityStream webprop={activites}></ActivityStream>
            </Body>
        );
    }

};

export default WebPropertyPage;

function getHeaderMeta(propertyName: string | string[]) {
    return {
        title: getPropertyTitle(),
        breadcrumbs: [
            { path: `/properties`, title: 'Home' },
            { path: `/properties`, title: 'Properties' },
            { path: `/properties/${propertyName}`, title: `${getPropertyTitle()}` }
        ],
        previous: `/properties`,
        settings: `/properties/${propertyName}/settings`
    };

    function getPropertyTitle() {
        return propertyName.toString().replace("-", " ");
    }
}

function getPropertyRequest(context: AnyProps) {
  return context.params.propertyName;
}
