import { ReactNode } from 'react';

import {
  Breadcrumb,
  BreadcrumbItem,
  Flex,
  FlexItem,
  Page,
  PageSection,
  Stack,
  StackItem,
  Title,
  TitleSizes
} from '@patternfly/react-core';

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
    >
      <FlexItem>
        <PageSection
          isWidthLimited
          isCenterAligned
          className="pf-u-px-4xl"
          style={{ backgroundColor: 'var(--spaship-global--Color--spaship-gray)', color: '#fff' }}
        >
          <Stack hasGutter>
            <StackItem>
              <Title headingLevel="h1" size={TitleSizes['2xl']}>
                Properties
              </Title>
            </StackItem>
            <StackItem>
              <Breadcrumb>
                <BreadcrumbItem>Section home</BreadcrumbItem>
                <BreadcrumbItem>Section title</BreadcrumbItem>
                <BreadcrumbItem>Section title</BreadcrumbItem>
              </Breadcrumb>
            </StackItem>
          </Stack>
        </PageSection>
      </FlexItem>
      <FlexItem grow={{ default: 'grow' }}>
        <PageSection className="pf-u-h-100">{children}</PageSection>
      </FlexItem>
      <FlexItem>
        <Footer />
      </FlexItem>
    </Flex>
  </Page>
);

export const getAppLayout = (page: JSX.Element) => <AppLayout>{page}</AppLayout>;
