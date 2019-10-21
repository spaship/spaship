# SPAship

SPAship is an early-stages Single-Page App deployment and hosting platform.

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

[conventional]: https://www.conventionalcommits.org/en/v1.0.0/
[squashgif]: https://imgur.com/download/HDd06gq/
[token]: https://github.com/settings/tokens/new
[lernaversion]: https://github.com/lerna/lerna/tree/master/commands/version#readme
