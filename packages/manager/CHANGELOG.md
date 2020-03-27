# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.7.0](https://github.com/spaship/spaship/compare/v0.6.0...v0.7.0) (2020-03-27)

**Note:** Version bump only for package @spaship/manager

# [0.6.0](https://github.com/spaship/spaship/compare/v0.5.0...v0.6.0) (2020-03-26)

### Bug Fixes

- **deps:** pin dependencies ([#226](https://github.com/spaship/spaship/issues/226)) ([0054b53](https://github.com/spaship/spaship/commit/0054b53076f37f445e3f1b3e9b6b1444ee747609))
- **deps:** update dependency @react-keycloak/web to v1.0.5 ([#253](https://github.com/spaship/spaship/issues/253)) ([c59b6b1](https://github.com/spaship/spaship/commit/c59b6b19d06ad550f15952e4f8f9d4b43dcbce2d))
- **manager:** add .htaccess make react browser route work ([#220](https://github.com/spaship/spaship/issues/220)) ([cbfbba9](https://github.com/spaship/spaship/commit/cbfbba956e6d19e2e4eea1160cbc5b18cf0c6aea))
- **manager:** use the default '/' root path to avoid path 404 error ([#221](https://github.com/spaship/spaship/issues/221)) ([3b6d6f4](https://github.com/spaship/spaship/commit/3b6d6f4067c2c79ff3c9cf08256d410bf40769ae))

### Features

- **api:** add jwt and api key validation to the api ([#218](https://github.com/spaship/spaship/issues/218)) ([0d5437f](https://github.com/spaship/spaship/commit/0d5437ff1677d658c6d42f7d06b7d822bd8b7e8d))
- **manager:** add api key page ([#217](https://github.com/spaship/spaship/issues/217)) ([ee04f3c](https://github.com/spaship/spaship/commit/ee04f3cb53bbc7da4c5e119c9ba43611f88dea9b))
- **manager:** add multi api keys support ([#238](https://github.com/spaship/spaship/issues/238)) ([6a29264](https://github.com/spaship/spaship/commit/6a292640855feb1a1396a451aa98518284b4dcbe))

# [0.5.0](https://github.com/spaship/spaship/compare/v0.4.0...v0.5.0) (2020-03-09)

### Features

- add keycloak authentication to SPAship Manager ([#208](https://github.com/spaship/spaship/issues/208)) ([609c499](https://github.com/spaship/spaship/commit/609c49934779bf5942be7fd8d315ea5b374d7b4a))

# [0.4.0](https://github.com/spaship/spaship/compare/v0.3.5...v0.4.0) (2020-03-03)

### Code Refactoring

- rename packages ([#188](https://github.com/spaship/spaship/issues/188)) ([1e739b3](https://github.com/spaship/spaship/commit/1e739b3c08462d95db5af140405683af797b7daa))

### BREAKING CHANGES

- `sync-service` renamed to `api`, `spa-manager` renamed to `manager`, `path-proxy` renamed to `router`

- rename directories

- rename path-proxy within files

- rename sync-service within files

- rename spa-manager within files

- regenerate manager's package-lock

- fix homepage and repository links for renamed packages

- standardize README titles

## [0.3.5](https://github.com/spaship/spa-manager/compare/v0.3.4...v0.3.5) (2019-12-24)

### Bug Fixes

- invalid package.json in spa-manager ([20f8fec](https://github.com/spaship/spa-manager/commit/20f8fec9c969b2f60d63031a11f7f5aa56147573))

## [0.3.4](https://github.com/spaship/spa-manager/compare/v0.3.3...v0.3.4) (2019-10-22)

**Note:** Version bump only for package @spaship/spa-manager

# 0.1.0 (2019-10-18)

### Features

- **file:** add application file update ([5ba53df](https://github.com/spaship/spa-manager/commit/5ba53dfc729f2fec3f85e2686958c7441f063327))
