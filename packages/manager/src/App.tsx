import { ReactKeycloakProvider } from "@react-keycloak/web";
import { keycloak } from "./keycloak";
import Keycloak from "keycloak-js";
import AppRouter from "./Routes";

function kcLog(event: any, error: Keycloak.KeycloakError | undefined) {
  if(error) {
    console.log("KeycloakProvider ", event, keycloak.authenticated, error);
  }
}

// Wrap everything inside KeycloakProvider
export default () => {
  return (
    <ReactKeycloakProvider
      authClient={keycloak}
      initOptions={{ onLoad: "login-required" }}
      onEvent={(event, error) => kcLog(event, error)}
    >
      <AppRouter />
    </ReactKeycloakProvider>
  );
};
