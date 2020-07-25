const URL = require("url").URL;
const { Command, flags } = require("@oclif/command");
const common = require("@spaship/common");
const execa = require("execa");
const { assign, get } = require("lodash");
const commonFlags = require("../common/flags");
const { loadRcFile } = require("../common/spashiprc-loader");
const { zipDirectory } = require("../common/zip");
const nodePath = require("path");

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
    const buildDir = yamlConfig ? yamlConfig.buildDir : config.buildDir;

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
    if (!args.archive && buildDir) {
      // No archive path specified in the commandline as argument and buildDir is specified in the spaship.yaml
      const buildDirPath = nodePath.join(process.cwd(), buildDir);
      const rawSpashipYml = await common.config.readRaw("spaship.yaml");
      this.log("Creating a zip archive...");
      try {
        args.archive = await zipDirectory(buildDirPath, rawSpashipYml);
        this.log("Done creating the archive...");
      } catch (e) {
        this.error(e);
      }
    } else {
      // No buildDir is specified in the spaship.yaml
      this.error(
        "You should specify the build artifact path as `buildDir` in the spaship.yaml to run `spaship deploy` without the archive path."
      );
    }
    this.log(`Deploying SPA to ${flags.env}${envIsURL ? "" : ` (${host})`}`);

    try {
      const cmd = `curl ${host}${apiPath} -H 'X-API-Key: ${apikey}' -F name=${name} -F path=${path} -F upload=@${args.archive} -F ref=${flags.ref}`;
      const { stdout } = await execa.command(cmd, { shell: true });
      this.log(stdout);
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
    required: false,
    default: null,
    description:
      "SPA archive file. You can omit this if you specify the build artifact path as `buildDir` in the spaship.yaml file.",
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

DeployCommand.examples = [
  `$ npm pack && spaship deploy your-app-1.0.0.tgz # deploying an archive created with npm pack`,
  `$ spaship deploy # deploying a buildDir directory`,
];

module.exports = DeployCommand;
