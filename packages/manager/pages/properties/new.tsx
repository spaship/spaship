import { FunctionComponent } from "react";
import Body from "../../components/layout/body";
import NewProperty from "../../components/web-property/newProperty";
import { get, post } from "../../utils/api.utils";
import { getSession } from "next-auth/react";
import { getPropertyList } from "../../utils/endpoint.utils";
import { AnyProps } from "../../components/models/props";
interface PropertiesListProps { }

const meta = {
  title: "Add New Property ",
  breadcrumbs: [
    { path: "/properties", title: 'Home' },
    { path: "/properties", title: 'Properties' },
    { path: "new", title: 'Add New Property' }
  ]
}

export const getServerSideProps = async (context: any) => {
  try {
    const token = (await getSession(context as any) as any).accessToken;
    const urlProperty = getPropertyList();
    const response = await get<AnyProps>(urlProperty, token);
    const properties = filterWebProperties(response)
    return {
      props: { webProp: { properties } },
    };
  } catch (error) {
    return { props: {} };
  }
};

const PropertiesList: FunctionComponent<PropertiesListProps> = ({ webProp }: AnyProps) => {
  return (
    <Body {...meta}>
      <NewProperty webProp={webProp.properties}></NewProperty>
    </Body>
  );
};

export default PropertiesList;

function filterWebProperties(propertyListResponse: any) {
  return propertyListResponse.filter((compareProp: any, index: any, filterItem: any) => filterItem.findIndex((prop: any) => (prop.propertyName === compareProp.propertyName)) === index);
}