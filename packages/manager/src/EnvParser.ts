/**
 * Parse the window.env values into usable data structures.
 */

interface IWindowEnv {
  SPASHIP_APIS?: string;
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
}

let cachedEnvs: IParsedEnv;

function parse(): IParsedEnv {
  if (cachedEnvs) {
    return cachedEnvs;
  }

  const ENV = window.env || {};
  const SPASHIP_APIS_ENV = ENV.SPASHIP_APIS || "local@http://localhost:8008";
  const spashipAPIs = SPASHIP_APIS_ENV.trim()
    .split(/\s+/) // split on whitespace
    .map(def => ({ name: def.split("@")[0], url: def.split("@")[1] })); // name@url to { name, url }

  const result = { SPASHIP_APIS: spashipAPIs };

  cachedEnvs = result;

  return result;
}

export default { parse };
