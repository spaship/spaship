import { Gallery } from "@patternfly/react-core";
import { getSession } from "next-auth/react";
import { FunctionComponent } from "react";
import Body from "../../components/layout/body";
import { AnyProps, ContextProps, Properties } from "../../components/models/props";
import AddProperty from "../../components/web-property/addProperty";
import WebProperty from "../../components/web-property/webProperty";
import { post } from "../../utils/api.utils";
import { getAllEventCountUrl } from "../../utils/endpoint.utils";
import { StyledDivider } from "./[propertyName]";

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

export const getServerSideProps = async (context: any) => {
  try {
    const token = (await getSession(context as any) as any).accessToken;
    const urlCount = getAllEventCountUrl();
    const response = await Promise.all([await post<Properties>(urlCount, payload, token)]);
    const [deploymentCountResponse]: AnyProps = response;
    return {
      props: { webprop: deploymentCountResponse },
    };
  } catch (error) {
    return { props: {} };
  }
};

const PropertiesList: FunctionComponent<PropertiesListProps> = ({ webprop }: AnyProps) => {
  return (
    <Body {...meta}>
      <Gallery hasGutter>
        <AddProperty></AddProperty>
        <WebProperty webprop={webprop}></WebProperty>
      </Gallery>
      <br />
      <StyledDivider />
    </Body>
  );
};

export default PropertiesList;