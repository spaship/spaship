import { ReactNode } from 'react';

import { Banner, Flex, FlexItem, Page } from '@patternfly/react-core';

import { ExternalLinkAltIcon } from '@patternfly/react-icons';
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
export const AppLayout = ({ children }: Props): JSX.Element => (
  <>
    <Banner
      style={{
        backgroundColor: 'var(--spaship-global--Color--solar-orange)'
      }}
      isSticky
      variant="info"
    >
      <Flex
        justifyContent={{ default: 'justifyContentCenter' }}
        alignItems={{ default: 'alignItemsCenter' }}
      >
        <a
          target="_blank"
          href="https://source.redhat.com/groups/public/spaship/blog_article/whats_new_in_spaship_"
          rel="noreferrer"
        >
          <ExternalLinkAltIcon
            style={{
              marginRight: '0.5rem'
            }}
          />
          What&apos;s new in SPAship?
        </a>
      </Flex>
    </Banner>
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

export const getAppLayout = (page: JSX.Element) => <AppLayout>{page}</AppLayout>;
