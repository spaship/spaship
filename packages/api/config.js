const path = require("path");
const nconf = require("nconf");
const { uniq } = require("lodash");
const { mapValues, flow, keyBy, identity } = require("lodash/fp");

// make a relative filepath absolute, relative to CWD
function rel2abs(p) {
  return path.resolve(process.cwd(), p);
}

const generateSseBasePath = (sse) => {
  return `${sse.protocol + sse.domain + sse.path + sse.id}`;
};

let validOptions = [
  // filesystem related
  "config_file",
  "upload_dir",
  "webroot",
  "baseurl",

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
  "db:mongo:mock",

  // authentication
  "auth:keycloak:url",
  "auth:keycloak:realm",
  "auth:keycloak:pubkey",
  "auth:keycloak:pubkey_file",
  "auth:keycloak:clientid",
  "auth:keycloak:id_prop",

  //  authorization
  "auth:ldap:admin_group",
  "auth:ldap:user_group",

  //  server side envents credentials
  "sse:base_path",
  "sse:protocol",
  "sse:domain",
  "sse:path",
  "sse:id",

  //  cli credentials
  "cli:base_path",
  "cli:dir_path",
  "cli:eph_ttl"
];
const filepathOptions = ["config_file", "upload_dir", "webroot"]; // config options that represent filepaths

// expand validOptions to include the nesting separator for environment variables (they use __ instead of :, since : is
// an invalid character in env var names).
validOptions = uniq(validOptions.concat(validOptions.map((p) => p.replace(/:/g, "__"))));

// Read CLI flags first, then environment variables (argv).
nconf
  .argv({
    parseValues: true,
    transform: (obj) => {
      // use underscore as delimeter
      obj.key = obj.key.replace(/-/g, "_");

      // for argv, allow relative paths for filepath configs, but convert them
      // to absolute.  interpret them relative to CWD.
      if (filepathOptions.includes(obj.key)) {
        obj.value = rel2abs(obj.value);
      }

      return obj;
    },
  })
  .env({
    separator: "__",
    whitelist: validOptions,
    lowerCase: true,
    parseValues: true,
    transform: (obj) => {
      // remove the "SPASHIP_" prefix from environment variables
      obj.key = obj.key.replace(/^spaship_/, "").replace(/^api_/, "");
      return obj;
    },
  });

// Get the config file location before continuing.
const configFile = nconf.get("config_file");

// Now load settings from the config file.
if (configFile) {
  nconf.file({
    file: configFile,
  });
}

const sse = {
  protocol: "http://",
  domain: "localhost:4000",
  path: "/sse/",
  id: "80",
};

nconf.defaults({
  port: 2345,
  host: "localhost",
  webroot: "/var/www",
  upload_dir: "/tmp/spaship_uploads",
  token: {
    secret: process.env.TOKEN_SECRET || "spaship",
    expiration: process.env.TOKEN_EXPIRATION || "10h",
  },
  baseurl: `${process.env.ORCHESTRATOR_BASEPATH}/spas`,
  sse: {
    base_path: `${process.env.OPERATOR_BASEPATH}/api/event`,
  },
  directoryBasePath: "root",
  db: {
    mongo: {
      url: process.env.SPASHIP_DB__MONGO__URL || "localhost:27017/spaship",
      db_name: process.env.SPASHIP_DB__MONGO__DB_NAME || "spaship",
      user: process.env.SPASHIP_DB__MONGO__USER || "",
      password: process.env.SPASHIP_DB__MONGO__PASSWORD || "",
      mock: process.env.NODE_ENV !== "production", // use a mock database by default in dev environments
    },
  },
  auth: {
    keycloak: {
      jwt_uuid_prop: "sub",
    },
  },
  cli: {
    base_path: `${process.env.OPERATOR_BASEPATH}/api/upload`,
    dir_path: "uploads",
    eph_ttl: process.env.SPASHIP_EPH__TTL || 120,
  },
});

module.exports = nconf;

module.exports.toString = () => {
  const out = flow(
    keyBy(identity),
    mapValues((opt) => nconf.get(opt))
  )(validOptions);
  return JSON.stringify(out, null, 2);
};

module.exports.toObject = () => {
  return flow(
    keyBy(identity),
    mapValues((opt) => nconf.get(opt))
  )(validOptions);
};
