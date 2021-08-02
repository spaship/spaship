import { Router, Redirect, Route, Switch } from "react-router-dom";
import { Bullseye } from "@patternfly/react-core";
import { createBrowserHistory } from "history";
import ApplicationList from "./components/application/ApplicationList";
import AddApplication from "./components/application/AddApplication";
import ApplicationIndex from "./components/application/ApplicationIndex";
import LoginPage from "./components/user/LoginPage";
import APIKeyList from "./components/authentication/APIKeyList";
import PrivateRoute from "./PrivateRoute";
import { useKeycloak } from "@react-keycloak/web";
import EnvironmentList from "./components/environment/EnvironmentList";
import DashboardIndex from "./components/dashboard/DashboardIndex";
import EmptySpinner from "./components/general/EmptySpinner";
import PropertyList from "./components/property/PropertyList";
import DashboardSPAPage from "./components/dashboard/spa/DashboardSPAPage";

const history = createBrowserHistory();

// Wrap everything inside KeycloakProvider
export default () => {
  const { initialized } = useKeycloak();
  if (!initialized) {
    return (
      <Bullseye>
        <EmptySpinner />
      </Bullseye>
    );
  }

  return (
    <Router history={history}>
      <Switch>
        <Route exact path="/" component={PropertyList} />
        <Redirect exact path="/authentication" to="/authentication/apikeys" />
        <Route path="/login" component={LoginPage} />
        <PrivateRoute path="/authentication/apikeys" component={APIKeyList} />
        <PrivateRoute path="/applications/new" component={AddApplication} />
        <PrivateRoute path="/applications/:applicationName" component={ApplicationIndex} />
        <PrivateRoute path="/applications" component={ApplicationList} />
        <PrivateRoute path="/environments" component={EnvironmentList} />
        <PrivateRoute path="/dashboard/property/:propertyName" component={DashboardIndex} />
        <PrivateRoute path="/dashboard/:propertyName/spaName/:spaName" component={DashboardSPAPage} />
        <Route exact path="/dashboard">
          <Redirect to={history.location.pathname} /> : <DashboardIndex />
        </Route>
      </Switch>
    </Router>
  );
};
