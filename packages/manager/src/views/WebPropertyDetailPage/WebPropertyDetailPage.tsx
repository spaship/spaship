import { Badge, PageSection, Tab, TabTitleIcon, TabTitleText, Tabs } from '@patternfly/react-core';
import { useRouter } from 'next/router';

import { Banner } from '@app/components';
import { useTabs } from '@app/hooks';
import { pageLinks } from '@app/links';
import { useGetEphemeralListForProperty } from '@app/services/ephemeral';
import { CogIcon, CubeIcon, PackageIcon } from '@patternfly/react-icons';

import { Dashboard } from './components/Dashboard';
import { Ephemeral } from './components/Ephemeral';

import { Settings } from '../Settings/Settings';
import { Applications } from './components/Applications';

export const WebPropertyDetailPage = (): JSX.Element => {
  const { query } = useRouter();
  const initialTab = query.initialTab as string;

  const propertyIdentifier = (query?.propertyIdentifier as string) || '';

  const { openTab, handleTabChange } = useTabs(4, Number(initialTab || '0'));

  // api calls
  const ephemeralPreview = useGetEphemeralListForProperty(propertyIdentifier);

  return (
    <>
      <Banner
        title={propertyIdentifier.replace('-', ' ')}
        backRef={{
          pathname: pageLinks.webPropertyListPage
        }}
      />
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-lg">
        <Tabs
          activeKey={openTab}
          onSelect={(_, tab) => handleTabChange(tab as number)}
          style={{ backgroundColor: '#fff' }}
        >
          <Tab
            eventKey={0}
            title={
              <>
                <TabTitleIcon>
                  <PackageIcon />
                </TabTitleIcon>
                <TabTitleText>Applications</TabTitleText>{' '}
              </>
            }
            aria-label="SPA listing"
          >
            <Applications />
          </Tab>

          <Tab
            eventKey={1}
            title={
              <>
                <TabTitleIcon>
                  <CubeIcon />
                </TabTitleIcon>
                <TabTitleText>
                  Ephemeral Preview{' '}
                  <Badge isRead={!ephemeralPreview.data?.length}>
                    {ephemeralPreview.data?.length}
                  </Badge>
                </TabTitleText>
              </>
            }
            aria-label="Ephemeral Environment"
          >
            <Ephemeral
              isSuccess={ephemeralPreview.isSuccess}
              ephemeralEnvs={ephemeralPreview.data}
            />
          </Tab>
          <Tab
            eventKey={2}
            title={
              <>
                <TabTitleIcon>
                  <img
                    src="/img/dashboard-icon-dark.svg"
                    alt="home-icon"
                    style={{ verticalAlign: 'bottom' }}
                  />
                </TabTitleIcon>
                <TabTitleText>Dashboard</TabTitleText>
              </>
            }
            aria-label="Dashboard"
          >
            <Dashboard type="web-property" />
          </Tab>
          <Tab
            eventKey={3}
            title={
              <>
                <TabTitleIcon>
                  <CogIcon />
                </TabTitleIcon>
                <TabTitleText>Settings</TabTitleText>
              </>
            }
            aria-label="Settings"
          >
            <Settings />
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
