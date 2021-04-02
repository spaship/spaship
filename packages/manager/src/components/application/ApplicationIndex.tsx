import { useLocation, useParams } from "react-router-dom";
import { Nav, NavList, NavItem } from "@patternfly/react-core";
import { Redirect, Route, Switch } from "react-router-dom";
import Page from "../../layout/Page";
import ApplicationDetail from "./ApplicationDetail";

export default () => {
  const location = useLocation();
  const { applicationName } = useParams<{ applicationName: string }>();

  return (
    <Page title={applicationName || ""}>
      <Nav variant="tertiary">
        <NavList>
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
