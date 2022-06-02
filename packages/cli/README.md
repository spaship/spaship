# SPAship CLI

A command line interface for SPAship.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@spaship/cli.svg)](https://npmjs.org/package/@spaship/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@spaship/cli.svg)](https://npmjs.org/package/@spaship/cli)
[![License](https://img.shields.io/npm/l/@spaship/cli.svg)](https://github.com/spaship/cli/blob/master/package.json)

<!-- toc -->
* [SPAship CLI](#spaship-cli)
* [Usage](#usage)
* [Commands](#commands)
* [spashiprc & SPAship environments](#spashiprc--spaship-environments)
* [Writing tests](#writing-tests)
<!-- tocstop -->

# Usage

<!-- usage -->
```sh-session
$ npm install -g @spaship/cli
$ spaship COMMAND
running command...
$ spaship (-v|--version|version)
@spaship/cli/0.14.0 linux-x64 node-v14.18.3
$ spaship --help [COMMAND]
USAGE
  $ spaship COMMAND
...
```
<!-- usagestop -->

# Commands

<!-- commands -->
* [`spaship help [COMMAND]`](#spaship-help-command)

## `spaship help [COMMAND]`

Display help for spaship.

```
USAGE
  $ spaship help [COMMAND]

ARGUMENTS
  COMMAND  Command to show help for.

OPTIONS
  -n, --nested-commands  Include all nested commands in the output.
```

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v5.1.10/src/commands/help.ts)_
<!-- commandsstop -->

# spashiprc & SPAship environments

_(As a rule of thumb, spaship.yaml files are consumed by the SPAship API, whereas spashiprc files are consumed by the CLI)_

spashiprc files provide an alternative to typing out `--apikey KEY` and `--env URL` every time you run `spaship` commands. You can use a spashiprc file to define an environment name (like `qa`) along with its URL and API key, after which you can run `spaship deploy --env qa`. The URL and API key will be read from your spashiprc file.

**Do not commit API keys to your project's version control**. If you do, _I'll know_. See [spashiprc layering](#spashiprc-layering) for how to avoid committing API keys.

spashiprc files are optional, but very convenient if you plan to do deployments from your dev environment. If your deployments are done by a CI/CD server, you probably don't need a spashiprc file and will be better off using `--env URL` and `--apikey KEY`.

## spashiprc layering

To separate environment URLs from API keys, you can "layer" two spashiprc files together. After the `spaship` command finds a spashiprc file, it continues searching parent directories for other spashiprc files. If any secondary spashiprc files are found, their values are merged together. If there are conflicting values, the values from the child directory (nearer to your project) will win.

This allows you to put a spashiprc file containing your SPAship URLs in your project's source control, and a secondary spashiprc file containing API keys in a parent directory, _not_ in your project's source control.

For an example, see [spashiprc-layering-example](#spashiprc-layering-example).

## spashiprc examples

### spashiprc with default environment

This spashiprc file defines a `default` environment which will be used whenever `--env` is not provided.

**.spashiprc.yml**

```yaml
envs:
  default:
    url: https://localhost:8008
    apikey: 57d5c061-9a02-40fc-a3e4-1eb3c9ae6a12
```

Now when you run `spaship` commands, the `--env` flag is optional. When it's omitted, the default environment will be used.

```sh
spaship deploy MyProject-1.0.0.tgz
```

### spashiprc layering example

**\$HOME/.spashiprc.yml**

```yaml
envs:
  qa:
    apikey: 57d5c061-9a02-40fc-a3e4-1eb3c9ae6a12
  prod:
    apikey: 70f19422-bf53-44b1-b664-f9b4636bea61
```

**\$HOME/projects/MyProject/.spashiprc.yml**

```yaml
envs:
  qa:
    url: https://qa.spaship.io
  prod:
    url: https://spaship.io
```

When you run `spaship` commands from within `$HOME/projects/MyProject`, _both_ of the above spashiprc files will be loaded and merged together, forming a complete definition of URL+API key for each environment.

Such as:

```sh
cd $HOME/projects/MyProject
spaship deploy --env prod MyProject-1.0.0.tgz
```

# Writing tests

Tests are written using oclif's testing tools. See [oclif's testing documentation](https://oclif.io/docs/testing) for more.
