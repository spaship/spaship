import { Gallery, Title } from "@patternfly/react-core";
import { getSession } from "next-auth/react";
import { FunctionComponent } from "react";
import Body from "../../components/layout/body";
import { AnyProps, Properties } from "../../components/models/props";
import AddProperty from "../../components/web-property/addProperty";
import WebProperty from "../../components/web-property/webProperty";
import { get, post } from "../../utils/api.utils";
import { getAllEventCountUrl, getPropertyList } from "../../utils/endpoint.utils";
import { StyledDivider } from "./[propertyName]";

interface PropertiesListProps {}

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

const PropertiesList: FunctionComponent<PropertiesListProps> = ({ webprop }: AnyProps) => {
  return (
    <Body {...meta}>
      <Title headingLevel="h2" size="3xl">
        My Properties
      </Title><br />
      <Gallery hasGutter>
        <AddProperty></AddProperty>
        <WebProperty webprop={webprop?.myWebProperties}></WebProperty>
      </Gallery>
      <br />
      <StyledDivider />
      <Title headingLevel="h2" size="3xl">
        Other Properties
      </Title><br />
      <Gallery hasGutter>
        <WebProperty webprop={webprop?.allWebproperties}></WebProperty>
      </Gallery>
      <br />
      <StyledDivider />
    </Body>
  );
};

export default PropertiesList;

function filterWebProperties(propertyListResponse: AnyProps) {
  return propertyListResponse.filter(
    (compareProp: AnyProps, index: AnyProps, filterItem: AnyProps) =>
      filterItem.findIndex((prop: AnyProps) => prop.propertyName === compareProp.propertyName) === index
  );
}
