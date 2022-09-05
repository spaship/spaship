import { signOut, useSession } from 'next-auth/react';

import {
  Avatar,
  Button,
  ButtonVariant,
  Flex,
  FlexItem,
  Masthead,
  MastheadBrand,
  MastheadContent,
  MastheadMain,
  Popover,
  Text,
  Title,
  TitleSizes,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { BellIcon } from '@patternfly/react-icons';
import { env } from '@app/config/env';
import { useToggle } from '@app/hooks';

export const Nav = () => {
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useToggle();

  const onSignOut = () => {
    setIsSigningOut.on();
    signOut({ callbackUrl: '/login' }).finally(() => {
      setIsSigningOut.off();
    });
  };

  return (
    <Masthead backgroundColor="light" style={{ padding: 0, backgroundColor: '#333333' }}>
      <MastheadMain className="logo" style={{ backgroundColor: '#000', width: '256px' }}>
        <MastheadBrand className="pf-u-ml-lg">
          <img src="/img/spaship-logo-light.svg" alt="SPASHIP" style={{ height: '32px' }} />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isFullHeight isStatic style={{ backgroundColor: '#333333' }}>
          <ToolbarContent>
            <ToolbarGroup
              variant="icon-button-group"
              alignment={{ default: 'alignRight' }}
              spacer={{ default: 'spacerNone', md: 'spacerMd' }}
              spaceItems={{ default: 'spaceItemsSm' }}
            >
              <ToolbarItem>
                <Button
                  component="a"
                  aria-label="DOC URL"
                  variant={ButtonVariant.link}
                  style={{ color: '#fff' }}
                  href={env.PUBLIC_DOC_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Go to Docs
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Button aria-label="Notifications" variant={ButtonVariant.plain}>
                  <BellIcon size="md" />
                </Button>
              </ToolbarItem>
              <ToolbarItem>
                <Popover
                  flipBehavior={['bottom-end']}
                  hasAutoWidth
                  showClose={false}
                  bodyContent={
                    <Flex
                      style={{ width: '200px' }}
                      direction={{ default: 'column' }}
                      alignItems={{ default: 'alignItemsCenter' }}
                      spaceItems={{ default: 'spaceItemsSm' }}
                    >
                      <FlexItem>
                        <Avatar src="/img/avatar.svg" alt="Avatar image" size="lg" />
                      </FlexItem>
                      <FlexItem>
                        <Title headingLevel="h6" size={TitleSizes.lg}>
                          {session?.user?.name}
                        </Title>
                      </FlexItem>
                      <FlexItem>
                        <Text component="small">{session?.user?.email}</Text>
                      </FlexItem>
                      <FlexItem className="pf-u-w-100">
                        <Button
                          isBlock
                          isLoading={isSigningOut}
                          isDisabled={isSigningOut}
                          onClick={onSignOut}
                        >
                          Logout
                        </Button>
                      </FlexItem>
                    </Flex>
                  }
                >
                  <Avatar src="/img/avatar.svg" alt="Avatar image" size="md" />
                </Popover>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
      </MastheadContent>
    </Masthead>
  );
};
