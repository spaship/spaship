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
      router.push(pageLinks.loginPage);
    }
  });

  // set the access token header when available for orchestrator requests
  useEffect(() => {
    if (session?.accessToken) {
      setOrchestratorAuthorizationHeader(session?.accessToken);
    }
  }, [session?.accessToken]);

  // if the refresh token failed in backend. Signout and ask user to login
  useEffect(() => {
    if (session?.error) {
      signOut({ redirect: false, callbackUrl: pageLinks.loginPage }).then((data) => {
        router.push(data.url);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session?.error]);

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

  return children;
};
