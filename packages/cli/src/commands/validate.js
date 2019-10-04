const {Command, flags} = require('@oclif/command')

class ValidateCommand extends Command {
  async run() {
    const {flags} = this.parse(ValidateCommand)
    const name = flags.name || 'world'
    this.log(`hello ${name} from /home/mclayton/projects/@spaship/cli/src/commands/validate.js`)
  }
}

ValidateCommand.description = `Describe the command here
...
Extra documentation goes here
`

ValidateCommand.flags = {
  name: flags.string({char: 'n', description: 'name to print'}),
}

module.exports = ValidateCommand
