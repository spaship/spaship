import { signOut, useSession } from 'next-auth/react';
import Router from 'next/router';

import { deleteOrchestratorAuthorizationHeader } from '@app/config/orchestratorReq';
import { useToggle } from '@app/hooks';
import { pageLinks } from '@app/links';
import {
  Avatar,
  Button,
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
  ToolbarItem,
  Tooltip
} from '@patternfly/react-core';
import { WhatsNew } from '@app/views/LoginPage/components/ReleaseBanner/WhatsNew';
import { useState } from 'react';
import { BellIcon } from '@patternfly/react-icons';

export const Nav = () => {
  const { data: session } = useSession();
  const [isSigningOut, setIsSigningOut] = useToggle();

  const [broadCastFlag, setBroadCastFlag] = useState(false);

  const onSignOut = () => {
    setIsSigningOut.on();
    signOut({ redirect: false, callbackUrl: pageLinks.loginPage })
      .then((data) => {
        deleteOrchestratorAuthorizationHeader();
        Router.push(data.url);
      })
      .catch(() => {
        setIsSigningOut.off();
      });
  };

  return (
    <Masthead backgroundColor="dark" style={{ padding: 0 }}>
      <MastheadMain className="logo" style={{ width: '256px' }}>
        <MastheadBrand className="pf-u-ml-lg">
          <img
            src="/img/spaship-logo-light.svg"
            alt="SPASHIP"
            style={{ height: '32px', cursor: 'default' }}
          />
        </MastheadBrand>
      </MastheadMain>
      <MastheadContent>
        <Toolbar id="toolbar" isFullHeight isStatic>
          <ToolbarContent>
            <ToolbarGroup
              variant="icon-button-group"
              alignment={{ default: 'alignRight' }}
              spacer={{ default: 'spacerNone', md: 'spacerMd' }}
              spaceItems={{ default: 'spaceItemsSm' }}
            >
              <ToolbarItem>
                <Tooltip content="Release Notes">
                  <BellIcon
                    onClick={() => setBroadCastFlag(!broadCastFlag)}
                    style={{ marginRight: '20px', cursor: 'pointer' }}
                  />
                </Tooltip>

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
                  <Avatar
                    src="/img/avatar.svg"
                    alt="Avatar image"
                    size="md"
                    className="cursor-pointer"
                  />
                </Popover>
              </ToolbarItem>
            </ToolbarGroup>
          </ToolbarContent>
        </Toolbar>
        {broadCastFlag && (
          <WhatsNew
            broadCastFlag={broadCastFlag}
            confirm={() => {
              setBroadCastFlag(!broadCastFlag);
            }}
          />
        )}
      </MastheadContent>
    </Masthead>
  );
};
