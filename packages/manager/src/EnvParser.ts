/**
 * Parse the window.env values into usable data structures.
 */

// The name/url pairs for each entry in SPASHIP_APIs.
interface ISPAshipAPI {
  name: string;
  url: string;
}

// The processed version of IWindowEnv, with values parsed from strings into proper data structures.
interface IParsedEnv {
  SPASHIP_APIS: Array<ISPAshipAPI>;
  KEYCLOAK_URL: string;
  KEYCLOAK_REALM: string;
  KEYCLOAK_CLIENT_ID: string;
}

let cachedEnvs: IParsedEnv;

function parse(): IParsedEnv {
  if (cachedEnvs) {
    return cachedEnvs;
  }

  // parse the SPAship API definitions
  const SPASHIP_APIS_ENV = process.env.REACT_APP_SPASHIP_URLS || "local@http://localhost:8008";
  const SPASHIP_APIS = SPASHIP_APIS_ENV.trim()
    .split(/\s+/) // split on whitespace
    .map(def => ({ name: def.split("@")[0], url: def.split("@")[1] })); // name@url to { name, url }

  // parse the SSO host URL
  const KEYCLOAK_URL = process.env.REACT_APP_KEYCLOAK_URL || "mock";

  // parse the SSO realm
  const KEYCLOAK_REALM = process.env.REACT_APP_KEYCLOAK_REALM || "mock";

  // parse the SSO client id
  const KEYCLOAK_CLIENT_ID = process.env.REACT_APP_KEYCLOAK_CLIENT_ID || "mock";

  const result = { SPASHIP_APIS, KEYCLOAK_URL, KEYCLOAK_REALM, KEYCLOAK_CLIENT_ID };

  cachedEnvs = result;

  return result;
}

export default { parse };
