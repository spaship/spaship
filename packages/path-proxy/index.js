const express = require('express');
const proxy = require('http-proxy-middleware');
const fsp = require('fs').promises;
const { flatpath } = require('@spaship/common');

let flatDirectories = [];

async function getDirectoryNames() {
    // Load directory names into memory
    //TODO: put the replace this hardcoded path with config
    flatDirectories = await fsp.readdir('/var/www/spaship');

    // Sort them by name length from longest to shortest, for most specific match wins matching policy
    flatDirectories.sort((a, b) => b.length - a.length);
}

const customRouter = function(req) {
    let url = req.url;
    let routeUrl;
    let match;
    let spaPath;
    let matchedFlatDir;

    console.log('[router] incoming url:', url);

    // See if this URL is hosted by SPAship
    for (let flatDir of flatDirectories) {
        spaPath = flatpath.toUrl(flatDir);
        let regEx = new RegExp('^/' + spaPath + '([/\\?].*)?$');
        match = url.match(regEx);
        if (match) {
            matchedFlatDir = flatDir;
            break;  // found a match
        }
    }

    if (match) {
        console.log('[router] This path is hosted by spaship: ', url, ' spaPath: ', spaPath, 'flatDir: ', matchedFlatDir);
    }
    else {
        console.log('[router] This path is not hosted by spaship: ', url);
        return 'https://access.redhat.com';
    }


    let extraStuff = "";
    if (match[1]) {
        extraStuff = match[1]; // $1 of the RegExp
    }
    routeUrl = '/' + matchedFlatDir + extraStuff;

    // Now proxy to flattened url path
    req.url = routeUrl;
    req.headers['x-spaship-flat-path'] = matchedFlatDir;
    req.headers['x-spaship-url-path'] = spaPath;
    let routHost = 'http://localhost:8080';

    console.log("[router] Routing to: ", routHost + req.url);

    return routHost;
};

// proxy middleware options
let options = {
    target: 'http://localhost:8080', // target host
    changeOrigin: true,
    router: customRouter,
    logLevel: 'info',
    autoRewrite: true,
    onProxyRes: (proxyRes, req) => {
        if (proxyRes.statusCode >= 301 && proxyRes.statusCode <= 308 && proxyRes.headers['location']) {
            // When the origin responds with a redirect it's location contains the flat path.
            // This needs to be converted back to the url path. The original conversion is stored
            // in the request headers to quickly restore just the spa portion of the path back to original

            let location = proxyRes.headers['location'];
            let flatPath = req.headers['x-spaship-flat-path'];
            let urpPath = req.headers['x-spaship-url-path'];

            if (flatPath && urpPath) {
                location = location.replace(flatPath, urpPath);
            }

            proxyRes.headers['location'] = location;
        }
    }
};

// create the proxy
let pathProxy = proxy(options);

async function start() {
    // Load the flat directory names into memory and keep them refreshed
    await getDirectoryNames();
    setInterval(await getDirectoryNames, 750);

    // Start proxy server on port
    let app = express();
    app.use('/', pathProxy);
    app.listen(3000);
}

start();


