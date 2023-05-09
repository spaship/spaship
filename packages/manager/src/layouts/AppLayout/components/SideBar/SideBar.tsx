/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode } from 'react';

import { pageLinks } from '@app/links';
import { Nav, NavItem, NavList, PageSidebar, Split, SplitItem } from '@patternfly/react-core';
import {
  ChartLineIcon,
  CommentAltIcon,
  FolderIcon,
  OutlinedClockIcon,
  ThIcon
} from '@patternfly/react-icons';
import { Notification } from './Notification';

type SNProps = {
  title: string;
  icon: ReactNode;
  isActive: boolean;
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
        <>
          <Nav aria-label="Nav">
            <NavList>
              <Link href={pageLinks.webPropertyListPage}>
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="Web Properties"
                    icon={<ThIcon size="sm" />}
                    isActive={pathname === pageLinks.webPropertyListPage}
                  />
                </a>
              </Link>
              <Link href="/dashboard">
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="Dashboard"
                    icon={<ChartLineIcon size="sm" />}
                    isActive={pathname === pageLinks.dashboardPage}
                  />
                </a>
              </Link>
              <Link href="/documents">
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="Documents"
                    icon={<FolderIcon size="sm" />}
                    isActive={pathname === pageLinks.documentsPage}
                  />
                </a>
              </Link>
              <Link href="/coming-soon">
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="Feedback"
                    icon={<CommentAltIcon size="sm" />}
                    isActive={pathname === '/feedback'}
                  />
                </a>
              </Link>
              <Link href="/sla">
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="SLA"
                    icon={<OutlinedClockIcon size="sm" />}
                    isActive={pathname === pageLinks.slaPage}
                  />
                </a>
              </Link>
            </NavList>
          </Nav>
          <Notification />
        </>
      }
    />
  );
};
