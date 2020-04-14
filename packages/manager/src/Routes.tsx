import React from "react";
import { Router, Redirect, Route, Switch } from "react-router-dom";
import { createBrowserHistory } from "history";
import ApplicationList from "./components/application/ApplicationList";
import AddApplication from "./components/application/AddApplication";
import ApplicationIndex from "./components/application/ApplicationIndex";
import LoginPage from "./components/user/LoginPage";
import APIKeyList from "./components/authentication/APIKeyList";
import PrivateRoute from "./PrivateRoute";
import { useKeycloak } from "@react-keycloak/web";

const history = createBrowserHistory();

// Wrap everything inside KeycloakProvider
export default () => {
  const { initialized } = useKeycloak();

  if (!initialized) {
    return <div>Loading...</div>;
  }

  return (
    <Router history={history}>
      <Switch>
        <Redirect exact path="/" to="/applications" />
        <Redirect exact path="/authentication" to="/authentication/apikeys" />
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/authentication/apikeys" component={APIKeyList} />
        <PrivateRoute path="/applications/new" component={AddApplication} />
        <PrivateRoute path="/applications/:applicationName" component={ApplicationIndex} />
        <PrivateRoute path="/applications" component={ApplicationList} />
      </Switch>
    </Router>
  );
};
