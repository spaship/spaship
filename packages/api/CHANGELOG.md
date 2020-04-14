# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [0.9.2](https://github.com/spaship/spaship/compare/v0.9.1...v0.9.2) (2020-04-14)

**Note:** Version bump only for package @spaship/api

# [0.9.0](https://github.com/spaship/spaship/compare/v0.8.1...v0.9.0) (2020-04-14)

### Bug Fixes

- **api:** apiKey label should uniqu by userId ([#321](https://github.com/spaship/spaship/issues/321)) ([7a3d703](https://github.com/spaship/spaship/commit/7a3d703274cef00da41accf96717afb3e13bdf79))
- **api:** expiredDate should not before today ([#320](https://github.com/spaship/spaship/issues/320)) ([0f9b5ab](https://github.com/spaship/spaship/commit/0f9b5ab275422335d0e363d0eda113e84cf765f1))

# [0.8.0](https://github.com/spaship/spaship/compare/v0.7.0...v0.8.0) (2020-04-09)

### Bug Fixes

- **deps:** update dependency pino to v6 ([#277](https://github.com/spaship/spaship/issues/277)) ([5377079](https://github.com/spaship/spaship/commit/53770799dc8b0294297fe731357866b93c125934))
- **deps:** update dependency validator to v13 ([#278](https://github.com/spaship/spaship/issues/278)) ([f80767c](https://github.com/spaship/spaship/commit/f80767cb72455dadb5001e1e5bb3e4980e4775d3))

# [0.7.0](https://github.com/spaship/spaship/compare/v0.6.0...v0.7.0) (2020-03-27)

### Features

- **api:** add timestamp for list api ([#262](https://github.com/spaship/spaship/issues/262)) ([7cbb84d](https://github.com/spaship/spaship/commit/7cbb84dc035bd1357aa47d8658ce54fb4249da62))
- **cli:** Teach CLI to support API key auth and to communicate with multiple SPAship environments ([6661866](https://github.com/spaship/spaship/commit/666186671b90f6a2731ac645b009cd663139ff9a))

# [0.6.0](https://github.com/spaship/spaship/compare/v0.5.0...v0.6.0) (2020-03-26)

### Bug Fixes

- **api:** dont cache invalid response from autosync ([#243](https://github.com/spaship/spaship/issues/243)) ([af57dc0](https://github.com/spaship/spaship/commit/af57dc0349477838b61d5fe9377fa4fd0524c2a7))
- **api:** exclude invalid spa paths ([#241](https://github.com/spaship/spaship/issues/241)) ([444db20](https://github.com/spaship/spaship/commit/444db202fb1a7a838ad39c8d87be9dba25888b68))
- **api:** fix connection to mongodb ([#216](https://github.com/spaship/spaship/issues/216)) ([2342c66](https://github.com/spaship/spaship/commit/2342c66ce414603d40ba5dafb96f8aaee72e9d31))

### Features

- **api:** add jwt and api key validation to the api ([#218](https://github.com/spaship/spaship/issues/218)) ([0d5437f](https://github.com/spaship/spaship/commit/0d5437ff1677d658c6d42f7d06b7d822bd8b7e8d))
- **api:** use UUID v4 format for API keys ([#223](https://github.com/spaship/spaship/issues/223)) ([3eff190](https://github.com/spaship/spaship/commit/3eff190271bbc215bcf3bd4c611fc4928c6157a6))
- **apiKeys:** add REST endpoints for managing API keys. ([#204](https://github.com/spaship/spaship/issues/204)) ([618f8b1](https://github.com/spaship/spaship/commit/618f8b1bc94793da660699f90de4482540d59ee3))

# [0.5.0](https://github.com/spaship/spaship/compare/v0.4.0...v0.5.0) (2020-03-09)

### Bug Fixes

- **api:** Added nodemon conf to ignore mock-db. ([#200](https://github.com/spaship/spaship/issues/200)) ([a482139](https://github.com/spaship/spaship/commit/a48213970485e86d4d61cc7de862b31a3b6e4758))

### Features

- **api:** add mongodb user & password config ([#203](https://github.com/spaship/spaship/issues/203)) ([48de5ac](https://github.com/spaship/spaship/commit/48de5acac6d007d1cd2ff4a14118c791ee71e245))

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

## [0.3.5](https://github.com/spaship/sync-service/compare/v0.3.4...v0.3.5) (2019-12-24)

**Note:** Version bump only for package @spaship/sync-service

## [0.3.4](https://github.com/spaship/sync-service/compare/v0.3.3...v0.3.4) (2019-10-22)

**Note:** Version bump only for package @spaship/sync-service

# 0.1.0 (2019-10-18)

### Bug Fixes

- **deps:** correct two misplaced dependencies ([6120101](https://github.com/spaship/sync-service/commit/6120101cdf051705cff9332883293f7f10467f3a))
- **list:** only list directories in the webroot ([#17](https://github.com/spaship/sync-service/issues/17)) ([04c798e](https://github.com/spaship/sync-service/commit/04c798e22b553da350927fc9fed353e4b2565f55))
- write metadata even when webroot already exists ([4d6c696](https://github.com/spaship/sync-service/commit/4d6c696718b51db19ce6474ff4fe6713c8dd0b68))

### Features

- **autosync:** provide startup options for autosync ([b9105e6](https://github.com/spaship/sync-service/commit/b9105e6f15bd859b122c1b50205e0960cf54da39))
- add /list and spa metadata ([bd87605](https://github.com/spaship/sync-service/commit/bd87605193e74012a899cc636e5c29ac08047992))
- add auto-syncing of SSI content ([c0d008b](https://github.com/spaship/sync-service/commit/c0d008b5a08505f6d1afb3f10bef4b395b8cbea0))
- include SPAs in /list that have no metadata ([9ec8a56](https://github.com/spaship/sync-service/commit/9ec8a56f7c61f28e21e7855f519848eee8b6effb))
- print autosync configuration at startup ([7542db1](https://github.com/spaship/sync-service/commit/7542db1d34c658bedd2c4574910288558afc968c))
- support cross-origin HTTP requests ([#15](https://github.com/spaship/sync-service/issues/15)) ([6d407d6](https://github.com/spaship/sync-service/commit/6d407d6655831016c66063b5db669474408c1865))
- **cli:** fix shebang and mode for cli support ([391fae4](https://github.com/spaship/sync-service/commit/391fae4f0ca1f1af0737817a1561c3050100762a))
- **config:** print configuration on launch ([ebcf7f1](https://github.com/spaship/sync-service/commit/ebcf7f1c15f11cafc574daa330a5a892ef95965c))
- support global CLI installs ([ea1bc1d](https://github.com/spaship/sync-service/commit/ea1bc1db0da47b96fc7a9db6e8bf4477a4d7d597))

# Changelog

All notable changes to this project will be documented in this file. See [standard-version](https://github.com/conventional-changelog/standard-version) for commit guidelines.

### [0.0.13](https://github.com/spaship/sync-service/compare/v0.0.12...v0.0.13) (2019-09-25)

### Bug Fixes

- **deps:** correct two misplaced dependencies ([918c7db](https://github.com/spaship/sync-service/commit/918c7db))

### Features

- **autosync:** provide startup options for autosync ([cc98051](https://github.com/spaship/sync-service/commit/cc98051))
- print autosync configuration at startup ([4edecac](https://github.com/spaship/sync-service/commit/4edecac))

### [0.0.12](https://github.com/spaship/sync-service/compare/v0.0.11...v0.0.12) (2019-09-25)

Note, the project is renamed in this release, from "spandx-sync-service" to "@spaship/sync-service". The rename covers the github repo, NPM package, and all internal logging and code.

### Features

- display version number when starting the service ([91a21b5](https://github.com/spaship/sync-service/commit/d6e8faebbde4fa9b0ca33318ebb03acd782611da))

### Bug Fixes

- **list:** only list directories in the webroot ([#17](https://github.com/spaship/sync-service/issues/17)) ([07edf29](https://github.com/spaship/sync-service/commit/07edf29))

### [0.0.11](https://github.com/spaship/sync-service/compare/v0.0.10...v0.0.11) (2019-09-24)

### Features

- support cross-origin HTTP requests ([#15](https://github.com/spaship/sync-service/issues/15)) ([f2e9264](https://github.com/spaship/sync-service/commit/f2e9264))

## [0.0.10](https://github.com/spaship/sync-service/compare/v0.0.9...v0.0.10) (2019-09-24)

### Features

- add auto-syncing of SSI content ([dafdc45](https://github.com/spaship/sync-service/commit/dafdc45))

## [0.0.9](https://github.com/spaship/sync-service/compare/v0.0.8...v0.0.9) (2019-09-20)

### Bug Fixes

- write metadata even when webroot already exists ([99ba918](https://github.com/spaship/sync-service/commit/99ba918))

## [0.0.8](https://github.com/spaship/sync-service/compare/v0.0.7...v0.0.8) (2019-09-20)

## [0.0.7](https://github.com/spaship/sync-service/compare/v0.0.6...v0.0.7) (2019-09-20)

### Features

- include SPAs in /list that have no metadata ([241925f](https://github.com/spaship/sync-service/commit/241925f))

## [0.0.6](https://github.com/spaship/sync-service/compare/v0.0.5...v0.0.6) (2019-09-18)

### Features

- add /list and spa metadata ([eb6bed9](https://github.com/spaship/sync-service/commit/eb6bed9))

## [0.0.5](https://github.com/spaship/sync-service/compare/v0.0.4...v0.0.5) (2019-09-18)

Accidental publish.

## [0.0.4](https://github.com/spaship/sync-service/compare/v0.0.3...v0.0.4) (2019-09-17)

### Features

- **config:** print configuration on launch ([c8ef711](https://github.com/spaship/sync-service/commit/c8ef711))

## [0.0.3](https://github.com/spaship/sync-service/compare/v0.0.2...v0.0.3) (2019-09-13)

### Features

- **cli:** fix shebang and mode for cli support ([36b5fc8](https://github.com/spaship/sync-service/commit/36b5fc8))

## [0.0.2](https://github.com/spaship/sync-service/compare/v0.0.1...v0.0.2) (2019-09-13)

### Features

- support global CLI installs ([e1efcf3](https://github.com/spaship/sync-service/commit/e1efcf3))
