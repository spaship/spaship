import { useEffect } from 'react';
import { signIn, useSession } from 'next-auth/react';
import Router from 'next/router';

import {
  Bullseye,
  Button,
  Card,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  Page,
  PageSection,
  Spinner,
  Text,
  Title,
  TitleSizes
} from '@patternfly/react-core';

import { useToggle } from '@app/hooks';
import { pageLinks } from '@app/links';
import { env } from '@app/config/env';

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
          <Flex
            justifyContent={{ default: 'justifyContentSpaceEvenly' }}
            alignItems={{ default: 'alignItemsCenter' }}
            style={{ marginTop: '10rem' }}
          >
            <FlexItem style={{ width: '500px' }}>
              {Boolean(env.PUBLIC_SPASHIP_INTRO_VIDEO_URL) && (
                <iframe
                  src={env.PUBLIC_SPASHIP_INTRO_VIDEO_URL}
                  title="spaship-intro"
                  className="pf-u-w-100 pf-u-mb-md rounded-sm"
                  style={{
                    height: '200px',
                    backgroundColor: '#025891',
                    border: 'hidden'
                  }}
                  allowFullScreen
                />
              )}
              <Title headingLevel="h1" size={TitleSizes['4xl']} style={{ fontSize: '2.4rem' }}>
                develop fast ·{' '}
                <span style={{ color: 'var(--spaship-global--Color--solar-orange)' }}>
                  deploy faster
                </span>
              </Title>
              <Text className="pf-u-mt-sm pf-u-color-400">
                SPAship is a open source platform for deploying, integrating, and managing
                single-page apps (SPAs).
              </Text>
            </FlexItem>
            <FlexItem flex={{ default: 'flex_1' }} style={{ maxWidth: '320px' }}>
              <Card>
                <CardTitle>Sign in with</CardTitle>
                <CardBody>
                  <Button
                    isBlock
                    isLoading={isLoggingIn}
                    isDisabled={isLoggingIn}
                    onClick={onLogin}
                  >
                    Red Hat SSO
                  </Button>
                </CardBody>
              </Card>
            </FlexItem>
          </Flex>
        )}
      </PageSection>
    </Page>
  );
};
