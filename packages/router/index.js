const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fsp = require("fs").promises;
const { flatpath } = require("@spaship/common");
const { log } = require("@spaship/common/lib/logging/pino");
const config = require("./config");
const { difference } = require("lodash");

let topLevelDirsCache = [];

async function updateDirCache() {
  // Load directory names into memory
  const freshDirs = await fsp.readdir(config.get("webroot"));

  const added = difference(freshDirs, topLevelDirsCache);
  const removed = difference(topLevelDirsCache, freshDirs);

  // update cache
  topLevelDirsCache = freshDirs;

  // Sort them by name length from longest to shortest, for most specific match wins matching policy
  topLevelDirsCache.sort((a, b) => b.length - a.length);

  if (added.length || removed.length) {
    log.info({ dirCache: { added, removed } }, `detected changes in SPAship directory list`);
  }
}

const customRouter = function (req) {
  let url = req.url.replace(/\/+/g, "/"); // Avoid duplicate slash issue
  let routeUrl; // This is the final path that the router will route the request to
  let regExMatch; // Regular expression match object for finding SPA paths in the url
  let spaPath; // The unflattened path to the spaship hosted path
  let matchedFlatDir; // The flat path of the spa on the spaship httpd server
  let routeHost; // hostname that the router will proxy to
  let matchFound = false; // Is this incoming request found to be hosted by spaship or not
  let targetUrl; // Final full URL that will be routed to

  log.debug({ router: { step: "matching", incUrl: url } }, "matching incoming path against spaship directory list");

  // See if this URL is hosted by SPAship
  for (let flatDir of topLevelDirsCache) {
    spaPath = flatpath.toUrl(flatDir);
    let regEx = new RegExp("^" + spaPath + "([/\\?].*)?$");
    regExMatch = url.match(regEx);
    if (regExMatch) {
      // match found!
      matchedFlatDir = "/" + flatDir;

      let extraStuff = "";
      if (regExMatch[1]) {
        extraStuff = regExMatch[1]; // $1 of the RegExp
      }
      routeUrl = matchedFlatDir + extraStuff;

      log.debug({ router: { matchedFlatDir: matchedFlatDir, spaPath: spaPath } }, "Found a specific spa match");

      matchFound = true;
      break; // match found, no need to keep looping
    }
  }

  if (!matchFound) {
    // Check if ROOTSPA exists
    if (topLevelDirsCache.indexOf("ROOTSPA") >= 0) {
      matchedFlatDir = "/ROOTSPA";
      spaPath = "/";
      routeUrl = matchedFlatDir + url;

      log.debug({ router: { matchedFlatDir: matchedFlatDir, spaPath: spaPath } }, "Found ROOTSPA match");

      matchFound = true;
    } else {
      // No regExMatch anywhere, finally return fallback host to proxy to, if none is defined this will cause a 404
      routeHost = config.get("fallback");
      log.debug({ router: { step: "fallback", fallbackHost: routeHost } }, "No match, proxy to fallback host");
    }
  }

  if (matchFound) {
    // Proxy to spaship flattened url path
    req.url = routeUrl;
    req.headers["x-spaship-flat-path"] = matchedFlatDir;
    req.headers["x-spaship-url-path"] = spaPath;
    routeHost = config.get("target");

    log.debug(
      {
        router: {
          step: "spaship route",
          incUrl: url,
          matchedFlatDir,
          spaPath,
        },
      },
      "routing to spaship hosted spa"
    );
  }

  targetUrl = routeHost + req.url;
  log.info({ router: { incUrl: url, targetUrl } }, `Routing to targetUrl`);

  return routeHost;
};

// proxy middleware options
let options = {
  target: config.get("target"), // target host
  changeOrigin: true,
  router: customRouter,
  logLevel: config.get("log_level"),
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
  },
};

// create the proxy
let pathProxy = createProxyMiddleware(options);

let intervalId;
let server;

async function start() {
  // Load the flat directory names into memory and keep them refreshed
  await updateDirCache();
  intervalId = setInterval(updateDirCache, 2000);

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
  return new Promise((resolve) => {
    server.close(resolve);
  });
}

module.exports = { start, stop };

// if this module is the entry-point, go ahead and launch the router
if (require.main === module) {
  start();
}
