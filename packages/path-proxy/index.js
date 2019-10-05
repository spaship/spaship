const express = require('express');
const proxy = require('http-proxy-middleware');

const pathToFlat = function(req) {
    let path = req.url;
    let flatPath;

    // handle root path
    if (path === "/") {
        flatPath = "root"
    }
    else {
        // Convert path to flat path

        // Trim off leading /
        path = path.substr(1);

        // Escape underscores with double underscore
        path = path.replace(/_/g, "__");

        // Convert normal path to flat path by replacing / with _
        flatPath = path.replace(/\//g, "_");
    }

    // Now proxy to flat path
    req.url = '/';
    return 'http://localhost:8008/' + flatPath;
};

// proxy middleware options
let options = {
    target: 'http://localhost:8008', // target host
    changeOrigin: false,
    router: pathToFlat
};

// create the proxy (without context)
let pathProxy = proxy(options);

// Start proxy server on port
let app = express();
app.use('/', pathProxy);
app.listen(3000);