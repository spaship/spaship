import { Brand, PageHeader } from "@patternfly/react-core";
import styled from "styled-components";
import HeaderTools from "./HeaderTools";
import Logo from "../static/img/logo.svg";

export const StyledHeader = styled(PageHeader)({
  backgroundColor: "#ffffff",
});

export default () => {
  return <StyledHeader logo={<Brand src={Logo} alt="SPAship Logo" />} headerTools={<HeaderTools />} />;
};
