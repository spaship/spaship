import React from "react";
import { KeycloakProvider } from "@react-keycloak/web";
import { keycloak } from "./keycloak";
import Keycloak from "keycloak-js";
import AppRouter from "./Routes";

function kcLog(event: any, error: Keycloak.KeycloakError | undefined) {
  console.log("KeycloakProvider ", event, keycloak.authenticated, error);
}

// Wrap everything inside KeycloakProvider
export default () => {
  return (
    <KeycloakProvider
      keycloak={keycloak}
      // initConfig={{ onLoad: "login-required" }}
      onTokens={(...tokens) => console.log("KeycloakProvider onToken:", tokens)}
      onEvent={(event, error) => kcLog(event, error)}
    >
      <AppRouter />
    </KeycloakProvider>
  );
};
