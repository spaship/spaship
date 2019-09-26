import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import ApplicationList from './components/application/ApplicationList';
import AddApplication from './components/application/AddApplication';
import ApplicationIndex from './components/application/ApplicationIndex';
export default () => {
  return (
    <Switch>
      <Redirect exact path="/" to="/applications" />
      <Route path="/applications/new" component={AddApplication} />
      <Route
        path="/applications/:applicationName"
        component={ApplicationIndex}
      />
      <Route path="/applications" component={ApplicationList} />
    </Switch>
  );
};
