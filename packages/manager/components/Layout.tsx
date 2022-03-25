import { FunctionComponent } from "react";
import { Split, SplitItem, Stack, StackItem } from '@patternfly/react-core';
import Footer from "./layout/Footer";
import Sidebar from "./layout/Sidebar";
import styled from "styled-components";

interface LayoutProps {}

const SidebarArea = styled(SplitItem) `
    width: 20vw;
`

const ContentArea = styled(SplitItem) `
    min-height: 80vh;
    width: 60vw;
`

const Layout: FunctionComponent<LayoutProps> = ({ children }) => {
  return (
    <div>
      <Split>
        <SidebarArea><Sidebar></Sidebar></SidebarArea>
        <ContentArea isFilled>
          <Stack>
            <StackItem isFilled>{children}</StackItem>
            <StackItem><Footer></Footer></StackItem>
          </Stack>
        </ContentArea>
      </Split>
    </div>
  );
};

export default Layout;
