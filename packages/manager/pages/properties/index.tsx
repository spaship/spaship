import { Gallery, Tab, Tabs, TabTitleIcon, TabTitleText, Title } from "@patternfly/react-core";
import { getSession } from "next-auth/react";
import Body from "../../components/layout/body";
import { AnyProps, Properties } from "../../components/models/props";
import AddProperty from "../../components/web-property/addProperty";
import WebProperty from "../../components/web-property/webProperty";
import { get, post } from "../../utils/api.utils";
import { getAllEventCountUrl, getPropertyList } from "../../utils/endpoint.utils";
import { ComponentWithAuth } from "../../utils/auth.utils";
import {
  CubeIcon,
  CubesIcon 
} from "@patternfly/react-icons";
import styled from "styled-components";
import { useState } from "react";

interface PropertiesListProps { }

const payload = {
  count: {
    all: true,
  },
};

const meta = {
  title: "Properties ",
  breadcrumbs: [
    { path: "/properties", title: "Home" },
    { path: "/properties", title: "Properties" },
  ],
};

const StyledGallery = styled(Gallery)`
  margin-top: 1.5rem;
`;

export const getServerSideProps = async (context: any) => {
  try {
    const token = ((await getSession(context as any)) as any).accessToken;
    const userEmail = ((await getSession(context as any)) as any).user.email;
    const urlCount = getAllEventCountUrl();
    const urlProperty = getPropertyList();
    const response = await Promise.all([
      await post<Properties>(urlCount, payload, token),
      await get<AnyProps>(urlProperty, token),
    ]);
    const [deploymentCountResponse, propertyListResponse]: AnyProps = response;
    const webProperties = filterWebProperties(propertyListResponse);
    const myWebProperties: AnyProps = [];
    const allWebproperties: AnyProps = [];
    webProperties.forEach((item: AnyProps) => {
      const eventProp = deploymentCountResponse.find((event: AnyProps) => event.propertyName === item.propertyName);
      item.count = eventProp?.count || 0;
      if (item.createdBy === userEmail) myWebProperties.push(item);
      else allWebproperties.push(item);
    });
    return {
      props: { webprop: { myWebProperties, allWebproperties } },
    };
  } catch (error) {
    return { props: {} };
  }
};

const PropertiesList: ComponentWithAuth<PropertiesListProps> = ({ webprop }: AnyProps) => {
  const [activeTabKey, setActiveTabKey] = useState(0);
  const handleTab = (_event: any, tabIndex: any) => {
    setActiveTabKey(tabIndex); 
  };
  return (
    <Body {...meta}>
        <Tabs isBox activeKey={activeTabKey} onSelect={handleTab} aria-label="Tabs for My Properties and Other Properties">
          <Tab
            eventKey={0}
            title={
              <>
                <TabTitleIcon>
                  <CubeIcon />
                </TabTitleIcon>
                <TabTitleText>My Properties</TabTitleText>
              </>
            }
          >
            <StyledGallery hasGutter>
              <AddProperty></AddProperty>
              <WebProperty webprop={webprop?.myWebProperties}></WebProperty>
            </StyledGallery>
          </Tab>
          <Tab
            eventKey={1}
            title={
              <>
                <TabTitleIcon>
                  <CubesIcon />
                </TabTitleIcon>
                <TabTitleText>Other Properties</TabTitleText>
              </>
            }
          >
            <StyledGallery hasGutter>
              <WebProperty webprop={webprop?.allWebproperties}></WebProperty>
            </StyledGallery>
          </Tab>
        </Tabs>
    </Body>
  );
};

function filterWebProperties(propertyListResponse: AnyProps) {
  return propertyListResponse.filter(
    (compareProp: AnyProps, index: AnyProps, filterItem: AnyProps) =>
      filterItem.findIndex((prop: AnyProps) => prop.propertyName === compareProp.propertyName) === index
  );
}

PropertiesList.authenticationEnabled = true;
export default PropertiesList;
