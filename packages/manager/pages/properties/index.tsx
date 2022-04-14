import { Gallery } from "@patternfly/react-core";
import { FunctionComponent } from "react";
import Body from "../../components/layout/body";
import { AnyProps, Properties } from "../../components/models/props";
import AddProperty from "../../components/web-property/addProperty";
import WebProperty from "../../components/web-property/webProperty";
import { get, post } from "../../utils/api.utils";
import { getAllEventCountUrl, getWebPropertyListUrl } from "../../utils/endpoint.utils";
import { DividerComp } from "./[propertyName]";

interface PropertiesListProps { }

const payload = {
  "count": {
    "all": true
  }
};

const meta = {
  title: "Properties ",
  breadcrumbs: [
    { path: "/properties", title: 'Home' },
    { path: "/properties", title: 'Properties' }
  ]
}

export const getStaticProps = async () => {
  const urlList = getWebPropertyListUrl();
  const urlCount = getAllEventCountUrl();
  const response = await Promise.all([await get<Properties>(urlList), await post<Properties>(urlCount, payload)]);
  const [propertyListResponse, deploymentCountResponse]: AnyProps = response;
  getPropertyListResponse(propertyListResponse, deploymentCountResponse);
  return {
    props: { webprop: propertyListResponse },
  };
};

const PropertiesList: FunctionComponent<PropertiesListProps> = ({ webprop, activites }: AnyProps) => {
  return (
    <Body {...meta}>
      <Gallery hasGutter>
        <AddProperty></AddProperty>
        <WebProperty webprop={webprop}></WebProperty>
      </Gallery>
      <DividerComp />
    </Body>
  );
};

export default PropertiesList;


function getPropertyListResponse(propertyListResponse: AnyProps, deploymentCountResponse: AnyProps) {
  for (let index in propertyListResponse) {
    let data = deploymentCountResponse.find((property: AnyProps) => property.propertyName === propertyListResponse[index].webPropertyName);
    propertyListResponse[index].count = data?.count || 0;
  }
}