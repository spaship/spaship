import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router';
import { useEffect, useState } from 'react';

import { env } from '@app/config/env';
import { useToggle } from '@app/hooks';
import { pageLinks } from '@app/links';
import { useGetTotalTimeSavedForLogin } from '@app/services/analytics';
import {
  Bullseye,
  Button,
  Flex,
  FlexItem,
  Page,
  PageSection,
  Spinner,
  Text,
  Title,
  TitleSizes
} from '@patternfly/react-core';
import { Nav } from './components/Nav';

export const LoginPage = (): JSX.Element => {
  const [isLoggingIn, setIsLoggingIn] = useToggle();
  const { status } = useSession();
  const [returnUri, setReturnUri] = useState('');
  // const returnUri = window.location.search;
  useEffect(() => {
    if (typeof window !== 'undefined') {
      setReturnUri(window.location.search);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      Router.push(pageLinks.webPropertyListPage);
    }
  }, [status]);
  const params = new URLSearchParams(returnUri);
  const redirectUrl = params.get('redirectUri');

  const onLogin = () => {
    setIsLoggingIn.on();
    signIn('keycloak', {
      callbackUrl: redirectUrl ? (redirectUrl as string) : pageLinks.webPropertyListPage
    }).catch(() => {
      setIsLoggingIn.off();
    });
  };

  const totalTimeSaved = useGetTotalTimeSavedForLogin();

  return (
    <Page header={<Nav />}>
      <PageSection>
        {status === 'loading' ? (
          <Bullseye>
            <Spinner size="lg" />
          </Bullseye>
        ) : (
          <Flex
            justifyContent={{ default: 'justifyContentCenter' }}
            alignItems={{ default: 'alignItemsCenter' }}
            style={{ marginTop: '8%' }}
          >
            <FlexItem>
              <Title headingLevel="h6" style={{ fontSize: '2.4rem', fontWeight: '100' }}>
                Develop fast
              </Title>
              <Title headingLevel="h1" size={TitleSizes['4xl']} style={{ fontSize: '2.4rem' }}>
                Deploy faster
              </Title>
              <Text className="pf-u-mt-lg pf-u-mb-lg pf-u-color-100" style={{ width: '400px' }}>
                SPAship is a open source platform for deploying, integrating, and managing
                single-page apps (SPAs).
              </Text>

              <Flex
                className="pf-u-mt-lg pf-u-mb-lg"
                alignItems={{ default: 'alignItemsFlexStart' }}
              >
                <FlexItem>
                  <Flex
                    alignItems={{ default: 'alignItemsFlexStart' }}
                    style={{ marginRight: '0px' }}
                  >
                    <FlexItem style={{ margin: '0px' }}>
                      <img src="/img/avg-time-deploy.svg" alt="logo" />
                    </FlexItem>
                    <FlexItem style={{ margin: '0px' }}>
                      <Text style={{ fontWeight: 900, fontSize: 'larger' }}>
                        {totalTimeSaved?.data?.averageTime ?? 0}s
                      </Text>
                      <Text style={{ fontSize: 'small' }}>Avg. time to deploy</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsFlexStart' }}>
                    <FlexItem style={{ margin: '0px' }}>
                      {' '}
                      <img src="/img/hours_saved.svg" alt="logo" />
                    </FlexItem>
                    <FlexItem style={{ margin: '0px' }}>
                      <Text style={{ fontWeight: 900, fontSize: 'larger' }}>
                        {totalTimeSaved?.data?.timeSavedInHours ?? 0} hrs+
                      </Text>
                      <Text style={{ fontSize: 'small' }}>Hours Saved</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>

                <FlexItem>
                  <Flex alignItems={{ default: 'alignItemsFlexStart' }}>
                    <FlexItem style={{ margin: '0px' }}>
                      {' '}
                      <img src="/img/number-of-deployments.svg" alt="logo" />
                    </FlexItem>
                    <FlexItem style={{ margin: '0px' }}>
                      <Text style={{ fontWeight: 900, fontSize: 'larger' }}>
                        {totalTimeSaved?.data?.deploymentCount ?? 0}
                      </Text>
                      <Text style={{ fontSize: 'small' }}>No of deployments</Text>
                    </FlexItem>
                  </Flex>
                </FlexItem>
              </Flex>
              <Button
                style={{ width: '40%', display: 'inline-block' }}
                className="pf-u-mr-md"
                isBlock
                isLoading={isLoggingIn}
                isDisabled={isLoggingIn}
                onClick={(event) => {
                  event.preventDefault(); // Prevent default button click behavior
                  onLogin(); // Call the login function
                }}
                variant="primary"
              >
                Red Hat SSO
              </Button>
              <Button
                className="pf-u-mr-md"
                component="a"
                variant="secondary"
                aria-label="Documentation"
                href={env.PUBLIC_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Button>
            </FlexItem>
            <FlexItem style={{ width: '400px' }}>
              <img src="/img/login.svg" alt="login logo" />
            </FlexItem>
          </Flex>
        )}
      </PageSection>
    </Page>
  );
};
