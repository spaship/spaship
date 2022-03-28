import { FunctionComponent } from "react";
import { Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import Footer from "./layout/footer";
import Sidebar from "./layout/sidebar";
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

const Layout: FunctionComponent<{}> = ({ children }) => {
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

const LayoutComponent: FunctionComponent<LayoutProps> = ({ skipLayout, children }) => {
  const Wrapper:FunctionComponent = skipLayout ? React.Fragment : Layout;
  return <Wrapper>{children}</Wrapper>
};

export default LayoutComponent;