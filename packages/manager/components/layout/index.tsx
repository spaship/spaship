import { FunctionComponent } from "react";
import { Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import Footer from "./footer";
import Sidebar from "./sidebar";
import styled from "styled-components";
import React from "react";

interface LayoutProps {
  skipLayout: boolean
}

const SidebarArea = styled(SplitItem) `
    width: 250px;
`

const ContentArea = styled(SplitItem) `
    min-height: 80vh;
`

const BodyArea = styled(StackItem)`
  min-height: 94vh;
`

const LayoutDefinition: FunctionComponent<{}> = ({ children }) => {
  return (
    <>
      <Split>
        <SidebarArea><Sidebar /></SidebarArea>
        <ContentArea isFilled>
          <Stack>
            <BodyArea isFilled>{children}</BodyArea>
            <Footer/>
          </Stack>
        </ContentArea>
      </Split>
    </>
  );
};

const Layout: FunctionComponent<LayoutProps> = ({ skipLayout, children }) => {
  const Wrapper:FunctionComponent = skipLayout ? React.Fragment : LayoutDefinition;
  return <Wrapper>{children}</Wrapper>
};

export default Layout;