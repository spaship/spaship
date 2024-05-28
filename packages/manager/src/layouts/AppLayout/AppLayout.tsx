import { ReactNode } from 'react';
import { Flex, FlexItem, Page } from '@patternfly/react-core';
import { Feedback } from '@app/components/Feedback';
import { Nav } from './components/Nav';
import { SideBar } from './components/SideBar';

interface Props {
  children: ReactNode;
}

/**
 * TODO: Breadcrumb generator to be built using a context
 * TODO: The title for layout should change based on URLs or can be from a context
 */
export const AppLayout = ({ children }: Props): JSX.Element => (
  <div style={{ maxHeight: '100dvh' }}>
    <Page sidebar={<SideBar />} header={<Nav />} style={{ flex: 1 }}>
      <Flex
        direction={{ default: 'column' }}
        spaceItems={{ default: 'spaceItemsNone' }}
        style={{ height: '100dvh' }}
        flexWrap={{ default: 'nowrap' }}
      >
        <FlexItem grow={{ default: 'grow' }} style={{ flexDirection: 'column', display: 'flex' }}>
          {children}
        </FlexItem>
      </Flex>
      <div style={{ padding: '30px' }}>
        <Feedback />
      </div>
    </Page>
  </div>
);

export const getAppLayout = (page: JSX.Element): JSX.Element => <AppLayout>{page}</AppLayout>;
