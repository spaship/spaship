import React, { ReactNode } from 'react';
import {
  Page,
  PageSection,
  PageSectionVariants,
  Text,
  TextContent
} from '@patternfly/react-core';
import Header from './Header';
import Sidebar from './Sidebar';

interface IProps {
  title: string;
  subTitle?: ReactNode | string;
  children: ReactNode | string;
}

export default (props: IProps) => {
  const { title, subTitle, children } = props;
  return (
    <Page
      header={<Header />}
      sidebar={<Sidebar />}
      isManagedSidebar
      // skipToContent={PageSkipToContent}
      mainContainerId="main-content-page-layout-simple-nav"
    >
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{title}</Text>
        </TextContent>
      </PageSection>

      {subTitle && (
        <PageSection variant={PageSectionVariants.light}>
          {subTitle}
        </PageSection>
      )}
      <PageSection>{children}</PageSection>
    </Page>
  );
};
