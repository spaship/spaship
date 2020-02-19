/**
 * Parse the window.env values into usable data structures.
 */

interface WindowEnv {
  SPASHIP_APIS?: string;
}
declare global {
  interface Window {
    env: WindowEnv;
  }
}

interface SPAshipAPI {
  name: string;
  url: string;
}

interface ParsedEnv {
  SPASHIP_APIS: Array<SPAshipAPI>;
}

let cachedEnvs: ParsedEnv;

function parse(): ParsedEnv {
  if (cachedEnvs) {
    return cachedEnvs;
  }

  const SPASHIP_APIS_ENV = window.env.SPASHIP_APIS || "local@http://localhost:8008";
  const spashipAPIs = SPASHIP_APIS_ENV.trim()
    .split(/\s+/) // split on whitespace
    .map(def => ({ name: def.split("@")[0], url: def.split("@")[1] })); // name@url to { name, url }

  const result = { SPASHIP_APIS: spashipAPIs };

  cachedEnvs = result;

  return result;
}

export default { parse };
