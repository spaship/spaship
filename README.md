# SPAship &middot; [![Build Status](https://travis-ci.com/spaship/spaship.svg?branch=master)](https://travis-ci.com/spaship/spaship) [![codecov](https://codecov.io/gh/spaship/spaship/branch/master/graph/badge.svg)](https://codecov.io/gh/spaship/spaship)

SPAship is an early-stages Single-Page App deployment and hosting platform.

## Getting started

To install SPAship's command-line interface: `npm install @spaship/cli` adding `-g` installs the package globally.
To initialize a project: `spaship init` this will create a `spaship.yml` file based on your answers to the prompts.
To deploy: create an archive by zipping the contents of a directory (let's call our file "Archive.zip" and target environment dev), then `spaship deploy Archive.zip --env=dev`

## Packages

SPAship consists of a few packages, found inside the `packages` directory.

- **CLI** - the `spaship` command-line interface
- **Router** - a service for dynamically proxying requests to SPAs, or to remote systems
- **Manager** - a web UI for managing SPAs
- **API** - an API for deploying SPAs
- **Common** - common utility functions for reading/writing config files, etc

## Testing

SPAship packages can be tested in one command by running `npm test` at the root of the repository.

You can also test individual packages by moving into their directory and running `npm test`. For example:

```
cd packages/common
npm test
```

Each package may have extra testing options. Please see package READMEs for more about testing them, such as how to run a test watcher.

## Contributing

Contributing is awesome! :sunglasses: This section is very much in progress, but here are a handful of established contribution guidelines.

### Commit message style

We use [Conventional Commits][conventional]. It's a simple, standardized way to prefix commit messages. The major benefits are that CHANGELOGs can be updated automatically, and version bumps can also be automated. Please visit [conventionalcommits.org][conventional] and read up on how to use it. It's painless, I promise!

Also, if you're working in a development branch, please don't worry about proper commit message format. Stick to the "commit early & often" mantra. The only requirement is that when your pull request is merged, choose "Squash & Merge" and write a proper conventional-commit message. Here's a short screencap of how to do that.

![squash and merge screencap][squashgif]

### Release process

There are two commands to create and publish a new release.

1.  `GH_TOKEN="YOUR_TOKEN" npm run autorelease`
2.  `npm run autopublish`

_Note_: "YOUR_TOKEN" is a placeholder; please replace it with a GitHub [personal access token][token]. When creating a personal access token, the only option that needs to be checked is "public_repo". Also, your GitHub user must have write access to this repository.

Here is more detail about what `autorelease` and `autopublish` do.

#### `autorelease`

`npm run autorelease` does a few things.

- Automatically bump the version number of any packages which have changed since the last tag. The type of version bump (major, minor, patch) is chosen automatically based on the types of changes found in the conventional commit log. For instance, a `BREAKING CHANGE` will result in a major version bump, while `feat` will result in a minor bump.
- Update each package's CHANGELOG.md files, and aggregate those updates into the monorepo's root CHANGELOG.md
- Create a git tag for the new version
- Create a "release" object in github

`autorelease` is a wrapper around [`lerna version`][lernaversion].

#### `autopublish`

`autopublish` will publish to NPM any packages that were updated by `autorelease`. This command is meant to be run after `autorelease`.

#### Recovering from autorelease with bad GH_TOKEN

If something goes wrong when you run `autorelease`, such as an invalid or forgotten `GH_TOKEN`, that's okay. Versions will still be bumped, git tags will still be created and pushed. The only thing missing is the GitHub Release description. To remedy that, go to [spaship/releases][releases]. You should see a release listed for the new version number, but it will be lacking a description. Click on it, then click Edit Release. Paste the relevant lines from [CHANGELOG.md][changelog] into the description. That's it!

[conventional]: https://www.conventionalcommits.org/en/v1.0.0/
[squashgif]: https://imgur.com/download/HDd06gq/
[token]: https://github.com/settings/tokens/new
[lernaversion]: https://github.com/lerna/lerna/tree/master/commands/version#readme
[releases]: https://github.com/spaship/spaship/releases
[changelog]: ./CHANGELOG.md
