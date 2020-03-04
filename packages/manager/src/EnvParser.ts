/**
 * Parse the window.env values into usable data structures.
 */

// The "environment variables" avaialble on window.env.
interface IWindowEnv {
  SPASHIP_APIS?: string;
  SSO_HOST?: string;
  SSO_REALM?: string;
}
declare global {
  interface Window {
    env?: IWindowEnv;
  }
}

// The name/url pairs for each entry in SPASHIP_APIs.
interface ISPAshipAPI {
  name: string;
  url: string;
}

// The processed version of IWindowEnv, with values parsed from strings into proper data structures.
interface IParsedEnv {
  SPASHIP_APIS: Array<ISPAshipAPI>;
  SSO_HOST: string;
  SSO_REALM: string;
}

let cachedEnvs: IParsedEnv;

function parse(): IParsedEnv {
  if (cachedEnvs) {
    return cachedEnvs;
  }

  const ENV = window.env || ({} as IWindowEnv);

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
