import { FunctionComponent } from "react";
import Body from "../../components/layout/body";

interface PropertiesListProps { }

const meta = {
  title: "Properties ",
  breadcrumbs: [
    {path: "/", title:'Home'},
    {path: "/properties", title:'Properties'}
  ]
}
 

const PropertiesList: FunctionComponent<PropertiesListProps> = () => {
  return (
    <Body {...meta}>SPAship Properties</Body>
  );
};

export default PropertiesList;
