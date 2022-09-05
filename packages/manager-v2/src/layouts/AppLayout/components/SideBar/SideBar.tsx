import { ReactNode } from 'react';

import { Nav, NavItem, NavList, PageSidebar, Split, SplitItem } from '@patternfly/react-core';
import { ChartLineIcon, CommentAltIcon, KeyIcon, ThIcon } from '@patternfly/react-icons';

type SNProps = {
  title: string;
  icon: ReactNode;
};

const SidebarNavItem = ({ title, icon }: SNProps) => (
  <NavItem>
    <Split hasGutter className="pf-u-p-md">
      <SplitItem>{icon}</SplitItem>
      <SplitItem>{title}</SplitItem>
    </Split>
  </NavItem>
);

export const SideBar = () => (
  <PageSidebar
    nav={
      <Nav aria-label="Nav">
        <NavList>
          <SidebarNavItem title="Web Properties" icon={<ThIcon size="sm" />} />
          <SidebarNavItem title="Dashboard" icon={<ChartLineIcon size="sm" />} />
          <SidebarNavItem title="Authentication" icon={<KeyIcon size="sm" />} />
          <SidebarNavItem title="Feedback" icon={<CommentAltIcon size="sm" />} />
        </NavList>
      </Nav>
    }
  />
);
