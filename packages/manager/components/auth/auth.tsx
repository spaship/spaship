import { FunctionComponent, useEffect } from "react";
import { useRouter } from "next/router";
import { signOut, useSession } from "next-auth/react";
import { Bullseye } from "@patternfly/react-core";
import EmptySpinner from "../general/empty-spinner";
import styled from "styled-components";

interface AuthProps { }

const Spinner = styled.div`
  height: 100vh;
  width: 100vw;
`;

const Auth: FunctionComponent<AuthProps> = ({ children }) => {
  const { data: session, status } = useSession();
  const loading = status === "loading";
  const hasUser = !!session?.user;
  const router = useRouter();
  useEffect(() => {
    if (!loading && !hasUser) {
      router.push("/login");
    }
    const checkSession = async () => {
      if (session?.error === "RefreshAccessTokenError") {
        await signOut({ callbackUrl: "/login" });
        router.push("/login");
      }
    }
    checkSession()
      .catch(console.error);
  }, [loading, hasUser, router, session]);
  if (loading || !hasUser) {
    return (
      <Spinner>
        <Bullseye>
          <EmptySpinner />
          <div>Authenticating user session...</div>
        </Bullseye>
      </Spinner>
    );
  }
  return <div>{children}</div>;
};

export default Auth;
