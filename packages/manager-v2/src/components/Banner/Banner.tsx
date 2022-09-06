import { ReactNode } from 'react';
import { PageSection, Stack, StackItem, Breadcrumb, BreadcrumbItem } from '@patternfly/react-core';

interface Props {
  children: ReactNode;
}

export const Banner = ({ children }: Props): JSX.Element => (
  <PageSection
    isWidthLimited
    isCenterAligned
    className="pf-u-px-4xl pf-u-pb-lg"
    style={{ borderBottom: '1px solid #d2d2d2' }}
  >
    <Stack hasGutter>
      <StackItem>{children}</StackItem>
      <StackItem>
        <Breadcrumb>
          <BreadcrumbItem>Section home</BreadcrumbItem>
          <BreadcrumbItem>Section title</BreadcrumbItem>
          <BreadcrumbItem>Section title</BreadcrumbItem>
        </Breadcrumb>
      </StackItem>
    </Stack>
  </PageSection>
);
