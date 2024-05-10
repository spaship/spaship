const nconf = require("nconf");
const { log } = require("@spaship/common/lib/logging/pino");

const whitelist = ["config_file", "port", "webroot", "target", "fallback", "forwarded_host", "allowed_hosts"];

nconf
  .env({
    whitelist,
    lowerCase: true,
    parseValues: true,
    transform: (obj) => {
      // remove the "SPASHIP_" prefix from environment variables
      obj.key = obj.key.replace(/^spaship_/, "").replace(/^router_/, "");
      return obj;
    },
  })
  .argv();

const configFile = nconf.get("config_file");

// Now load settings from the config file.
if (configFile) {
  nconf.file({
    file: configFile,
    transform: (obj) => {
      // use underscore as delimeter
      obj.key = obj.key.replace(/-/g, "_");
      return obj;
    },
  });
}

nconf.defaults({
    port: 8765,
    webroot: "/var/www/html",
    target: "http://localhost:8080",
    log_level: "info",
    forwarded_host: "",
    allowed_hosts: "localhost,127.0.0.1"
});

module.exports = nconf;
