@spaship/cli
============

A command line interface for SPAship.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@spaship/cli.svg)](https://npmjs.org/package/@spaship/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@spaship/cli.svg)](https://npmjs.org/package/@spaship/cli)
[![License](https://img.shields.io/npm/l/@spaship/cli.svg)](https://github.com/spaship/cli/blob/master/package.json)

<!-- toc -->
* [Usage](#usage)
* [Commands](#commands)
<!-- tocstop -->
# Usage
<!-- usage -->
```sh-session
$ npm install -g @spaship/cli
$ spaship COMMAND
running command...
$ spaship (-v|--version|version)
@spaship/cli/0.0.0 linux-x64 node-v11.14.0
$ spaship --help [COMMAND]
USAGE
  $ spaship COMMAND
...
```
<!-- usagestop -->
# Commands
<!-- commands -->
* [`spaship hello`](#spaship-hello)
* [`spaship help [COMMAND]`](#spaship-help-command)
* [`spaship init`](#spaship-init)
* [`spaship validate`](#spaship-validate)

## `spaship hello`

Describe the command here

```
USAGE
  $ spaship hello

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  Extra documentation goes here
```

_See code: [src/commands/hello.js](https://github.com/spaship/cli/blob/v0.0.0/src/commands/hello.js)_

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
  -n, --name=name  name to print

DESCRIPTION
  This command will ask you a few questions and generate a spaship.yaml config file for you.
```

_See code: [src/commands/init.js](https://github.com/spaship/cli/blob/v0.0.0/src/commands/init.js)_

## `spaship validate`

Describe the command here

```
USAGE
  $ spaship validate

OPTIONS
  -n, --name=name  name to print

DESCRIPTION
  ...
  Extra documentation goes here
```

_See code: [src/commands/validate.js](https://github.com/spaship/cli/blob/v0.0.0/src/commands/validate.js)_
<!-- commandsstop -->
