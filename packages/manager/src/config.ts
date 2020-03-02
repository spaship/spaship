import EnvParser from "./EnvParser";

const envs = EnvParser.parse();

const config = {
  apiHost: "https://spaship-api-cpops-dev.ext.us-west.dc.preprod.paas.redhat.com",
  siteHost: "https://spaship-router-cpops-dev.ext.us-west.dc.preprod.paas.redhat.com",
  apiHosts: envs.SPASHIP_APIS,
  ssoHost: envs.SSO_HOST
};

export default config;
