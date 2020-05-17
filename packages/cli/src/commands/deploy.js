const URL = require("url").URL;
const { Command, flags } = require("@oclif/command");
const common = require("@spaship/common");
const { assign, get } = require("lodash");
const commonFlags = require("../common/flags");
const { loadRcFile } = require("../common/spashiprc-loader");
const FormData = require("form-data");
const { request } = require("https");
const { createReadStream } = require("fs");

function isURL(s) {
  try {
    new URL(s);
    return true;
  } catch (err) {
    return false;
  }
}

// regex to test whether an environment name is valid
const validEnvName = /^[A-Za-z_]+[A-Za-z_0-9]+$/;

class DeployCommand extends Command {
  async run() {
    const { args, flags } = this.parse(DeployCommand);

    const config = loadRcFile();
    const yamlConfig = await common.config.read("spaship.yaml");
    // We need send `name` and `path` to API
    // so read them from spaship.yaml or other config file
    // it could be store in package.json
    const name = yamlConfig ? yamlConfig.name : config.name;
    const path = yamlConfig ? yamlConfig.path : config.path;

    if (!name) {
      this.error("Please define your app name in your package.json or use init to create spaship.yaml ");
    }
    if (!path) {
      this.error("Please define your app path in your package.json or use init to create spaship.yaml ");
    }

    // if --env is a properly formatted URL, use it as the SPAship host, otherwise treat is as the name of a SPAship
    // environment.
    const envIsURL = isURL(flags.env);
    let host;
    const apiPath = "/api/v1/applications/deploy";

    // if a url was passed in to --env, use it, otherwise treat it as a name and look up that env's url
    if (envIsURL) {
      host = flags.env;
    } else {
      if (!validEnvName.test(flags.env)) {
        this.error(
          `The requested environment, "${flags.env}", is invalid.  Environment names must consist of letters, numbers, and underscores, and must not begin with a number.`
        );
      }
      host = get(config, `envs.${flags.env}.url`);
    }

    if (!host) {
      this.error(`The requested environment, "${flags.env}", is not defined in your spashiprc file.`);
    }

    // look for the API key first in the --apikey option, and next in the spashiprc file.
    let apikey;
    let rc_apikey = get(config, `envs.${flags.env}.apikey`);
    if (flags.apikey) {
      apikey = flags.apikey;
    } else if (!envIsURL && rc_apikey) {
      apikey = rc_apikey;
    }

    if (!apikey) {
      this.error(`An API key must be provided, either in your spashiprc file or in a --apikey option.`);
    }

    this.log(`Deploying SPA to ${flags.env}${envIsURL ? "" : ` (${host})`}`);

    try {
      const response = await new Promise((resolve, reject) => {
        const form = new FormData();
        const archiveFileStream = createReadStream(args.archive);
        form.append("name", name);
        form.append("path", path);
        form.append("ref", flags.ref);
        form.append("upload", archiveFileStream);
        const requestOptions = {
          host: new URL(host).host, // Parsing host url to get hostname
          path: apiPath,
          rejectUnauthorized: false,
          method: "POST",
          headers: {
            ...form.getHeaders(),
            "X-API-Key": apikey.toString(),
          },
        };
        const req = request(requestOptions, (res) => {
          let data = "";
          res.on("data", (chunk) => {
            data += chunk;
          });
          res.on("end", () => {
            resolve(data);
          });
        });
        req.on("error", (error) => {
          reject(error);
        });
        form.pipe(req);
      });
      this.log(response);
    } catch (e) {
      this.error(e);
    }
  }
}

DeployCommand.description = `deploy to a SPAship host
Send an archive containing a SPA to a SPAship host for deployment.  Supports .tar.gz/.tgz, .zip, and .tar.bz2.
`;

DeployCommand.args = [
  {
    name: "archive",
    required: true,
    description: "SPA archive file",
  },
];

DeployCommand.flags = assign(
  {
    ref: flags.string({
      char: "r",
      description: "a version tag, commit hash, or branch to identify this release",
      required: false,
      default: "undefined",
    }),
  },
  commonFlags.apikey,
  commonFlags.env
);

DeployCommand.examples = [`$ npm pack`, `$ spaship deploy your-app-1.0.0.tgz`];

module.exports = DeployCommand;
