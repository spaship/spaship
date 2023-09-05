/* eslint-disable jsx-a11y/anchor-is-valid */
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';

import { pageLinks } from '@app/links';
import { useGetWebProperties } from '@app/services/webProperty';
import { TWebProperty } from '@app/services/webProperty/types';
import {
  Nav,
  NavExpandable,
  NavGroup,
  NavItem,
  NavList,
  PageSidebar,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { useSession } from 'next-auth/react';

type SNProps = {
  title: string;
  icon: ReactNode;
  isActive: boolean;
};

const SidebarNavItem = ({ title, icon, isActive }: SNProps) => (
  <NavItem isActive={isActive}>
    <Split hasGutter className="pf-u-p-sm">
      <SplitItem>{icon}</SplitItem>
      <SplitItem>{title}</SplitItem>
    </Split>
  </NavItem>
);

export const SideBar = () => {
  const { pathname } = useRouter();
  const [selectedProperty, setSelectedProperty] = useState('Select Web Property');
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: session } = useSession();
  const webProperties = useGetWebProperties();

  const filteredWebProperties = (webProperties?.data as [])
    ?.filter(({ createdBy }: TWebProperty) => createdBy === session?.user?.email)
    .map(({ title }: TWebProperty) => ({
      title: title || '' // Provide a default title if title is undefined
    }));

  const handlePropertyClick = (propertyTitle: string) => {
    setSelectedProperty(propertyTitle);
    setIsExpanded(false); // Collapse the expandable section after selection
  };

  return (
    <PageSidebar
      nav={
        <Nav onToggle={() => setIsExpanded(!isExpanded)}>
          <NavGroup title="Account" style={{ margin: '0px', fontSize: '12px' }}>
            <NavList style={{ padding: '8px!important' }}>
              <Link href="/home">
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="Home"
                    icon={
                      <img
                        src="/img/home-icon.svg"
                        alt="home-icon"
                        style={{ verticalAlign: 'bottom' }}
                      />
                    }
                    isActive={pathname === pageLinks.home}
                  />
                </a>
              </Link>
              <Link href="/dashboard" style={{ margin: '0px', fontSize: '12px' }}>
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="Dashboard"
                    icon={
                      <img
                        src="/img/dashboard-icon.svg"
                        alt="home-icon"
                        style={{ verticalAlign: 'bottom' }}
                      />
                    }
                    isActive={pathname === pageLinks.dashboardPage}
                  />
                </a>
              </Link>
            </NavList>
          </NavGroup>
          <NavGroup title="Webproperties" style={{ margin: '0px', fontSize: '12px' }}>
            <NavList>
              <NavExpandable
                title={
                  window.location.pathname?.includes(selectedProperty)
                    ? selectedProperty
                    : 'Select Web Property'
                }
                groupId="nav-expanded-web-property"
                isExpanded={isExpanded}
              >
                {filteredWebProperties?.map((property) => (
                  <NavItem key={property.title}>
                    <Link href={`/properties/${property.title}`} passHref>
                      <a
                        className="pf-c-nav__link pf-m-icon"
                        href="#"
                        onClick={() => handlePropertyClick(property.title)}
                      >
                        {property.title}
                      </a>
                    </Link>
                  </NavItem>
                ))}
              </NavExpandable>

              <Link href={pageLinks.webPropertyListPage}>
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="All Web Properties"
                    icon={
                      <img
                        src="/img/webproperty-list-icon.svg"
                        alt="webproperty-list-icon"
                        style={{ verticalAlign: 'bottom' }}
                      />
                    }
                    isActive={pathname === pageLinks.webPropertyListPage}
                  />
                </a>
              </Link>
            </NavList>
          </NavGroup>
          <NavGroup title="Documentation" style={{ margin: '0px', fontSize: '12px' }}>
            <NavList>
              <Link href="/documents">
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="User Guides"
                    icon={
                      <img
                        src="/img/user-guide-icon.svg"
                        alt="user-guide-icon"
                        style={{ verticalAlign: 'bottom' }}
                      />
                    }
                    isActive={pathname === pageLinks.documentsPage}
                  />
                </a>
              </Link>
              <Link href="/sla">
                <a className="text-decoration-none">
                  <SidebarNavItem
                    title="SLA"
                    icon={
                      <img
                        src="/img/user-guide-icon.svg"
                        alt="user-guide-icon"
                        style={{ verticalAlign: 'bottom' }}
                      />
                    }
                    isActive={pathname === pageLinks.slaPage}
                  />
                </a>
              </Link>
            </NavList>
          </NavGroup>
          <NavGroup title="Help" style={{ margin: '0px', fontSize: '12px' }}>
            <NavList>
              <Link href="https://docs.google.com/document/d/143ezNXxfujOiTe3VD0cc0ZBYL92F_fSpYCFJUzzDoiQ/edit">
                <a className="text-decoration-none" target="_blank" rel="noreferrer">
                  <SidebarNavItem
                    title="FAQ's"
                    icon={
                      <img
                        src="/img/faq-icon.svg"
                        alt="faq-icon"
                        style={{ verticalAlign: 'bottom' }}
                      />
                    }
                    isActive={
                      pathname ===
                      'https://docs.google.com/document/d/143ezNXxfujOiTe3VD0cc0ZBYL92F_fSpYCFJUzzDoiQ/edit'
                    }
                  />
                </a>
              </Link>
              <Link href="https://forms.gle/h2Zsq8CvSjYcDD8u7">
                <a className="text-decoration-none" target="_blank" rel="noreferrer">
                  <SidebarNavItem
                    title="Feedback"
                    icon={
                      <img
                        src="/img/feedback-icon.svg"
                        alt="feedback-icon"
                        style={{ verticalAlign: 'bottom' }}
                      />
                    }
                    isActive={pathname === '/feedback'}
                  />
                </a>
              </Link>
            </NavList>
          </NavGroup>
        </Nav>
      }
    />
  );
};
