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
import { FileIcon, GithubIcon } from '@patternfly/react-icons';

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
              <Button
                component="a"
                aria-label="Documentation"
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
