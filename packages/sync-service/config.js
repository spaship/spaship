const path = require("path");
const nconf = require("nconf");
const { mapValues, flow, keyBy, identity } = require("lodash/fp");

const validOptions = ["config_file", "upload_dir", "webroot", "host", "port"];

// Read CLI flags first, then environment variables (argv).
nconf
  .argv({
    parseValues: true,
    transform: obj => {
      // use underscore as delimeter
      obj.key = obj.key.replace(/-/g, "_");
      return obj;
    }
  })
  .env({
    whitelist: validOptions,
    lowerCase: true,
    parseValues: true,
    transform: obj => {
      // remove the "SPANDX_" prefix from environment variables
      obj.key = obj.key.replace(/^spandx_/, "");
      return obj;
    }
  });

// Get the config file location before continuing.
const configFile = nconf.get("config_file");

// Now load settings from the config file.
if (configFile) {
  nconf.file({
    file: configFile,
    transform: obj => {
      // use underscore as delimeter
      obj.key = obj.key.replace(/-/g, "_");
      return obj;
    }
  });
}

nconf.defaults({
  port: 8008,
  host: "localhost",
  webroot: "/var/www",
  upload_dir: "/tmp/spandx_uploads"
});

module.exports = nconf;
module.exports.toString = () => {
  const out = flow(
    keyBy(identity),
    mapValues(opt => nconf.get(opt))
  )(validOptions);
  return JSON.stringify(out, null, 2);
};
