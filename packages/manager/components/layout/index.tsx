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
    width: 20vw;
`

const ContentArea = styled(SplitItem) `
    min-height: 80vh;
    width: 60vw;
`

const LayoutDefinition: FunctionComponent<{}> = ({ children }) => {
  return (
    <>
      <Split>
        <SidebarArea><Sidebar></Sidebar></SidebarArea>
        <ContentArea isFilled>
          <Stack>
            <StackItem isFilled>{children}</StackItem>
            <StackItem><Footer></Footer></StackItem>
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