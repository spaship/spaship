const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");
const fsp = require("fs").promises;
const { flatpath } = require("@spaship/common");
const { log } = require("@spaship/common/lib/logging/pino");
const config = require("./config");
const { difference } = require("lodash");
const { pathMappingsData, loadPathMappings } = require('./pathmapping');

const apiRoutes = require('./api');

let topLevelDirsCache = [];


log.debug(config.get(), "router configuration");

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

  for (let mapping of pathMappingsData.pathMappings) {
    if (mapping.virtualPath === url) {
      url = mapping.mappedTo;
      req.url = url; // Update the request URL
      break;
    }
  }


  let routeUrl; // This is the final path that the router will route the request to
  let regExMatch; // Regular expression match object for finding SPA paths in the url
  let spaPath; // The unflattened path to the spaship hosted path
  let matchedFlatDir; // The flat path of the spa on the spaship httpd server
  let routeHost; // hostname that the router will proxy to
  let matchFound = false; // Is this incoming request found to be hosted by spaship or not
  let targetUrl; // Final full URL that will be routed to
  log.debug({ router: { step: "matching", incUrl: url } }, "matching incoming path against spaship directory list");
  // See if this URL is hosted by SPAship at a specific non-root sub-path e.g. /foo
  for (let flatDir of topLevelDirsCache) {
    spaPath = flatpath.toUrl(flatDir);
    log.debug({"goes in: ": flatDir,"comes out ":spaPath},"")
    if (spaPath === "/") continue; // Ignore root path spa here we will check that later
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
    // See if SPAship hosts a spa at the root path "/", check if ROOTSPA exists
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

  if (!routeHost) {
    log.debug({},"routeHost is undefined or empty")
  } else {
    targetUrl = routeHost + req.url;
  }
  log.debug({ router: { incUrl: url, targetUrl, "reqUrl": req.url,"routeHost":routeHost} }, `Routing to targetUrl`);

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

const pathProxy = (req, res, next) => {
  const forwardedHost = config.get("forwarded_host");
  const xForwaredHost = req.headers["x-forwarded-host"];
  const host = req.headers["host"];

  //
  /**
   * If forwarded_host is found in config, use it as host
   * If x-forwarded-host has some different value, use it as host
   */
  if (forwardedHost) {
    options.hostRewrite = forwardedHost;
  } else if (xForwaredHost !== host) {
    options.hostRewrite = xForwaredHost;
  }

  return createProxyMiddleware(options)(req, res, next);
};


function isInternalRequest(req, res, next) {
  const allowedHostsConfig = config.get("allowed_hosts");
  if (!allowedHostsConfig) {
    log.info('No allowed hosts configured, restricting all requests to /spaship-proxy/api/v1');
    res.status(403).send('Forbidden');
    return;
  }
  const allowedHosts = allowedHostsConfig.split(',');
  const host = req.headers.host;
  log.info({ forwardedHosts: allowedHosts, requestHost: host }, 'Checking request host against allowed hosts');

  if (allowedHosts.some(allowedHost => host.includes(allowedHost))) {
    next();
  } else {
    res.status(403).send('Forbidden');
  }
}

let intervalId;
let server;

async function start() {
  log.debug(`starting router`);

  // Load the path mappings
  await loadPathMappings();

  // Load the flat directory names into memory and keep them refreshed
  await updateDirCache();
  log.debug(`router dir cache updated`);
  intervalId = setInterval(updateDirCache, 2000);

  // Start proxy server on port
  let app = express();
  app.use('/spaship-proxy/api/v1',isInternalRequest,apiRoutes);
  app.use(pathProxy);
  server = app.listen(config.get("port"));
}

/**
 * Stop the running server.
 * @async
 */
function stop() {
  clearInterval(intervalId);
  log.debug(`stopping router`);
  return new Promise((resolve) => {
    server.close(() => {
      log.debug(`stopped router`);
      resolve();
    });
  });
}



module.exports = { start, stop};

// if this module is the entry-point, go ahead and launch the router
if (require.main === module) {
  start();
}