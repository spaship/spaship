import React from "react";
import { render } from "react-dom";
import * as serviceWorker from "./serviceWorker";
import "@patternfly/react-core/dist/styles/base.css";
import "./static/css/root.css";
import App from "./App";
import config from "./config";
import Keycloak from "keycloak-js";

// configure keycloak
const keycloak = Keycloak<"native">({
  url: config.ssoHost,
  realm: "EmployeeIDP",
  clientId: "spaship-reference"
});

(async () => {
  // init keycloak
  await keycloak.init({ promiseType: "native" });

  // if authenticated, render the app, otherwise redirect to login
  if (keycloak.authenticated) {
    console.log(`authenticated`);
    render(<App />, document.getElementById("root"));
  } else {
    console.log(`NOT authenticated`);
    keycloak.login();
  }
})();

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
