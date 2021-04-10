import { useState } from "react";
import { useLocation, useParams, withRouter } from "react-router-dom";
import { Nav, NavList, NavItem, ButtonVariant } from "@patternfly/react-core";
import { Redirect, Route, Switch } from "react-router-dom";
import Page from "../../layout/Page";
import ApplicationDetail from "./ApplicationDetail";
import ConfirmButton from "../general/ConfirmButton";
import { deleteApplication } from "../../services/ApplicationService";
import config, { IEnvironment } from "../../config";

export default withRouter(({ history })  () => {
  const location = useLocation();
  const { applicationName } = useParams<{ applicationName: string }>();
  const [environment] = useState<IEnvironment>(config.environments[0]);

  const onClickConfirm = async () => {
    await deleteApplication(environment, applicationName);
    history.push("/applications");
  };

  const titleToolbar = (
    <ConfirmButton
      label="Delete"
      title={`Delete Application "${applicationName}"`}
      variant={ButtonVariant.danger}
      onConfirm={() => onClickConfirm()}
    >
      Are you sure you want to delete this Application?
    </ConfirmButton>
  );
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
});
