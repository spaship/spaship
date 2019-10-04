const {Command, flags} = require('@oclif/command')

class InitCommand extends Command {
  static get flags() {
    return {
      name: flags.string({char: 'n', description: 'the name of your app', default: 'asdf'}),
      path: flags.string({char: 'p', description: 'the URL path'}),
      single: flags.boolean({char: 's', description: 'route all non-asset requests to index.html'}),
    }
  }

  static get description() {
    return `Initialize a SPAship config file for your app.
Without arguments, init will ask you a few questions and generate a spaship.yaml config file.  The answers can also be passed in as CLI options.
`
  }

  async run() {
    const r = this.parse(InitCommand)
    this.log(`hello ${r.flags.name} from /home/mclayton/projects/@spaship/cli/src/commands/init.js`)
  }
}

module.exports = InitCommand
