/* eslint-disable no-underscore-dangle */
import { List, PageSection, Tab, Tabs, TabTitleIcon, TabTitleText } from '@patternfly/react-core';
import { useRouter } from 'next/router';

import { Banner } from '@app/components';
import { useTabs } from '@app/hooks';
import { pageLinks } from '@app/links';
import { useGetTotalDeploymentsForApps } from '@app/services/analytics';
import { BuildIcon, BundleIcon, PackageIcon } from '@patternfly/react-icons';
import toast from 'react-hot-toast';
import { Dashboard } from '../WebPropertyDetailPage/components/Dashboard';
import { ContainerizedDeployment } from '../WebPropertyDetailPage/components/SSR/ContainerizedDeployment';
import { StaticDeployment } from '../WebPropertyDetailPage/components/SSR/StaticDeployment';

export const SPAPropertyDetailPage = (): JSX.Element => {
  const router = useRouter();
  const propertyIdentifier = router.query.propertyIdentifier as string;
  const spaProperty = router.query.spaProperty as string;
  const initialTab = router.query.initialTab as string;
  const deploymentCount = useGetTotalDeploymentsForApps(propertyIdentifier, spaProperty);
  if (deploymentCount.isError === true) {
    toast.error(`Sorry cannot find ${spaProperty}`);
    router.push(`/properties/${propertyIdentifier}`);
  }
  const { handleTabChange, openTab } = useTabs(3, Number(initialTab || '0'));

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
      />
      <PageSection isCenterAligned isWidthLimited className="pf-u-px-lg">
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
              <ContainerizedDeployment />
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
        </Tabs>
      </PageSection>
    </>
  );
};
