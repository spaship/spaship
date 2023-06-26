import {
  Button,
  ButtonVariant,
  Masthead,
  MastheadContent,
  MastheadMain,
  Toolbar,
  ToolbarContent,
  ToolbarGroup,
  ToolbarItem
} from '@patternfly/react-core';
import { GithubIcon } from '@patternfly/react-icons';

import { env } from '@app/config/env';

export const Nav = () => (
  <Masthead backgroundColor="light">
    <MastheadMain>
      <a href="/" className="pf-c-masthead__brand">
        <img src="/img/spaship-logo.svg" alt="SPASHIP logo" style={{ height: '32px' }} />
      </a>
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
              <img src="/img/login-mail.svg" alt="email logo" />
              <Button
                className="pf-u-pl-sm"
                component="a"
                aria-label="spaship-dev@redhat.com"
                variant={ButtonVariant.link}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
                  window.location.href = 'mailto:spaship-dev@redhat.com';
                }}
              >
                spaship-dev@redhat.com
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <img src="/img/slack-logo.svg" alt="slack logo" />
              <Button
                className="pf-u-pl-sm"
                component="a"
                aria-label="Documentation"
                variant={ButtonVariant.link}
                rel="noopener noreferrer"
              >
                Spaship Forum
              </Button>
            </ToolbarItem>
            <ToolbarItem>
              <Button
                aria-label="View the source code on GitHub"
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
