const path = require("path");
const nconf = require("nconf");

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
    lowerCase: true,
    parseValues: true,
    transform: obj => {
      // remove the "SPANDX_" prefix from environment variables
      obj.key = obj.key.replace(/^spandx_/, "");
      return obj;
    }
  })
  .defaults({
    config_file: path.resolve(__dirname, "config.json"),
    port: 8008,
    host: "localhost",
    webroot: "/var/www",
    upload_dir: "/tmp/spandx_uploads"
  });

// Get the config file location before continuing.
const CONFIG_FILE = nconf.get("config_file");

// Now load settings from the config file.
nconf.file({
  file: CONFIG_FILE,
  transform: obj => {
    // use underscore as delimeter
    obj.key = obj.key.replace(/-/g, "_");
    return obj;
  }
});

module.exports = nconf;
