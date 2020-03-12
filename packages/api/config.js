const path = require("path");
const nconf = require("nconf");
const { uniq } = require("lodash");
const { mapValues, flow, keyBy, identity } = require("lodash/fp");

// make a relative filepath absolute, relative to CWD
function rel2abs(p) {
  return path.resolve(process.cwd(), p);
}

let validOptions = [
  // filesystem related
  "config_file",
  "upload_dir",
  "webroot",

  // network service options
  "host",
  "port",

  // autosync stands alone
  "autosync",

  // database
  "db:mongo:user",
  "db:mongo:password",
  "db:mongo:url",
  "db:mongo:db_name",
  "db:mongo:mock"
];
const filepathOptions = ["config_file", "upload_dir", "webroot"]; // config options that represent filepaths

// expand validOptions to include the nesting separator for environment variables (they use __ instead of :, since : is
// an invalid character in env var names).
validOptions = uniq(validOptions.concat(validOptions.map(p => p.replace(/:/g, "__"))));

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
    separator: "__",
    whitelist: validOptions,
    lowerCase: true,
    parseValues: true,
    transform: obj => {
      // remove the "SPASHIP_" prefix from environment variables
      obj.key = obj.key.replace(/^spaship_/, "").replace(/^api_/, "");
      return obj;
    }
  });

// Get the config file location before continuing.
const configFile = nconf.get("config_file");

// Now load settings from the config file.
if (configFile) {
  nconf.file({
    file: configFile
  });
}

nconf.defaults({
  port: 8008,
  host: "localhost",
  webroot: "/var/www",
  upload_dir: "/tmp/spaship_uploads",
  db: {
    mongo: {
      url: "localhost:27017",
      db_name: "spaship",
      mock: process.env.NODE_ENV !== "production" // use a mock database by default in dev environments
    }
  }
});

module.exports = nconf;

module.exports.toString = () => {
  const out = flow(
    keyBy(identity),
    mapValues(opt => nconf.get(opt))
  )(validOptions);
  return JSON.stringify(out, null, 2);
};

module.exports.toObject = () => {
  return flow(
    keyBy(identity),
    mapValues(opt => nconf.get(opt))
  )(validOptions);
};
