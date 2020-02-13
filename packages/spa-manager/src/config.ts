import EnvParser from "./EnvParser";

const envs = EnvParser.parse();

const config = {
  apiHost: "http://spaship.usersys.redhat.com:8008",
  siteHost: "http://spaship.usersys.redhat.com",
  apiHosts: envs.SPASHIP_APIS
};

console.log(config);

export default config;
