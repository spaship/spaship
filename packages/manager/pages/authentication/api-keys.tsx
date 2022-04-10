import { FunctionComponent } from "react";
import Body from "../../components/layout/body";

interface APIKeysProps {}

const meta = {
  title: "API Keys ",
  breadcrumbs: [
    {path: "/", title:'Home'},
    {path: "/authentication", title:'Authentication'},
    {path: "/authentication/api-keys", title:'API Keys'}
  ]
}

const APIKeys: FunctionComponent<APIKeysProps> = () => {
  return (
    <Body {...meta}>
      <div>API Key Management Console</div>
    </Body>
  );
};

export default APIKeys;
