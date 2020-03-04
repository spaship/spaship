import React from "react";
import { Router, Redirect, Route, Switch } from "react-router-dom";
import ApplicationList from "./components/application/ApplicationList";
import AddApplication from "./components/application/AddApplication";
import ApplicationIndex from "./components/application/ApplicationIndex";
import LoginPage from "./components/user/LoginPage";
import APIKeyIndex from "./components/authentication/APIKeyIndex";
import { createBrowserHistory } from "history";
import { KeycloakProvider } from "@react-keycloak/web";
import { keycloak } from "./keycloak";

const history = createBrowserHistory();

// Wrap everything inside KeycloakProvider
export default () => {
  return (
    <KeycloakProvider
      keycloak={keycloak}
      onTokens={token => console.log(token)}
      onEvent={(event, error) => console.log(event, error)}
    >
      <Router history={history}>
        <Switch>
          <Redirect exact path="/" to="/login" />
          <Redirect exact path="/authentication" to="/authentication/apikey" />
          <Route path="/login" component={LoginPage} />
          <Route path="/authentication/apikey" component={APIKeyIndex} />
          <Route path="/applications/new" component={AddApplication} />
          <Route path="/applications/:applicationName" component={ApplicationIndex} />
          <Route path="/applications" component={ApplicationList} />
        </Switch>
      </Router>
    </KeycloakProvider>
  );
};
