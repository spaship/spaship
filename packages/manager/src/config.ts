import EnvParser from "./EnvParser";

const envs = EnvParser.parse();

const config = {
  apiHost: "https://spaship-api-cpops-dev.ext.us-west.dc.preprod.paas.redhat.com",
  siteHost: "https://spaship-router-cpops-dev.ext.us-west.dc.preprod.paas.redhat.com",
  apiHosts: envs.SPASHIP_APIS,
  sso: {
    keycloak: {
      url: envs.KEYCLOAK_URL,
      realm: envs.KEYCLOAK_REALM,
      clientId: envs.KEYCLOAK_CLIENT_ID
    }
  }
};

export default config;
