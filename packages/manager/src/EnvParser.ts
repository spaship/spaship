/**
 * Parse the window.env values into usable data structures.
 */

interface IWindowEnv {
  SPASHIP_APIS?: string;
  SSO_HOST?: string;
}
declare global {
  interface Window {
    env?: IWindowEnv;
  }
}

interface ISPAshipAPI {
  name: string;
  url: string;
}

interface IParsedEnv {
  SPASHIP_APIS: Array<ISPAshipAPI>;
  SSO_HOST: string;
}

let cachedEnvs: IParsedEnv;

function parse(): IParsedEnv {
  if (cachedEnvs) {
    return cachedEnvs;
  }

  const ENV = window.env || {};

  // parse the SPAship API definitions
  const SPASHIP_APIS_ENV = ENV.SPASHIP_APIS || "local@http://localhost:8008";
  const SPASHIP_APIS = SPASHIP_APIS_ENV.trim()
    .split(/\s+/) // split on whitespace
    .map(def => ({ name: def.split("@")[0], url: def.split("@")[1] })); // name@url to { name, url }

  // parse the SSO host URL
  const SSO_HOST = ENV.SSO_HOST || "mock";

  // parse the SSO realm
  const SSO_REALM = ENV.SSO_REALM || "mock";

  const result = { SPASHIP_APIS, SSO_HOST, SSO_REALM };

  cachedEnvs = result;

  return result;
}

export default { parse };
