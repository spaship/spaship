import { useEffect } from 'react';
import { signOut, useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import { setOrchestratorAuthorizationHeader } from '@app/config/orchestratorReq';
import { Bullseye, Page, PageSection, Spinner } from '@patternfly/react-core';
import { pageLinks } from '@app/links';

type Props = {
  children: JSX.Element;
};

export const AuthGuard = ({ children }: Props) => {
  const router = useRouter();
  const { data: session, status } = useSession({
    required: true,
    onUnauthenticated: () => {
      const currentUrl = router.asPath;
      console.log('currentpath', currentUrl);
      router.push({
        pathname: pageLinks.loginPage,
        query: { redirectUri: currentUrl }
      });
    }
  });

  // Set the access token header when available for orchestrator requests
  useEffect(() => {
    if (session?.accessToken) {
      setOrchestratorAuthorizationHeader(session?.accessToken);
    }
  }, [session?.accessToken]);

  // If the refresh token failed in the backend, sign out and ask the user to login
  useEffect(() => {
    if (session?.error) {
      signOut({ redirect: false, callbackUrl: pageLinks.loginPage }).then((data) => {
        router.push(data.url);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.error]);

  // Loading state or error state
  if (status === 'loading' || session?.error) {
    return (
      <Page>
        <PageSection>
          <Bullseye>
            <Spinner size="xl" />
          </Bullseye>
        </PageSection>
      </Page>
    );
  }

  // If the JWT is valid and the user is authenticated, render the children.
  return children;
};
