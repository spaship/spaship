import React from "react";
import { PageSidebar } from "@patternfly/react-core";
import PageNav from "./PageNav";

export default () => {
  return <PageSidebar nav={<PageNav/>} theme="dark"/>;
};
