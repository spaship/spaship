const { Command, flags } = require("@oclif/command");
const path = require("path");
const inquirer = require("inquirer");
const fsp = require("fs").promises;
const { config } = require("@spaship/common");
const { assign, last, omit } = require("lodash");

// were any command line flags (options) passed in
const hasOptions = last(process.argv) !== "init";

class InitCommand extends Command {
  async run() {
    // if spaship.yaml already exists, warn and abort
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
      if (!existingConfig || data.overwrite) {
        await config.write("spaship.yaml", omit(data, "overwrite"));
      }

      this.log("Generated spaship.yaml");
    } catch (error) {
      if (error.code === "EEXIST") {
        let msg = `Docking aborted.  A file named spaship.yaml already exists.`;
        if (hasOptions) {
          msg += `  If you wish to overwrite, add --overwrite`;
        }
        this.log(msg);
      }
    }
  }
}

InitCommand.description = `Initialize a SPAship config file for your app.
Without arguments, init will ask you a few questions and generate a spaship.yaml config file.  The answers can also be passed in as CLI options.
`;

InitCommand.flags = {
  name: flags.string({
    char: "n",
    description: "a human-friendly title for your app",
    required: hasOptions, // not required for interactive mode
  }),
  path: flags.string({
    char: "p",
    description: "the URL path for your app under the SPAship domain. ex: /my/app",
    required: hasOptions, // not required for interactive mode
  }),
  single: flags.boolean({
    char: "s",
    description: "route all non-asset requests to index.html",
    allowNo: true, // support --no-single
  }),
  overwrite: flags.boolean({
    description: "overwrite existing spaship.yaml",
  }),
};

module.exports = InitCommand;
