import { Gallery } from "@patternfly/react-core";
import { FunctionComponent } from "react";
import Body from "../../components/layout/body";
import { AnyProps, Properties } from "../../components/models/props";
import AddProperty from "../../components/web-property/addProperty";
import WebProperty from "../../components/web-property/webProperty";
import { post } from "../../utils/api.utils";
import { getAllEventCountUrl } from "../../utils/endpoint.utils";
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

export const getServerSideProps = async () => {
  try {
    const urlCount = getAllEventCountUrl();
    const response = await Promise.all([await post<Properties>(urlCount, payload)]);
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
      <DividerComp />
    </Body>
  );
};

export default PropertiesList;