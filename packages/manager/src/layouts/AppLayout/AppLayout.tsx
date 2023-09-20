import { ReactNode } from 'react';

import { Banner, Flex, FlexItem, Page } from '@patternfly/react-core';

import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { useGetDocumentPage } from '@app/services/documents';
import { SideBar } from './components/SideBar';
import { Nav } from './components/Nav';
import { Footer } from './components/Footer';

interface Props {
  children: ReactNode;
}

/**
 * TODO: Breadcrumb generator to be building using a context
 * TODO: The title for layout should be changing based on URLs or can be from a context
 */
export const AppLayout = ({ children }: Props): JSX.Element => {
  const data = useGetDocumentPage();
  const sections = Object.keys(data?.data || {}).filter((section) => section === 'banner');
  const lastSection = sections[sections.length - 1];
  const lastSectionData = data?.data?.[lastSection] ?? [];
  const lastElement = lastSectionData[lastSectionData.length - 1] ?? null;
  const isOutage = (lastElement && lastElement.tags?.includes('outage')) || false;

  return (
    <>
      {lastElement && !isOutage && (
        <Banner
          style={{
            backgroundColor: 'white'
          }}
          isSticky
          variant="info"
        >
          <Flex
            justifyContent={{ default: 'justifyContentCenter' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            <a target="_blank" href={lastElement.link} rel="noreferrer">
              <ExternalLinkAltIcon
                style={{
                  marginRight: '0.5rem'
                }}
              />
              {lastElement.title}
            </a>
          </Flex>
        </Banner>
      )}
      {lastElement && isOutage && (
        <Banner
          style={{
            backgroundColor: '#F44336',
            color: '#FFFFFF',
            fontWeight: 'bolder'
          }}
          isSticky
          variant="info"
        >
          <Flex
            justifyContent={{ default: 'justifyContentCenter' }}
            alignItems={{ default: 'alignItemsCenter' }}
          >
            {lastElement.title}
          </Flex>
        </Banner>
      )}
      <Page sidebar={<SideBar />} header={<Nav />}>
        <Flex
          direction={{ default: 'column' }}
          spaceItems={{ default: 'spaceItemsNone' }}
          style={{ height: '100%' }}
          flexWrap={{ default: 'nowrap' }}
        >
          <FlexItem grow={{ default: 'grow' }}>{children}</FlexItem>
          <FlexItem>
            <Footer />
          </FlexItem>
        </Flex>
      </Page>
    </>
  );
};

export const getAppLayout = (page: JSX.Element) => <AppLayout>{page}</AppLayout>;
