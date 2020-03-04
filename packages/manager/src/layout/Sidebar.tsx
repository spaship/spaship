import React from "react";
import { PageSidebar } from "@patternfly/react-core";
import { StyleSheet, css } from "@patternfly/react-styles";
import PageNav from "./PageNav";

const styles = StyleSheet.create({
  sidebar: {
    height: "100%",
    width: "260px",
    borderRight: "1px solid #DDDDDD"
  }
});

export default () => {
  return <PageSidebar nav={<PageNav />} className={css(styles.sidebar)} />;
};
