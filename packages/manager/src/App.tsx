import React from "react";
import { useKeycloak, KeycloakProvider } from "@react-keycloak/web";
import { keycloak } from "./keycloak";
import AppRouter from "./Routes";

// Wrap everything inside KeycloakProvider
export default () => {
  return (
    <KeycloakProvider
      keycloak={keycloak}
      initConfig={{ onLoad: "login-required" }}
      onTokens={(...tokens) => console.log("KeycloakProvider onToken:", tokens)}
      onEvent={(event, error) => console.log("KeycloakProvider onEvent:", event, error)}
    >
      <AppRouter />
    </KeycloakProvider>
  );
};
