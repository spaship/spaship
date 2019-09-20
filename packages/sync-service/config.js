const path = require("path");
const nconf = require("nconf");
const { mapValues, flow, keyBy, identity } = require("lodash/fp");

// make a relative filepath absolute, relative to CWD
function rel2abs(p) {
  return path.resolve(process.cwd(), p);
}

const validOptions = ["config_file", "upload_dir", "webroot", "host", "port"];
const filepathOptions = ["config_file", "upload_dir", "webroot"]; // config options that represent filepaths

// Read CLI flags first, then environment variables (argv).
nconf
  .argv({
    parseValues: true,
    transform: obj => {
      // use underscore as delimeter
      obj.key = obj.key.replace(/-/g, "_");

      // for argv, allow relative paths for filepath configs, but convert them
      // to absolute.  interpret them relative to CWD.
      if (filepathOptions.includes(obj.key)) {
        obj.value = rel2abs(obj.value);
      }

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
