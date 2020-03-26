# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.6.0](https://github.com/spaship/spaship/compare/v0.5.0...v0.6.0) (2020-03-26)

### Bug Fixes

- **api:** dont cache invalid response from autosync ([#243](https://github.com/spaship/spaship/issues/243)) ([af57dc0](https://github.com/spaship/spaship/commit/af57dc0349477838b61d5fe9377fa4fd0524c2a7))
- **api:** exclude invalid spa paths ([#241](https://github.com/spaship/spaship/issues/241)) ([444db20](https://github.com/spaship/spaship/commit/444db202fb1a7a838ad39c8d87be9dba25888b68))
- **api:** fix connection to mongodb ([#216](https://github.com/spaship/spaship/issues/216)) ([2342c66](https://github.com/spaship/spaship/commit/2342c66ce414603d40ba5dafb96f8aaee72e9d31))
- **common:** remove handlebars dependency ([#256](https://github.com/spaship/spaship/issues/256)) ([0bd5ff9](https://github.com/spaship/spaship/commit/0bd5ff95fefbeebfee8e04714be598ad32b9e1cd))
- **deps:** pin dependencies ([#226](https://github.com/spaship/spaship/issues/226)) ([0054b53](https://github.com/spaship/spaship/commit/0054b53076f37f445e3f1b3e9b6b1444ee747609))
- **deps:** update dependency @react-keycloak/web to v1.0.5 ([#253](https://github.com/spaship/spaship/issues/253)) ([c59b6b1](https://github.com/spaship/spaship/commit/c59b6b19d06ad550f15952e4f8f9d4b43dcbce2d))
- **manager:** add .htaccess make react browser route work ([#220](https://github.com/spaship/spaship/issues/220)) ([cbfbba9](https://github.com/spaship/spaship/commit/cbfbba956e6d19e2e4eea1160cbc5b18cf0c6aea))
- **manager:** use the default '/' root path to avoid path 404 error ([#221](https://github.com/spaship/spaship/issues/221)) ([3b6d6f4](https://github.com/spaship/spaship/commit/3b6d6f4067c2c79ff3c9cf08256d410bf40769ae))

### Features

- **api:** add jwt and api key validation to the api ([#218](https://github.com/spaship/spaship/issues/218)) ([0d5437f](https://github.com/spaship/spaship/commit/0d5437ff1677d658c6d42f7d06b7d822bd8b7e8d))
- **api:** use UUID v4 format for API keys ([#223](https://github.com/spaship/spaship/issues/223)) ([3eff190](https://github.com/spaship/spaship/commit/3eff190271bbc215bcf3bd4c611fc4928c6157a6))
- **apiKeys:** add REST endpoints for managing API keys. ([#204](https://github.com/spaship/spaship/issues/204)) ([618f8b1](https://github.com/spaship/spaship/commit/618f8b1bc94793da660699f90de4482540d59ee3))
- **manager:** add api key page ([#217](https://github.com/spaship/spaship/issues/217)) ([ee04f3c](https://github.com/spaship/spaship/commit/ee04f3cb53bbc7da4c5e119c9ba43611f88dea9b))
- **manager:** add multi api keys support ([#238](https://github.com/spaship/spaship/issues/238)) ([6a29264](https://github.com/spaship/spaship/commit/6a292640855feb1a1396a451aa98518284b4dcbe))

# [0.5.0](https://github.com/spaship/spaship/compare/v0.4.0...v0.5.0) (2020-03-09)

### Bug Fixes

- **api:** Added nodemon conf to ignore mock-db. ([#200](https://github.com/spaship/spaship/issues/200)) ([a482139](https://github.com/spaship/spaship/commit/a48213970485e86d4d61cc7de862b31a3b6e4758))

### Features

- add keycloak authentication to SPAship Manager ([#208](https://github.com/spaship/spaship/issues/208)) ([609c499](https://github.com/spaship/spaship/commit/609c49934779bf5942be7fd8d315ea5b374d7b4a))
- **api:** add mongodb user & password config ([#203](https://github.com/spaship/spaship/issues/203)) ([48de5ac](https://github.com/spaship/spaship/commit/48de5acac6d007d1cd2ff4a14118c791ee71e245))

# [0.4.0](https://github.com/spaship/spaship/compare/v0.3.5...v0.4.0) (2020-03-03)

### Bug Fixes

- **deps:** update dependency http-proxy-middleware to ^0.21.0 ([#174](https://github.com/spaship/spaship/issues/174)) ([9e73a48](https://github.com/spaship/spaship/commit/9e73a488e8b120adb65c649855e921f45344e9ef))
- **deps:** update dependency http-proxy-middleware to v1 ([#186](https://github.com/spaship/spaship/issues/186)) ([415b736](https://github.com/spaship/spaship/commit/415b73638cf5c410802059291bdc74826a3f449f))
- **path-proxy:** avoid duplicate slash error ([ebefa3d](https://github.com/spaship/spaship/commit/ebefa3dc8ea999dd3d5f94c8736b1cdea428e988))
- **path-proxy:** avoid redirect with duplicate slash ([7122812](https://github.com/spaship/spaship/commit/712281299fcb15293dd24f16db1ee73b76b6a06d))
- **path-proxy:** default port to 8080 ([94563bf](https://github.com/spaship/spaship/commit/94563bfd3af92641c365626ab7729e791fbca003))

### Code Refactoring

- rename packages ([#188](https://github.com/spaship/spaship/issues/188)) ([1e739b3](https://github.com/spaship/spaship/commit/1e739b3c08462d95db5af140405683af797b7daa))

### Features

- hash api keys ([#150](https://github.com/spaship/spaship/issues/150)) ([a182b70](https://github.com/spaship/spaship/commit/a182b709da08660b0b481a78a77eeb4da7abb4b3))
- **path-proxy:** make path-proxy configurable ([75c3c1e](https://github.com/spaship/spaship/commit/75c3c1e1d61d9c8f18c7c8fcfea892c0a428e51b))
- **sync-service:** add a mongo database with apikey helpers ([27f9c6b](https://github.com/spaship/spaship/commit/27f9c6b63dcdd2f656636f618876f469f5ab72a7))

### BREAKING CHANGES

- `sync-service` renamed to `api`, `spa-manager` renamed to `manager`, `path-proxy` renamed to `router`

- rename directories

- rename path-proxy within files

- rename sync-service within files

- rename spa-manager within files

- regenerate manager's package-lock

- fix homepage and repository links for renamed packages

- standardize README titles

## [0.3.5](https://github.com/spaship/spaship/compare/v0.3.4...v0.3.5) (2019-12-24)

### Bug Fixes

- invalid package.json in spa-manager ([20f8fec](https://github.com/spaship/spaship/commit/20f8fec9c969b2f60d63031a11f7f5aa56147573))
- **common:** fix common repo url ([#115](https://github.com/spaship/spaship/issues/115)) ([9e7e87f](https://github.com/spaship/spaship/commit/9e7e87f5bb04310c6da7fef018bd43dc847ce386))
- **deps:** update dependency execa to v3 ([#18](https://github.com/spaship/spaship/issues/18)) ([c3d93c6](https://github.com/spaship/spaship/commit/c3d93c6d87f663e19312517e8b49febf8f18d7a3))
- **deps:** update dependency execa to v4 ([#114](https://github.com/spaship/spaship/issues/114)) ([9663115](https://github.com/spaship/spaship/commit/96631150c59f97da18037eebc5ac2f2ea943a76f))

## [0.3.4](https://github.com/spaship/spaship/compare/v0.3.3...v0.3.4) (2019-10-22)

**Note:** Version bump only for package @spaship/spaship

# 0.1.0 (2019-10-18)

### Bug Fixes

- **deps:** correct two misplaced dependencies ([6120101](https://github.com/spaship/spaship/commit/6120101cdf051705cff9332883293f7f10467f3a))
- **list:** only list directories in the webroot ([#17](https://github.com/spaship/spaship/issues/17)) ([04c798e](https://github.com/spaship/spaship/commit/04c798e22b553da350927fc9fed353e4b2565f55))
- write metadata even when webroot already exists ([4d6c696](https://github.com/spaship/spaship/commit/4d6c696718b51db19ce6474ff4fe6713c8dd0b68))

### Features

- **autosync:** provide startup options for autosync ([b9105e6](https://github.com/spaship/spaship/commit/b9105e6f15bd859b122c1b50205e0960cf54da39))
- **file:** add application file update ([5ba53df](https://github.com/spaship/spaship/commit/5ba53dfc729f2fec3f85e2686958c7441f063327))
- add /list and spa metadata ([bd87605](https://github.com/spaship/spaship/commit/bd87605193e74012a899cc636e5c29ac08047992))
- add auto-syncing of SSI content ([c0d008b](https://github.com/spaship/spaship/commit/c0d008b5a08505f6d1afb3f10bef4b395b8cbea0))
- include SPAs in /list that have no metadata ([9ec8a56](https://github.com/spaship/spaship/commit/9ec8a56f7c61f28e21e7855f519848eee8b6effb))
- print autosync configuration at startup ([7542db1](https://github.com/spaship/spaship/commit/7542db1d34c658bedd2c4574910288558afc968c))
- support cross-origin HTTP requests ([#15](https://github.com/spaship/spaship/issues/15)) ([6d407d6](https://github.com/spaship/spaship/commit/6d407d6655831016c66063b5db669474408c1865))
- **cli:** fix shebang and mode for cli support ([391fae4](https://github.com/spaship/spaship/commit/391fae4f0ca1f1af0737817a1561c3050100762a))
- **config:** print configuration on launch ([ebcf7f1](https://github.com/spaship/spaship/commit/ebcf7f1c15f11cafc574daa330a5a892ef95965c))
- support global CLI installs ([ea1bc1d](https://github.com/spaship/spaship/commit/ea1bc1db0da47b96fc7a9db6e8bf4477a4d7d597))
