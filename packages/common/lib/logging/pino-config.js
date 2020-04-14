const nconf = require("nconf");

nconf
  .env({
    whitelist: ["log_level", "log_format"],
    lowerCase: true,
    parseValues: true,
    transform: (obj) => {
      // remove the "SPASHIP_" prefix from environment variables
      obj.key = obj.key.replace(/^spaship_/, "");
      return obj;
    },
  })
  .argv({
    parseValues: true,
    transform: (obj) => {
      // use underscore as delimeter
      obj.key = obj.key.replace(/-/g, "_");
      return obj;
    },
  });

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
  log_level: "info",
  log_format: "json", // 'json' or 'pretty'
});

module.exports = nconf;
