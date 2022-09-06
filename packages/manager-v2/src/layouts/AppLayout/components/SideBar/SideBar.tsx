/* eslint-disable jsx-a11y/anchor-is-valid */
import { ReactNode } from 'react';
import { useRouter } from 'next/router';
import Link from 'next/link';

import { Nav, NavItem, NavList, PageSidebar, Split, SplitItem } from '@patternfly/react-core';
import { ChartLineIcon, CommentAltIcon, KeyIcon, ThIcon } from '@patternfly/react-icons';

type SNProps = {
  title: string;
  icon: ReactNode;
  isActive?: boolean;
};

const SidebarNavItem = ({ title, icon, isActive }: SNProps) => (
  <NavItem isActive={isActive}>
    <Split hasGutter className="pf-u-p-md">
      <SplitItem>{icon}</SplitItem>
      <SplitItem>{title}</SplitItem>
    </Split>
  </NavItem>
);

export const SideBar = () => {
  const { pathname } = useRouter();

  return (
    <PageSidebar
      nav={
        <Nav aria-label="Nav">
          <NavList>
            <Link href="/">
              <a>
                <SidebarNavItem
                  title="Web Properties"
                  icon={<ThIcon size="sm" />}
                  isActive={pathname === '/'}
                />
              </a>
            </Link>
            <Link href="/dashboard">
              <a>
                <SidebarNavItem
                  title="Dashboard"
                  icon={<ChartLineIcon size="sm" />}
                  isActive={pathname === '/dashboard'}
                />
              </a>
            </Link>
            <Link href="/auth">
              <a>
                <SidebarNavItem
                  title="Authentication"
                  icon={<KeyIcon size="sm" />}
                  isActive={pathname === '/auth'}
                />
              </a>
            </Link>
            <Link href="/feedback">
              <a>
                <SidebarNavItem
                  title="Feedback"
                  icon={<CommentAltIcon size="sm" />}
                  isActive={pathname === '/feedback'}
                />
              </a>
            </Link>
          </NavList>
        </Nav>
      }
    />
  );
};
