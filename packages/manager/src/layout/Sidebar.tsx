import { PageSidebar } from "@patternfly/react-core";
import styled from "styled-components";
import PageNav from "./PageNav";

const StyledSidebar = styled(PageSidebar)({
  height: "100%",
  width: "260px",

  borderRight: "1px solid #DDDDDD",
});

export default () => {
  return <StyledSidebar nav={<PageNav />} theme="light" />;
};
