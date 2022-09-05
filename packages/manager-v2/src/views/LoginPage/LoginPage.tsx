import { signIn } from 'next-auth/react';

import {
  Button,
  ButtonVariant,
  Card,
  CardBody,
  CardTitle,
  Flex,
  FlexItem,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  Page,
  PageSection,
  Text,
  Title,
  TitleSizes,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { FileIcon, GithubIcon } from '@patternfly/react-icons';

import { env } from '@app/config/env';
import { useToggle } from '@app/hooks';

const PageNav = () => (
  <Masthead backgroundColor="light">
    <MastheadMain>
      <MastheadBrand>
        <img src="/img/spaship-logo.svg" alt="SPASHIP" style={{ height: '32px' }} />
      </MastheadBrand>
    </MastheadMain>
    <MastheadContent>
      <Toolbar id="toolbar" isFullHeight isStatic>
        <ToolbarContent>
          <ToolbarGroup
            variant="icon-button-group"
            alignment={{ default: 'alignRight' }}
            spacer={{ default: 'spacerNone', md: 'spacerMd' }}
          >
            <ToolbarItem>
              <Button
                component="a"
                aria-label="DOC URL"
                variant={ButtonVariant.link}
                icon={<FileIcon />}
                href={env.PUBLIC_DOC_URL}
                target="_blank"
                rel="noopener noreferrer"
              >
                Documentation
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                aria-label="GitHub URL"
                variant={ButtonVariant.link}
                icon={<GithubIcon />}
                href={env.PUBLIC_GITHUB_URL}
                target="_blank"
                rel="noopener noreferrer"
                component="a"
              >
                GitHub
              </Button>
            </ToolbarItem>
          </ToolbarGroup>
        </ToolbarContent>
      </Toolbar>
    </MastheadContent>
  </Masthead>
);

export const LoginPage = (): JSX.Element => {
  const [isLoggingIn, setIsLoggingIn] = useToggle();

  const onLogin = () => {
    setIsLoggingIn.on();
    signIn('keycloak', { callbackUrl: '/' }).catch(() => {
      setIsLoggingIn.off();
    });
  };

  return (
    <Page header={<PageNav />}>
      <PageSection>
        <Flex
          justifyContent={{ default: 'justifyContentSpaceEvenly' }}
          alignItems={{ default: 'alignItemsCenter' }}
          style={{ marginTop: '10rem' }}
        >
          <FlexItem style={{ width: '500px' }}>
            <Title headingLevel="h1" size={TitleSizes['4xl']} style={{ fontSize: '2.4rem' }}>
              develop fast ·{' '}
              <span style={{ color: 'var(--spaship-global--Color--solar-orange)' }}>
                deploy faster
              </span>
            </Title>
            <Text className="pf-u-mt-sm pf-u-color-400">
              SPAship is a open source platform for deploying, integrating, and managing single-page
              apps (SPAs).
            </Text>
          </FlexItem>
          <FlexItem flex={{ default: 'flex_1' }} style={{ maxWidth: '320px' }}>
            <Card>
              <CardTitle>Sign in with</CardTitle>
              <CardBody>
                <Button isBlock isLoading={isLoggingIn} isDisabled={isLoggingIn} onClick={onLogin}>
                  Red Hat SSO
                </Button>
              </CardBody>
            </Card>
          </FlexItem>
        </Flex>
      </PageSection>
    </Page>
  );
};
