import { FunctionComponent } from "react";
import Link from "next/link";
import Body from "../../components/layout/body";

interface AuthConsoleProps {}

const meta = {
  title: "Authentication ",
  breadcrumbs: [
    {path: "/", title:'Home'},
    {path: "/authentication", title:'Authentication'}
  ]
}

const AuthConsole: FunctionComponent<AuthConsoleProps> = () => {
  return (
    <Body {...meta}>
      <Link href="/authentication/api-keys">API Key Management</Link>
    </Body>
  );
};

export default AuthConsole;
