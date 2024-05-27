import { ReactNode } from 'react';
import { Banner, Flex, FlexItem, Page } from '@patternfly/react-core';
import { Feedback } from '@app/components/Feedback';
import { useGetDocumentPage } from '@app/services/documents';
import { ExternalLinkAltIcon } from '@patternfly/react-icons';
import { Nav } from './components/Nav';
import { SideBar } from './components/SideBar';

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
        <Feedback />
      </Page>
    </div>
  );
};

export const getAppLayout = (page: JSX.Element) => <AppLayout>{page}</AppLayout>;
