# @spaship/cli

A command line interface for SPAship.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@spaship/cli.svg)](https://npmjs.org/package/@spaship/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@spaship/cli.svg)](https://npmjs.org/package/@spaship/cli)
[![License](https://img.shields.io/npm/l/@spaship/cli.svg)](https://github.com/spaship/cli/blob/master/package.json)

<!-- toc -->

- [@spaship/cli](#spashipcli)
- [Usage](#usage)
- [Commands](#commands)
  <!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @spaship/cli
$ spaship COMMAND
running command...
$ spaship (-v|--version|version)
@spaship/cli/0.0.11 linux-x64 node-v11.14.0
$ spaship --help [COMMAND]
USAGE
  $ spaship COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`spaship deploy`](#spaship-deploy)
- [`spaship help [COMMAND]`](#spaship-help-command)
- [`spaship init`](#spaship-init)

## `spaship deploy`

Describe the command here

```
USAGE
  $ spaship deploy

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/deploy.js](https://github.com/spaship/cli/blob/v0.0.11/src/commands/deploy.js)_

## `spaship help [COMMAND]`

display help for spaship

```
USAGE
  $ spaship help [COMMAND]

ARGUMENTS
  COMMAND  command to show help for

OPTIONS
  --all  see all commands in CLI
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v2.2.1/src/commands/help.ts)_

## `spaship init`

Initialize a SPAship config file for your app.

```
USAGE
  $ spaship init

OPTIONS
  -n, --name=name    (required) a human-friendly title for your app
  -p, --path=path    (required) the URL path for your app under the SPAship domain. ex: /my/app
  -s, --[no-]single  route all non-asset requests to index.html
  --overwrite        overwrite existing spaship.yaml

DESCRIPTION
  Without arguments, init will ask you a few questions and generate a spaship.yaml config file.  The answers can also be
  passed in as CLI options.
```

_See code: [src/commands/init.js](https://github.com/spaship/cli/blob/v0.0.11/src/commands/init.js)_

<!-- commandsstop -->
