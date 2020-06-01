import React, { useState } from "react";
import { useLocation, useParams, withRouter } from "react-router-dom";
import { Nav, NavList, NavItem, NavVariants, ButtonVariant } from "@patternfly/react-core";
import { StyleSheet, css } from "@patternfly/react-styles";
import { Redirect, Route, Switch } from "react-router-dom";
import Page from "../../layout/Page";
import ApplicationDetail from "./ApplicationDetail";
import ConfirmButton from "../general/ConfirmButton";
import { deleteApplication } from "../../services/ApplicationService";
import config, { IEnvironment } from "../../config";

const styles = StyleSheet.create({
  tertiary: {
    width: "100%",
    borderBottom: "1px solid #DDDDDD",
  },
});

export default withRouter(({ history }) => {
  const location = useLocation();
  const { applicationName } = useParams();
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
});
