const { Command, flags } = require("@oclif/command");
const inquirer = require("inquirer");
const { config } = require("../common/config/index");
const { assign, last, omit } = require("lodash");
const hasOptions = last(process.argv) !== "init";
class InitCommand extends Command {
  async run() {
    let existingConfig;

    try {
      await config.read("spaship.yaml");
      existingConfig = true;
    } catch (e) {
      existingConfig = false;
    }

    // process user's command
    const cmd = this.parse(InitCommand);

    // if no cli options were set, go into interactive questionaire mode
    let responses = {};
    if (!hasOptions) {
      // show questions if there is no existing config, or if overwrite was approved.
      const showQuestions = (r) => !existingConfig || (existingConfig && r.overwrite);
      const questions = [
        {
          name: "name",
          message: "Name",
          type: "input",
          when: showQuestions,
        },
        {
          name: "path",
          message: "Path",
          type: "input",
          when: showQuestions,
        },
        {
          name: "single",
          message: "Single page?",
          type: "confirm",
          when: showQuestions,
        },
      ];
      // if a config file already exists, pre-empt the other questions with one
      // about whether to overwrite or not
      if (existingConfig) {
        questions.unshift({
          name: "overwrite",
          message: "A spaship.yaml file already exists, overwrite it?",
          type: "confirm",
        });
      }

      responses = await inquirer.prompt(questions);
    }

    // smush cli options, questionnaire answers, and anything extra into a data
    // object to pass into the template
    const data = assign({}, responses, cmd.flags);
    try {
      if (!data?.name || data?.name?.trim().length == 0) {
        throw new Error("Please provide name");
      } else if (!data?.path || data?.path?.trim().length == 0) {
        throw new Error("Please provide path");
      }
    }
    catch (error) {
      this.error(error.message);
    }

    try {
      if (!existingConfig || data.overwrite) {
        await config.write("spaship.yaml", omit(data, "overwrite"));
        this.log("Generated spaship.yaml");
      }
      else {
        this.warn("Cannot overwrite the spaship.yaml. Please use the --overwrite flag with the command");
      }
    } catch (error) {
      if (error.code === "EEXIST") {
        let msg = `Docking aborted.  A file named spaship.yaml already exists.`;
        if (hasOptions) {
          msg += `  If you wish to overwrite, add --overwrite`;
        }
        this.log(msg);
      }
      else this.error(error.message);
    }
  }
}


InitCommand.description = `initialize a SPAship config file for your app.
Without arguments, init will ask you a few questions and generate a spaship.yaml config file.  The answers can also be passed in as CLI options.
`;

InitCommand.flags = {
  name: flags.string({
    char: "n",
    description: "a human-friendly title for your app",
    required: false, // not required for interactive mode
  }),
  path: flags.string({
    char: "p",
    description: "the URL path for your app under the SPAship domain. ex: /my/app",
    required: false, // not required for interactive mode
  }),
  single: flags.boolean({
    char: "s",
    description: "route all non-asset requests to index.html",
    allowNo: true, // support --no-single
  }),
  overwrite: flags.boolean({
    description: "overwrite existing spaship.yaml",
  }),
  dist: flags.string({
    char: "d",
    description: "the URL path for dist folder",
  }),
  file: flags.string({
    char: "m",
    description: "the URL path for spaship.yaml file",
  }),
  builddir: flags.string({
    char: "b",
    required: false,
    description: "path of your SPAs artifact. Defaults to 'buildDir' if specified in the spaship.yaml.",
  }),
  buildDir: flags.string({
    char: "b",
    required: false,
    description: "path of your SPAs artifact. Defaults to 'buildDir' if specified in the spaship.yaml.",
  }),
};

module.exports = InitCommand;
