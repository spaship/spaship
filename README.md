# SPAship

SPAship is an early-stages Single-Page App deployment and hosting platform.

## Contributing

Contributing is awesome! :sunglasses: This section is very much in progress, but here are a handful of established contribution guidelines.

### Commit message style

We use [Conventional Commits][conventional]. It's a simple, standardized way to prefix commit messages. The major benefits are that CHANGELOGs can be updated automatically, and version bumps can also be automated. Please visit [conventionalcommits.org][conventional] and read up on how to use it. It's painless, I promise!

Also, if you're working in a development branch, please don't worry about proper commit message format. Stick to the "commit early & often" mantra. The only requirement is that when your pull request is merged, choose "Squash & Merge" and write a proper conventional-commit message. Here's a short screencap of how to do that.

![squash and merge screencap][squashgif]

### Release process

There are two commands to create a new release.

1.  `GH_TOKEN="YOUR_TOKEN" npm run autorelease` - this command will:

- automatically bump versions of any packages which have changed since the last tag
- update each package's CHANGELOG and the monorepo root CHANGELOG
- create a "release" object in github
- _Note_: "YOUR_TOKEN" is a placeholder; to successfully create the github release, create a [personal access token][token] with "public_repo" checked, and paste it over "YOUR_TOKEN"

2.  `npm run autopublish` - this command will publish the changes to NPM

[conventional]: https://www.conventionalcommits.org/en/v1.0.0/
[squashgif]: https://imgur.com/download/HDd06gq/
[token]: https://github.com/settings/tokens/new
