import { FunctionComponent } from "react";
import { Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import Footer from "./footer";
import Sidebar from "./sidebar";
import styled from "styled-components";
import React from "react";
import Header from "./header";

interface LayoutProps {
  skipLayout: boolean
}

const SidebarArea = styled(SplitItem) `
    width: 250px;
`

const ContentArea = styled(SplitItem) `
    min-height: 80vh;
`

const HeaderArea = styled(StackItem)`
  min-height: 100px;
`

const BodyArea = styled(StackItem)`
  padding: 1vw 10vw;
  min-height: 85vh;
  width: 60vw;
`

const FooterArea = styled(StackItem)`
  padding: 0 5vw;
  min-height: 5vh;
  width: 60vw;
`

const LayoutDefinition: FunctionComponent<{}> = ({ children }) => {
  return (
    <>
      <Split>
        <SidebarArea><Sidebar></Sidebar></SidebarArea>
        <ContentArea isFilled>
          <Stack>
            <HeaderArea><Header></Header></HeaderArea>
            <BodyArea isFilled>{children}</BodyArea>
            <FooterArea><Footer></Footer></FooterArea>
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