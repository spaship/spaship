import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router';
import { useEffect } from 'react';

import { env } from '@app/config/env';
import { useToggle } from '@app/hooks';
import { pageLinks } from '@app/links';
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

  useEffect(() => {
    if (status === 'authenticated') {
      Router.push(pageLinks.webPropertyListPage);
    }
  }, [status]);

  const onLogin = () => {
    setIsLoggingIn.on();
    signIn('keycloak', { callbackUrl: pageLinks.webPropertyListPage }).catch(() => {
      setIsLoggingIn.off();
    });
  };

  return (
    <Page header={<Nav />}>
      <PageSection>
        {status === 'loading' ? (
          <Bullseye>
            <Spinner size="lg" />
          </Bullseye>
        ) : (
          <>
            <Flex
              justifyContent={{ default: 'justifyContentCenter' }}
              alignItems={{ default: 'alignItemsCenter' }}
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
                        <Text style={{ fontWeight: 900, fontSize: 'larger' }}>6.07s</Text>
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
                        <Text style={{ fontWeight: 900, fontSize: 'larger' }}>200+</Text>
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
                        <Text style={{ fontWeight: 900, fontSize: 'larger' }}>400+</Text>
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
            <Flex
              justifyContent={{ default: 'justifyContentCenter' }}
              alignItems={{ default: 'alignItemsFlexStart' }}
            >
              <FlexItem style={{ width: '500px' }} className="pf-u-ml-lg">
                <Title headingLevel="h3" className="pf-u-mt-lg pf-u-mb-md">
                  Features
                </Title>
                {Boolean(env.PUBLIC_SPASHIP_INTRO_VIDEO_URL) && (
                  <iframe
                    src={env.PUBLIC_SPASHIP_INTRO_VIDEO_URL}
                    title="spaship-intro"
                    className="pf-u-w-100 pf-u-mb-md rounded-sm"
                    style={{
                      backgroundColor: '#025891',
                      border: 'hidden',
                      height: '250px'
                    }}
                    allowFullScreen
                  />
                )}
              </FlexItem>
              <FlexItem style={{ width: '400px' }} className="pf-u-ml-md">
                <Text style={{ fontWeight: 900, fontSize: 'larger', marginTop: '60px' }}>
                  Bootstrap
                </Text>
                <Text style={{ fontSize: 'small' }}>
                  Quickly bootstrap new SPA using SPAship&apos;s simple yet effective command line
                  interface
                </Text>{' '}
                <Text style={{ fontWeight: 900, fontSize: 'larger' }} className="pf-u-mt-md ">
                  Injection
                </Text>
                <Text style={{ fontSize: 'small' }}>
                  Easily inject common components into SPAship&apos;s inbuilt server side injection
                </Text>
                <Text className="pf-u-mt-md " style={{ fontWeight: 900, fontSize: 'larger' }}>
                  Routing & Namespace
                </Text>
                <Text style={{ fontSize: 'small' }}>
                  Simple and clean route management for your SPAs without the hassel of manual DNS
                  configuration
                </Text>
              </FlexItem>
            </Flex>
          </>
        )}
      </PageSection>
    </Page>
  );
};
