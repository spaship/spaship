/* eslint-disable no-underscore-dangle */
import {
  Button,
  Level,
  LevelItem,
  List,
  PageSection,
  Tab,
  Tabs,
  TabTitleIcon,
  TabTitleText
} from '@patternfly/react-core';
import { useRouter } from 'next/router';

import { Banner } from '@app/components';
import { ActivityStream } from '@app/components/ActivityStream';
import { useTabs } from '@app/hooks';
import { pageLinks } from '@app/links';
import { useGetTotalDeploymentsForApps } from '@app/services/analytics';
import { BuildIcon, BundleIcon, CogIcon, PackageIcon, RunningIcon } from '@patternfly/react-icons';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { Dashboard } from '../WebPropertyDetailPage/components/Dashboard';
import { SSRDetails } from '../WebPropertyDetailPage/components/SSR/SSRDetails';
import { StaticDeployment } from '../WebPropertyDetailPage/components/SSR/StaticDeployment';

export const SPAPropertyDetailPage = (): JSX.Element => {
  const router = useRouter();
  const propertyIdentifier = router.query.propertyIdentifier as string;
  const spaProperty = router.query.spaProperty as string;

  const deploymentCount = useGetTotalDeploymentsForApps(propertyIdentifier, spaProperty);
  if (deploymentCount.isError === true) {
    toast.error(`Sorry cannot find ${spaProperty}`);
    router.push(`/properties/${propertyIdentifier}`);
  }

  const { handleTabChange, openTab } = useTabs(4);

  return (
    <>
      <Banner
        title={propertyIdentifier.replace('-', ' ')}
        backRef={{
          pathname: pageLinks.webPropertyDetailPage,
          query: {
            propertyIdentifier
          }
        }}
      >
        <Level>
          <LevelItem />
          <LevelItem>
            <Link
              href={{
                pathname: pageLinks.webPropertySettingPage,
                query: { propertyIdentifier }
              }}
            >
              <Button variant="link" icon={<CogIcon />}>
                Settings
              </Button>
            </Link>
          </LevelItem>
        </Level>
      </Banner>
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-xl">
        <Tabs activeKey={openTab} onSelect={(_, tab) => handleTabChange(tab as number)}>
          <Tab
            eventKey={0}
            title={
              <>
                <TabTitleIcon>
                  <BuildIcon />
                </TabTitleIcon>
                <TabTitleText>Containerized Deployment</TabTitleText>{' '}
              </>
            }
            aria-label="SSR SPA Deployment"
          >
            <List className="pf-u-mt-lg">
              <SSRDetails />
            </List>
          </Tab>
          <Tab
            eventKey={1}
            title={
              <>
                <TabTitleIcon>
                  <BundleIcon />
                </TabTitleIcon>
                <TabTitleText>Static Deployment</TabTitleText>{' '}
              </>
            }
            aria-label="SSR SPA Deployment"
          >
            <List className="pf-u-mt-lg">
              <StaticDeployment />
            </List>
          </Tab>
          <Tab
            eventKey={2}
            title={
              <>
                <TabTitleIcon>
                  <PackageIcon />
                </TabTitleIcon>
                <TabTitleText>Dashboard</TabTitleText>
              </>
            }
            aria-label="SPA listing"
          >
            <Dashboard type="spa" />
          </Tab>
          <Tab
            eventKey={3}
            title={
              <>
                <TabTitleIcon>
                  <RunningIcon />
                </TabTitleIcon>
                <TabTitleText>Activity Stream</TabTitleText>{' '}
              </>
            }
            aria-label="SPA activity"
          >
            <List className="pf-u-mt-lg">
              <ActivityStream
                propertyIdentifier={propertyIdentifier}
                applicationIdentifier={spaProperty}
                isGlobal={false}
              />
            </List>
          </Tab>
        </Tabs>
      </PageSection>
    </>
  );
};
