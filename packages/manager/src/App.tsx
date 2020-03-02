import React from "react";
import { Router, Redirect, Route, Switch } from "react-router-dom";
import ApplicationList from "./components/application/ApplicationList";
import AddApplication from "./components/application/AddApplication";
import ApplicationIndex from "./components/application/ApplicationIndex";
import LoginPage from "./components/user/LoginPage";
import APIKeyIndex from "./components/authentication/APIKeyIndex";
import { createBrowserHistory } from "history";

const history = createBrowserHistory();

export default () => {
  return (
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
  );
};
