import { FunctionComponent } from "react";
import Link from "next/link";

interface AuthConsoleProps {}

const AuthConsole: FunctionComponent<AuthConsoleProps> = () => {
  return (
    <div className="authConsole">
      <Link href="/authentication/api-keys">API Key Management</Link>
    </div>
  );
};

export default AuthConsole;
