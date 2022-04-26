import {
  Card,
  CardBody,
  CardTitle,
  List,
  ListItem
} from "@patternfly/react-core";
import { getSession } from "next-auth/react";
import { useRouter } from "next/router";
import React, { FunctionComponent } from "react";
import styled from "styled-components";
import Body from "../../../../components/layout/body";
import { AnyProps, ContextProps, Properties } from "../../../../components/models/props";
import ApiKey from "../../../../components/settings/apiKey";
import CreateEnv from "../../../../components/settings/createEnv";
import DeleteSpa from "../../../../components/settings/deleteSpa";
import EnvList from "../../../../components/settings/envList";
import ManageSpa from "../../../../components/settings/manageSpa";
import { get, post } from "../../../../utils/api.utils";
import { ComponentWithAuth } from "../../../../utils/auth.utils";
import { getEventAnalyticsUrl, getPropertyList } from "../../../../utils/endpoint.utils";

export const getServerSideProps = async (context: ContextProps) => {
  try {
    const token = (await getSession(context as any) as any).accessToken;
    const propertyReq = getPropertyRequest(context);
    const urlEvent = getEventAnalyticsUrl();
    const urlProperty = getPropertyList();
    const payloadCount = {
      "count": {
        "propertyName": propertyReq
      }
    };
    const response = await Promise.all([await post<Properties>(urlEvent, payloadCount, token), await get<AnyProps>(urlProperty, token)]);
    const [spaCountResponse, propertyListResponse]: AnyProps = response;
    const finalPropertyList = propertyListResponse.filter((prop: any) => prop.propertyName === propertyReq);
    if (!spaCountResponse) {
      return { props: { webprop: { propertyListResponse: finalPropertyList } } };
    }
    return {
      props: { webprop: { spaCountResponse: spaCountResponse, propertyListResponse: finalPropertyList } },
    };
  } catch (error) {
    return { props: {} };
  }
};

const StyledList = styled(List)`
  --pf-c-list--li--MarginTop: 1.5rem;
`;

const StyledCard = styled(Card)`
  max-width: var(--spaship-table-container-max-width);
`;

const SettingsPage: ComponentWithAuth<Properties> = ({ webprop }: Properties) => {
  const router = useRouter();
  const propertyName = router.query.propertyName || '';
  const meta = getHeaderData(propertyName)

  return (
    <Body {...meta}>
      <ManageSpa webprop={webprop?.spaCountResponse} />
      <EnvList webprop={webprop?.propertyListResponse} />
      <StyledCard>
        <CardTitle>Settings - Here be dragons!</CardTitle>
        <CardBody>
          <StyledList isPlain>
            <ListItem> <CreateEnv webprop={webprop?.propertyListResponse} /> </ListItem>
            <ListItem> <ApiKey /> </ListItem>
            <ListItem><DeleteSpa /> </ListItem>
          </StyledList>
        </CardBody>
      </StyledCard>
    </Body>
  );
};

function getHeaderData(propertyName: string | string[]) {
  return {
    title: getPropertyTitle(),
    breadcrumbs: [
      { path: `/properties`, title: 'Home' },
      { path: `/properties`, title: 'Properties' },
      { path: `/properties/${propertyName}`, title: `${getPropertyTitle()}` },
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

SettingsPage.authenticationEnabled = true;
export default SettingsPage;
