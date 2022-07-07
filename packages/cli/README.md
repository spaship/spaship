# SPAship CLI

A command line interface for SPAship.

[![oclif](https://img.shields.io/badge/cli-oclif-brightgreen.svg)](https://oclif.io)
[![Version](https://img.shields.io/npm/v/@spaship/cli.svg)](https://npmjs.org/package/@spaship/cli)
[![Downloads/week](https://img.shields.io/npm/dw/@spaship/cli.svg)](https://npmjs.org/package/@spaship/cli)
[![License](https://img.shields.io/npm/l/@spaship/cli.svg)](https://github.com/spaship/cli/blob/master/package.json)

<!-- toc -->

- [SPAship CLI](#spaship-cli)
- [Usage](#usage)
- [Commands](#commands)
- [spashiprc & SPAship environments](#spashiprc--spaship-environments)
- [Writing tests](#writing-tests)
<!-- tocstop -->

# Usage

<!-- usage -->

```sh-session
$ npm install -g @spaship/cli
$ spaship COMMAND
running command...
$ spaship (-v|--version|version)
@spaship/cli/0.13.2 linux-x64 node-v12.18.3
$ spaship --help [COMMAND]
USAGE
  $ spaship COMMAND
...
```

<!-- usagestop -->

# Commands

<!-- commands -->

- [`spaship deploy [ARCHIVE]`](#spaship-deploy-archive)
- [`spaship help [COMMAND]`](#spaship-help-command)
- [`spaship init`](#spaship-init)

## `spaship deploy [ARCHIVE]`

deploy to a SPAship host

```
USAGE
  $ spaship deploy [ARCHIVE]

ARGUMENTS
  ARCHIVE  An archive (zip, tarball, or bzip2) file containing SPA static assets and a spaship.yaml file. You can omit
           this if you specify the build artifact path as `buildDir` in the spaship.yaml file.

OPTIONS
  -b, --builddir=builddir  path of your SPAs artifact. Defaults to 'buildDir' if specified in the spaship.yaml.
  -e, --env=env    [default: default] either the name of a SPAship environment as defined in your .spashiprc.yml file,
                   or a URL to a SPAship environment

  -p, --path=path  a custom URL path for your app under the SPAship domain. Defaults to the 'path' in your spaship.yaml.
                   ex: /my/app

  -r, --ref=ref    [default: undefined] a version tag, commit hash, or branch to identify this release

  --apikey=apikey  a SPAship API key

DESCRIPTION
  Send an archive containing a SPA to a SPAship host for deployment.  Supports .tar.gz/.tgz, .zip, and .tar.bz2.

EXAMPLES
  $ npm pack && spaship deploy your-app-1.0.0.tgz # deploying an archive created with npm pack
  $ spaship deploy # deploying a buildDir directory
```

_See code: [src/commands/deploy.js](https://github.com/spaship/spaship/blob/v0.13.2/src/commands/deploy.js)_

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

_See code: [@oclif/plugin-help](https://github.com/oclif/plugin-help/blob/v3.2.0/src/commands/help.ts)_

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

_See code: [src/commands/init.js](https://github.com/spaship/spaship/blob/v0.13.2/src/commands/init.js)_

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
