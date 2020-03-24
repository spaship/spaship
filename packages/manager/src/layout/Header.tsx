import React from "react";
import { Brand, PageHeader } from "@patternfly/react-core";
import { StyleSheet, css } from "@patternfly/react-styles";
import PageToolbar from "./PageToolbar";
import Logo from "../static/img/logo.svg";

const styles = StyleSheet.create({
  header: {
    backgroundColor: "#ffffff"
  }
});

export default () => {
  return (
    <PageHeader
      logo={<Brand src={Logo} alt="SPAship Logo" />}
      toolbar={<PageToolbar />}
      className={css(styles.header)}
    />
  );
};
