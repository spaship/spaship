import { ReactNode } from 'react';

import { Flex, FlexItem, Page } from '@patternfly/react-core';

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
);

export const getAppLayout = (page: JSX.Element) => <AppLayout>{page}</AppLayout>;
