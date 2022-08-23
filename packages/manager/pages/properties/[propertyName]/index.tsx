import {
  Divider,
  Title,
  EmptyState,
  EmptyStateVariant,
  EmptyStateIcon,
  EmptyStateBody,
  EmptyStateSecondaryActions,
  ListItem,
  List,
  Text,
  Tabs,
  TabTitleIcon,
  TabTitleText,
  Tab,
  CodeBlock,
  CodeBlockCode
} from "@patternfly/react-core";
import {
  AutomationIcon,
  BundleIcon,
  CogIcon,
  CubeIcon,
  CubesIcon,
  KeyIcon,
  PackageIcon,
  PficonTemplateIcon,
  PlusIcon,
  RunningIcon
} from "@patternfly/react-icons";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { useState } from "react";
import styled from "styled-components";
import Body from "../../../components/layout/body";
import { AnyProps, ContextProps, Properties } from "../../../components/models/props";
import ActivityStream from "../../../components/web-property/activityStream";
import SPAProperty from "../../../components/web-property/spaProperty";
import { get, post } from "../../../utils/api.utils";
import { ComponentWithAuth } from "../../../utils/auth.utils";
import { getGuideUrl } from "../../../utils/config.utils";
import { getEnvListUrl, getEventAnalyticsUrl, getSpaListUrl } from "../../../utils/endpoint.utils";

interface WebPropertyPageProps { }

export const StyledDivider = styled(Divider)`
  --pf-c-divider--BackgroundColor: var(--spaship-global--Color--bright-gray);
  margin: 1.5rem 0;
`;

const Pre = styled.pre`
  background: var(--spaship-global--Color--text-black);
  border: 1px solid #dddddd;
  border-radius: 3px;
  text-align: left;
  margin: 0.25rem 0 0.75rem 0;
  color: var(--spaship-global--Color--light-gray);
  padding: 0 0.5rem;
  white-space: pre-wrap;
`;

const StyledImg = styled.img`
  height: 1rem;
  margin-bottom: -0.2rem;
`;

const StyledList = styled(List)`
  margin-top: 1rem;
  --pf-c-list--li--MarginTop: .5rem;
  --pf-c-list__item-icon--Color: var(--spaship-global--Color--text-black);
`;

const StyledText = styled(Text)`
  color: var(--spaship-global--Color--ui-blue);
  margin-left: 0.5rem;
  cursor: pointer;
`;

const StyledCodeBlock = styled(CodeBlock)`
  text-align: left;
`;

export const getServerSideProps = async (context: ContextProps) => {
  try {
    const token = (await getSession(context as any) as any).accessToken;
    const propertyReq = getPropertyRequest(context);
    const urlEvent = getEventAnalyticsUrl();
    const spaListUrl = getSpaListUrl(propertyReq);
    const envListUrl = getEnvListUrl(propertyReq);
    const payloadActivites = {
      "activities": {
        "propertyName": propertyReq
      }
    };
    const response = await Promise.all(
      [
        await post<Properties>(urlEvent, payloadActivites, token),
        await get<Properties>(spaListUrl, token),
        await get<Properties>(envListUrl, token),
      ]
    );
    const [activitiesResponse, countResponse, envList]: AnyProps = response;
    if (!activitiesResponse?.length || !countResponse?.length) {
      return { props: { url: getGuideUrl() } };
    }
    return {
      props: { webprop: { countResponse, envList }, activities: activitiesResponse, envList },
    };
  } catch (error) {
    return { props: {} };
  }
};

const WebPropertyPage: ComponentWithAuth<WebPropertyPageProps> = ({ webprop, activities, url }: AnyProps) => {
  const router = useRouter();
  const [activeTabKey, setActiveTabKey] = useState(0);
  const handleTab = (_event: any, tabIndex: any) => {
    setActiveTabKey(tabIndex);
  };
  const propertyName = router.query.propertyName || 'NA';
  const meta = getHeaderMeta(propertyName);
  if (!webprop || !activities) {
    return (
      <Body {...meta}>
        <EmptyState variant={EmptyStateVariant.large}>
          <EmptyStateIcon icon={CubesIcon} />
          <Title headingLevel="h4" size="lg">
            No SPA Deployed yet
          </Title>
          <EmptyStateBody>
            Hey, seems like there are no SPAs deployed yet. Here are some things you can do to get started:
            <StyledList isPlain>
              <ListItem icon={<PlusIcon />}>Create a new environment
                <StyledText
                  onClick={() => { router.push(`${propertyName}/settings`); }}>
                  (Environment Configuration)
                </StyledText>
              </ListItem>
              <ListItem icon={<PficonTemplateIcon />}>Generate API Key
                <StyledText
                  onClick={() => { router.push(`${propertyName}/settings`); }}>
                  (Environment Configuration)
                </StyledText>
              </ListItem>
              <ListItem icon={<CogIcon />}>Install spaship cli in your local system</ListItem>
              <ListItem icon={<KeyIcon />}>Setup your environment</ListItem>
              <StyledCodeBlock>
                <CodeBlockCode>
                  {`spaship env --name=<new-env-name> --url=${window.location.origin}/applications/deploy/${propertyName}/<env-name> --apikey=<your-api-key>`}
                </CodeBlockCode>
              </StyledCodeBlock>
              <ListItem icon={<AutomationIcon />}>Initialize spaship.yaml </ListItem>
              <StyledCodeBlock>
                <CodeBlockCode>spaship init</CodeBlockCode>
              </StyledCodeBlock>
              <ListItem icon={<BundleIcon />}>Pack your build (npm pack)</ListItem>
              <StyledCodeBlock>
                <CodeBlockCode>npm pack</CodeBlockCode>
              </StyledCodeBlock>
              <ListItem icon={<CubeIcon />}>Deploy your spa </ListItem>
              <StyledCodeBlock>
                <CodeBlockCode>{`spaship deploy --env=<env> <your-archive-file-name>`}</CodeBlockCode>
              </StyledCodeBlock>
            </StyledList>
          </EmptyStateBody>
          <EmptyStateSecondaryActions>
            <a target="_blank" href={url}>
              <StyledImg src="/images/logo/spaship-logo-dark-vector.svg" /> Instruction Guide
            </a>
          </EmptyStateSecondaryActions>
        </EmptyState>
      </Body>
    );
  }
  else {
    return (
      <Body {...meta}>
        <Tabs activeKey={activeTabKey} onSelect={handleTab} aria-label="Tabs for SPA information">
          <Tab
            eventKey={0}
            title={
              <>
                <TabTitleIcon>
                  <PackageIcon />
                </TabTitleIcon>
                <TabTitleText>SPAs</TabTitleText>
              </>
            }
          >
            <SPAProperty webprop={webprop}></SPAProperty>
          </Tab>
          <Tab
            eventKey={1}
            title={
              <>
                <TabTitleIcon>
                  <RunningIcon />
                </TabTitleIcon>
                <TabTitleText>Activity Stream</TabTitleText>
              </>
            }
          >
            <ActivityStream webprop={activities}></ActivityStream>
          </Tab>
        </Tabs>
      </Body>
    );
  }
};

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

WebPropertyPage.authenticationEnabled = true;
export default WebPropertyPage;
