import React from "react";
import { Brand, PageHeader } from "@patternfly/react-core";
import PageToolbar from "./PageToolbar";
import Logo from "../static/img/logo.svg";

export default () => {
  return <PageHeader logo={<Brand src={Logo} alt="SPAship Logo" />} toolbar={<PageToolbar />} />;
};
