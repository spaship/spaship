import React from "react";
import { useLocation, useParams } from "react-router-dom";
import {
  Button,
  DataToolbar,
  DataToolbarGroup,
  DataToolbarItem,
  Nav,
  NavList,
  NavItem,
  NavVariants,
  Tooltip,
} from "@patternfly/react-core";
import { StyleSheet, css } from "@patternfly/react-styles";
import { Redirect, Route, Switch } from "react-router-dom";
import Page from "../../layout/Page";
import ApplicationDetail from "./ApplicationDetail";

const styles = StyleSheet.create({
  tertiary: {
    width: "100%",
    borderBottom: "1px solid #DDDDDD",
  },
});

export default () => {
  const location = useLocation();
  const { applicationName } = useParams();

  const titleToolbar = (
    <DataToolbar id="application-toolbar">
      <DataToolbarGroup breakpointMods={[{ modifier: "spacer-md", breakpoint: "md" }]}>
        {/* <DataToolbarItem>
          <Link to={`/applications/new`}>
            <Button variant="primary">Deploy</Button>
          </Link>
        </DataToolbarItem> */}
        <DataToolbarItem>
          <Tooltip content={<div>This feature will coming soon</div>}>
            <Button variant="control" title="Will coming soon">
              Purge Cache
            </Button>
          </Tooltip>
        </DataToolbarItem>
      </DataToolbarGroup>
    </DataToolbar>
  );

  return (
    <Page title={applicationName || ""} titleToolbar={titleToolbar}>
      <Nav onSelect={() => {}}>
        <NavList variant={NavVariants.tertiary} className={css(styles.tertiary)}>
          <NavItem isActive={location.pathname.endsWith("details")}>Details</NavItem>
          {/* <NavItem isActive={location.pathname.endsWith("pipelines")}>Pipelines</NavItem> */}
        </NavList>
      </Nav>
      <br />
      <Switch>
        <Redirect exact path="/applications/:applicationName" to="/applications/:applicationName/details" />
        <Route path="/applications/:applicationName/details" component={ApplicationDetail} />
        {/* <Route path="/applications/:applicationName/pipelines" component={ApplicationDetail} /> */}
      </Switch>
    </Page>
  );
};
