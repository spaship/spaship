const express = require("express");
const proxy = require("http-proxy-middleware");
const fsp = require("fs").promises;
const { flatpath } = require("@spaship/common");
const { log } = require("@spaship/common/lib/logging/pino");
const config = require("./config");
const { difference } = require("lodash");

let topLevelDirs = [];

async function updateDirCache() {
  // Load directory names into memory
  //TODO: put the replace this hardcoded path with config
  const freshDirs = await fsp.readdir(config.get("webroot"));

  const added = difference(freshDirs, topLevelDirs);
  const removed = difference(topLevelDirs, freshDirs);

  // update cache
  topLevelDirs = freshDirs;
  // Sort them by name length from longest to shortest, for most specific match wins matching policy
  topLevelDirs.sort((a, b) => b.length - a.length);

  if (added.length || removed.length) {
    log.info({ dirCache: { added, removed } }, `detected changes in SPAship directory list`);
  }
}

const customRouter = function(req) {
  let url = req.url.replace(/\/+/g, "/"); // Avoid duplicate slash issue
  let routeUrl;
  let match;
  let spaPath;
  let matchedFlatDir;

  log.info({ router: { step: "initial", incUrl: url } }, "incoming request");

  // See if this URL is hosted by SPAship
  for (let flatDir of topLevelDirs) {
    spaPath = flatpath.toUrl(flatDir);
    let regEx = new RegExp("^" + spaPath + "([/\\?].*)?$");
    match = url.match(regEx);
    if (match) {
      matchedFlatDir = "/" + flatDir;
      break; // found a match
    }
  }

  log.info(
    { router: { step: "matching", incUrl: url, spaPath, matchedFlatDir, matchFound: !!matchedFlatDir } },
    "matching incoming path against SPAship directory list"
  );

  if (!match) {
    return config.get("fallback");
  }

  let extraStuff = "";
  if (match[1]) {
    extraStuff = match[1]; // $1 of the RegExp
  }
  routeUrl = matchedFlatDir + extraStuff;

  // Now proxy to flattened url path
  req.url = routeUrl;
  req.headers["x-spaship-flat-path"] = matchedFlatDir;
  req.headers["x-spaship-url-path"] = spaPath;
  let routeHost = config.get("target");
  let targetUrl = routeHost + req.url;

  log.info({ router: { incUrl: url, targetUrl } }, `Routing to: ${targetUrl}`);

  return routeHost;
};

// proxy middleware options
let options = {
  target: config.get("target"), // target host
  changeOrigin: true,
  router: customRouter,
  logLevel: "info",
  logProvider: () => log,
  autoRewrite: true,
  onProxyRes: (proxyRes, req) => {
    if (proxyRes.statusCode >= 301 && proxyRes.statusCode <= 308 && proxyRes.headers["location"]) {
      // When the origin responds with a redirect it's location contains the flat path.
      // This needs to be converted back to the url path. The original conversion is stored
      // in the request headers to quickly restore just the spa portion of the path back to original

      let location = proxyRes.headers["location"];
      let flatPath = req.headers["x-spaship-flat-path"];
      let urpPath = req.headers["x-spaship-url-path"];

      if (flatPath && urpPath) {
        location = location.replace(flatPath, urpPath);
      }

      proxyRes.headers["location"] = location;
    }
  }
};

// create the proxy
let pathProxy = proxy(options);

let intervalId;
let server;

async function start() {
  // Load the flat directory names into memory and keep them refreshed
  await updateDirCache();
  intervalId = setInterval(updateDirCache, 750);

  // Start proxy server on port
  let app = express();
  app.use("/", pathProxy);
  server = app.listen(config.get("port"));
}

/**
 * Stop the running server.
 * @async
 */
function stop() {
  clearInterval(intervalId);
  return new Promise(resolve => {
    server.close(resolve);
  });
}

module.exports = { start, stop };

// if this module is the entry-point, go ahead and launch path-proxy
if (require.main === module) {
  start();
}
