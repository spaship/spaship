/* eslint-disable no-useless-escape */
/* eslint-disable jsx-a11y/anchor-is-valid */
import Chatbot from '@app/components/ChatUrDocs/Chat/Chatbot';
import { env } from '@app/config/env';
import { usePopUp } from '@app/hooks';
import { pageLinks } from '@app/links';
import { useGetWebProperties } from '@app/services/webProperty';
import { TWebProperty } from '@app/services/webProperty/types';
import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownToggle,
  Modal,
  ModalVariant,
  Nav,
  NavGroup,
  NavItem,
  NavList,
  PageSidebar,
  Split,
  SplitItem
} from '@patternfly/react-core';
import { InfoCircleIcon } from '@patternfly/react-icons';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { ReactNode, useState } from 'react';

type SNProps = {
  title: string;
  icon: ReactNode;
  isActive: boolean;
};

function genereateIdentifier(identifier: string) {
  return (
    encodeURIComponent(identifier)
      .toLowerCase()
      /* Replace the encoded hexadecimal code with `-` */
      .replace(/%[0-9a-zA-Z]{2}/g, '-')
      /* Replace any special characters with `-` */
      .replace(/[\ \-\/\:\@\[\]\`\{\~\.]+/g, '-')
      /* Special characters are replaced by an underscore */
      .replace(/[\|!@#$%^&*;"<>\(\)\+,]/g, '_')
      /* Remove any starting or ending `-` */
      .replace(/^-+|-+$/g, '')
      /* Removing multiple consecutive `-`s */
      .replace(/--+/g, '-')
  );
}
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
  const [selectedProperty, setSelectedProperty] = useState('My Property');
  const [isExpanded, setIsExpanded] = useState(false);
  const { data: session } = useSession();
  const webProperties = useGetWebProperties();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const filteredWebProperties = (webProperties?.data as [])
    ?.filter(({ createdBy }: TWebProperty) => createdBy === session?.user?.email)
    .map(({ title }: TWebProperty) => ({
      title: title || '' // Provide a default title if title is undefined
    }));

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleDropdownSelect = (property: string) => (event: any) => {
    setSelectedProperty(property);
    setIsDropdownOpen(false);
  };

  const handleDropdownToggle = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };
  const faqDocumentUrl = env.PUBLIC_SPASHIP_FAQ_URL;
  const { handlePopUpClose, handlePopUpOpen, popUp } = usePopUp(['chatbotPanel'] as const);

  const handleFeedbackClick = () => {
    const feedbackElement: any = document.querySelector('opc-feedback');
    if (feedbackElement) {
      feedbackElement.setModalState(false, true, false, false);
      handlePopUpClose('chatbotPanel');
    } else {
      console.error('Feedback element not found.');
    }
  };
  return (
    <PageSidebar
      nav={
        <>
          <Nav onToggle={() => setIsExpanded(!isExpanded)}>
            <NavGroup title="Account" style={{ margin: '0px', fontSize: '12px !important' }}>
              <NavList className="pf-u-px-md">
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
                <Link href="/dashboard">
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

            <NavGroup title="Web Properties">
              <NavList className="pf-u-px-md">
                <NavItem>
                  <Split hasGutter className="pf-u-px-sm">
                    <SplitItem>
                      <Dropdown
                        id="sidebar_dropdown"
                        style={{
                          color: 'white',
                          border: 'none !important',
                          width: '200px!important'
                        }}
                        isOpen={isDropdownOpen}
                        onSelect={() => {}}
                        toggle={
                          <DropdownToggle
                            style={{ color: 'white' }}
                            onToggle={handleDropdownToggle}
                          >
                            <span>Select My Property</span>
                          </DropdownToggle>
                        }
                      >
                        {filteredWebProperties?.length === 0 ? (
                          <DropdownItem disabled>No properties found</DropdownItem>
                        ) : (
                          filteredWebProperties?.map((property) => (
                            <Link
                              key={property.title}
                              href={`/properties/${genereateIdentifier(property.title)}`}
                              passHref
                            >
                              <DropdownItem
                                className="hover-highlight"
                                key={property.title}
                                onClick={handleDropdownSelect(property.title)}
                                style={{
                                  backgroundColor:
                                    property.title === selectedProperty ? '#D2d2d2' : 'white'
                                }}
                              >
                                {property.title}
                              </DropdownItem>
                            </Link>
                          ))
                        )}
                      </Dropdown>
                    </SplitItem>
                  </Split>
                </NavItem>

                <Link href={pageLinks.webPropertyListPage}>
                  <a
                    className="text-decoration-none"
                    onClick={() => setSelectedProperty('My Property')}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === 'Space') {
                        setSelectedProperty('My Property');
                      }
                    }}
                    role="button"
                    tabIndex={0}
                  >
                    <SidebarNavItem
                      title="All Properties"
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
            <NavGroup title="Documentation">
              <NavList className="pf-u-px-md">
                <Link href="/documents">
                  <a className="text-decoration-none">
                    <SidebarNavItem
                      title="Documents"
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
                <NavItem className="text-decoration-none">
                  <Split hasGutter className="pf-u-p-sm">
                    <SplitItem>
                      {' '}
                      <img
                        src="/img/chatbot_4.png"
                        alt="user-guide-icon"
                        style={{ verticalAlign: 'bottom', height: '30px' }}
                      />
                    </SplitItem>
                    <SplitItem>
                      <Button
                        className="text-decoration-none"
                        variant="link"
                        style={{ padding: 0, color: '#fff' }}
                        onClick={() => handlePopUpOpen('chatbotPanel')}
                      >
                        Ask me
                      </Button>
                    </SplitItem>
                  </Split>
                </NavItem>
              </NavList>
            </NavGroup>
            <NavGroup title="Help">
              <NavList className="pf-u-px-md">
                <Link href={faqDocumentUrl}>
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
                      isActive={pathname === faqDocumentUrl}
                    />
                  </a>
                </Link>
                <Link href="mailto:spaship-dev@redhat.com">
                  <a className="text-decoration-none" target="_blank" rel="noreferrer">
                    <SidebarNavItem
                      title="Contact Us"
                      icon={
                        <svg
                          width="24"
                          height="24"
                          viewBox="0 0 24 24"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                          style={{ verticalAlign: 'bottom' }}
                        >
                          <path
                            d="M4.40677 19.3182C3.93422 19.3182 3.53198 19.1523 3.20005 18.8204C2.86812 18.4884 2.70215 18.0861 2.70215 17.6134V6.38658C2.70215 5.9139 2.86812 5.51159 3.20005 5.17965C3.53198 4.84774 3.93422 4.68178 4.40677 4.68178H19.5936C20.0662 4.68178 20.4684 4.84774 20.8003 5.17965C21.1323 5.51159 21.2982 5.9139 21.2982 6.38658V17.6134C21.2982 18.0861 21.1323 18.4884 20.8003 18.8204C20.4684 19.1523 20.0662 19.3182 19.5936 19.3182H4.40677ZM12.0002 12.4846L4.10115 7.42208V17.6115C4.10115 17.7013 4.13 17.775 4.1877 17.8327C4.2454 17.8904 4.31912 17.9192 4.40887 17.9192H19.5915C19.6813 17.9192 19.755 17.8904 19.8127 17.8327C19.8704 17.775 19.8992 17.7013 19.8992 17.6115V7.42208L12.0002 12.4846ZM12.0002 11.0202L19.7252 6.08078H4.2752L12.0002 11.0202ZM4.10115 7.42208V6.08078V17.6115C4.10115 17.7013 4.13 17.775 4.1877 17.8327C4.2454 17.8904 4.31912 17.9192 4.40887 17.9192H4.10115V7.42208Z"
                            fill="white"
                          />
                        </svg>
                      }
                      isActive={pathname === env.PUBLIC_SPASHIP_REPORT_BUG}
                    />
                  </a>
                </Link>

                <Link href={env.PUBLIC_SPASHIP_REPORT_BUG}>
                  <a className="text-decoration-none" target="_blank" rel="noreferrer">
                    <SidebarNavItem
                      title="Report a bug"
                      icon={
                        <img
                          src="/img/report-bug.svg"
                          alt="report-bug"
                          style={{ verticalAlign: 'bottom' }}
                        />
                      }
                      isActive={pathname === env.PUBLIC_SPASHIP_REPORT_BUG}
                    />
                  </a>
                </Link>
                <Link href={env.PUBLIC_GITHUB_URL}>
                  <a className="text-decoration-none" target="_blank" rel="noreferrer">
                    <SidebarNavItem
                      title="Github"
                      icon={
                        <img
                          src="/img/github.svg"
                          alt="github"
                          style={{ verticalAlign: 'bottom' }}
                        />
                      }
                      isActive={pathname === env.PUBLIC_GITHUB_URL}
                    />
                  </a>
                </Link>
              </NavList>
            </NavGroup>
          </Nav>

          <Modal
            variant={ModalVariant.small}
            isOpen={popUp.chatbotPanel.isOpen}
            onClose={() => handlePopUpClose('chatbotPanel')}
            height={600}
          >
            <p>
              <InfoCircleIcon /> &nbsp; Disclaimer: Please note that this is a pilot version in the
              early stages of development and is considered pre-alpha. We are providing this for the
              purpose of gathering{' '}
              <span
                // onClick={() => {
                //   const feedbackElement: any = document.querySelector('opc-feedback');
                //   if (feedbackElement) {
                //     feedbackElement._setModalState(false, true, false, false);
                //     handlePopUpClose('chatbotPanel');
                //   } else {
                //     console.error('Feedback element not found.');
                //   }
                // }}
                // style={{ cursor: 'pointer', color: 'blue' }}
                // role="button" // Added role attribute
                // tabIndex={0} // Added tabIndex for accessibility

                onClick={handleFeedbackClick}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    handleFeedbackClick();
                  }
                }}
                tabIndex={0} // Added tabIndex for accessibility
                role="button" // Added role attribute
                style={{ cursor: 'pointer', color: 'blue' }}
              >
                feedback
              </span>
              .
            </p>
            <br />
            <Chatbot botName="DocBot" />
          </Modal>
        </>
      }
    />
  );
};
