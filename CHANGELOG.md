# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

# [0.14.0](https://github.com/spaship/spaship/compare/v0.13.2...v0.14.0) (2021-02-11)

### Bug Fixes

- **api:** accept buildDir in spaship.yaml ([#952](https://github.com/spaship/spaship/issues/952)) ([c813b5b](https://github.com/spaship/spaship/commit/c813b5bc94e09dbab9d779407a620a72add163b0))
- **auth:** restore JWT authentication ([#970](https://github.com/spaship/spaship/issues/970)) ([cc31eb0](https://github.com/spaship/spaship/commit/cc31eb091af6f39b1452f3e646b4c93fd0a25e16))
- **cli:** add exit code when cli error ([#917](https://github.com/spaship/spaship/issues/917)) ([e58b998](https://github.com/spaship/spaship/commit/e58b998193e5f5a09f5735eb803d7a3720d43be3))
- **cli:** allow using buildDir for [@org](https://github.com/org) pkgs ([#953](https://github.com/spaship/spaship/issues/953)) ([ae3b697](https://github.com/spaship/spaship/commit/ae3b6971ec201a13073608ee46d039027e63e137))
- **common:** name with whitespace will broke htaccess ([#1073](https://github.com/spaship/spaship/issues/1073)) ([555c2fc](https://github.com/spaship/spaship/commit/555c2fc29b6819fdb5176ad7bcd496dc7a252ee7))
- **deps:** update dependency @mdx-js/react to v1.6.21 ([1ee0c4b](https://github.com/spaship/spaship/commit/1ee0c4b0bde43cd7de9c28e18b1794cd87a2d62b))
- **deps:** update dependency @mdx-js/react to v1.6.22 ([5fb0cf4](https://github.com/spaship/spaship/commit/5fb0cf4d3971c7c886f97ce04b57a9d93a0bb58b))
- **deps:** update dependency axios to v0.21.1 [security] ([3a33535](https://github.com/spaship/spaship/commit/3a335355c54ae1f0c532e4f3c5d2354f090d9204))
- **deps:** update dependency nconf to ^0.11.0 ([9eef0e4](https://github.com/spaship/spaship/commit/9eef0e42b201ffefdee681a0ada7de2346dc0a5f))
- **deps:** update docusaurus monorepo to v2.0.0-alpha.68 ([7a6d722](https://github.com/spaship/spaship/commit/7a6d7229075f32f50d2157ec936b08baeda312b8))
- **deps:** update docusaurus monorepo to v2.0.0-alpha.69 ([b0bd4d0](https://github.com/spaship/spaship/commit/b0bd4d01c9fb97931cde6c0019500fd53256a219))
- **deps:** update docusaurus monorepo to v2.0.0-alpha.bd62be93d ([cdd7434](https://github.com/spaship/spaship/commit/cdd7434c4c130d57332a85f605e6f5b3c2d152e2))
- **deps:** update docusaurus monorepo to v2.0.0-alpha.e90749c6f ([6d4786d](https://github.com/spaship/spaship/commit/6d4786d5a53aab3d37971a8a4b86ef7980fc04bd))
- **deps:** update docusaurus monorepo to v2.0.0-alpha.f37987f32 ([7e57f33](https://github.com/spaship/spaship/commit/7e57f331f7446f8879de7319a12ace6c8ce2aadc))
- **deps:** update docusaurus monorepo to v2.0.0-alpha.f48d435ce ([c67c95f](https://github.com/spaship/spaship/commit/c67c95f62e0c4df9a23d9716adb8e595a23959c5))
- **deps:** update docusaurus monorepo to v2.0.0-alpha.fd17476c3 ([cd6d322](https://github.com/spaship/spaship/commit/cd6d3222e71527898f3a7421c162670ddd9ed5a2))
- make the .env file optional for npm start ([#947](https://github.com/spaship/spaship/issues/947)) ([fb45b9b](https://github.com/spaship/spaship/commit/fb45b9b14c877955a3799863760e53848eade06a))
- repair regression causing API key auth to be unusable ([#951](https://github.com/spaship/spaship/issues/951)) ([f1b541c](https://github.com/spaship/spaship/commit/f1b541c2e2825d4494da1c1578d0e5caacc1e44d))

### Features

- **cli:** add --path flag ([#935](https://github.com/spaship/spaship/issues/935)) ([aff31fe](https://github.com/spaship/spaship/commit/aff31fe14899c4aef1b675e4aa0d3b5ef1af2a00))
- **common:** support (yaml, yml, YAML, YML) config files ([#873](https://github.com/spaship/spaship/issues/873)) ([#1040](https://github.com/spaship/spaship/issues/1040)) ([68dcb12](https://github.com/spaship/spaship/commit/68dcb12c520bce4ab455223d6e44af4f236fc739))
- **manager:** add easy ui to add new property ([#957](https://github.com/spaship/spaship/issues/957)) ([b986d14](https://github.com/spaship/spaship/commit/b986d140819aff9ca064a4761710ea0299ba7d75))
- **router:** add forwarded_host options to support router behind a proxy ([#916](https://github.com/spaship/spaship/issues/916)) ([83dde52](https://github.com/spaship/spaship/commit/83dde520feca1eeb3ba765788040b5e672763880))

## [0.13.2](https://github.com/spaship/spaship/compare/v0.13.0...v0.13.2) (2020-11-05)

### Bug Fixes

- **cli:** restore support for ARCHIVE argument ([#896](https://github.com/spaship/spaship/issues/896)) ([763f4a0](https://github.com/spaship/spaship/commit/763f4a07c92b9dcdb6354443f232e3eb269dfb2e))

## [0.13.1](https://github.com/spaship/spaship/compare/v0.13.0...v0.13.1) (2020-11-05)

### Bug Fixes

- **cli:** restore support for ARCHIVE argument ([#896](https://github.com/spaship/spaship/issues/896)) ([763f4a0](https://github.com/spaship/spaship/commit/763f4a07c92b9dcdb6354443f232e3eb269dfb2e))

# [0.13.0](https://github.com/spaship/spaship/compare/v0.11.1...v0.13.0) (2020-11-05)

### Bug Fixes

- **manager:** the api key created but not show up ([#877](https://github.com/spaship/spaship/issues/877)) ([9f9f234](https://github.com/spaship/spaship/commit/9f9f234b1dad93640a0c661531040e76e1a78121))
- resolve noFallthroughCasesInSwitch typescript error ([#869](https://github.com/spaship/spaship/issues/869)) ([2f54164](https://github.com/spaship/spaship/commit/2f54164acddbcf670be0a25c84c8f8be5cd3dbfd))
- **api:** [#724](https://github.com/spaship/spaship/issues/724) Error: algorithms should be set ([#725](https://github.com/spaship/spaship/issues/725)) ([d17cbc0](https://github.com/spaship/spaship/commit/d17cbc0722067b8bb37823804b0e8051595a77af))
- **deps:** downgrade docusaurus/core and docusaurus/preset-classic from 2.0.0-alpha.66 to 2.0.0-alpha.65 ([#863](https://github.com/spaship/spaship/issues/863)) ([9d41b17](https://github.com/spaship/spaship/commit/9d41b17e51864cb6aefe43fdeca90bba767eb6b0))
- **deps:** pin dependencies ([d61232d](https://github.com/spaship/spaship/commit/d61232deea629aab2daedc8bf5475cb9f4a3f258))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.58 ([#577](https://github.com/spaship/spaship/issues/577)) ([5694c16](https://github.com/spaship/spaship/commit/5694c16755626a8546dc5816666fe746e7e7ae73))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.59 ([f8ebad1](https://github.com/spaship/spaship/commit/f8ebad121b153556e33a3e3fbd16a8e3aa02a5f2))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.60 ([698f13f](https://github.com/spaship/spaship/commit/698f13facebeceae56b7262485e3d1af740c4c44))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.61 ([7dfdd7a](https://github.com/spaship/spaship/commit/7dfdd7add3d692f66003f977ca3e40e8ff7e14d3))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.62 ([a36fdd2](https://github.com/spaship/spaship/commit/a36fdd209229e4834778fa3448703f7118654766))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.63 ([640f111](https://github.com/spaship/spaship/commit/640f111d3fd21227a85a1d8a38503ddbbe9ed500))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.64 ([#781](https://github.com/spaship/spaship/issues/781)) ([ad50c16](https://github.com/spaship/spaship/commit/ad50c1630f8ff13de4587ebc2642b55974c45bde))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.65 ([#807](https://github.com/spaship/spaship/issues/807)) ([011658a](https://github.com/spaship/spaship/commit/011658acc0f316ff742afac4104cf40adae8646e))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.66 ([66f4a06](https://github.com/spaship/spaship/commit/66f4a062e1273026098d3835a6e16fb32bb67e4d))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.58 ([#578](https://github.com/spaship/spaship/issues/578)) ([6c02950](https://github.com/spaship/spaship/commit/6c02950b3dc920b9314cab1420336ce0320b0f87))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.59 ([a96a706](https://github.com/spaship/spaship/commit/a96a7065cfff2c65d7c3de6b493359f480481324))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.60 ([5d1e4d1](https://github.com/spaship/spaship/commit/5d1e4d1c9be22ab77439462ad861458f3356dfcb))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.61 ([3af3395](https://github.com/spaship/spaship/commit/3af339551757513f7fa0a3bd496ffa351f164b9c))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.62 ([f4e5191](https://github.com/spaship/spaship/commit/f4e5191f6bebf248af25a66cc045a85fda72f148))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.63 ([4db96d8](https://github.com/spaship/spaship/commit/4db96d80de6d8167df36eeaac271e6063fb0d156))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.64 ([#782](https://github.com/spaship/spaship/issues/782)) ([fca86de](https://github.com/spaship/spaship/commit/fca86dece6056d5cac61718186e9c715448af3c0))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.65 ([#808](https://github.com/spaship/spaship/issues/808)) ([229eeeb](https://github.com/spaship/spaship/commit/229eeebd96fb5ccc7578a3cdf136a23b96057c20))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.66 ([20a705d](https://github.com/spaship/spaship/commit/20a705dafc1fb1fa69528498fefae95f7003fcd9))
- **deps:** update dependency @mdx-js/react to v1.6.18 ([#784](https://github.com/spaship/spaship/issues/784)) ([10840f3](https://github.com/spaship/spaship/commit/10840f389288d96e81d5a7eae55b5dff22149675))
- **deps:** update dependency @mdx-js/react to v1.6.19 ([ac19780](https://github.com/spaship/spaship/commit/ac19780d92a2b820e2d00596dc284d8277dbb9e0))
- **deps:** update dependency axios to v0.20.0 ([#731](https://github.com/spaship/spaship/issues/731)) ([c07a1af](https://github.com/spaship/spaship/commit/c07a1af2d1141178f247136e0e6872f6ce541002))
- **deps:** update dependency axios to v0.21.0 ([dc4b8b9](https://github.com/spaship/spaship/commit/dc4b8b9a61bf5985377aa9768cacd6780af1892d))
- **deps:** update dependency cosmiconfig to v7 ([#690](https://github.com/spaship/spaship/issues/690)) ([6538984](https://github.com/spaship/spaship/commit/65389844c9257023413ed8242bf1d181e589c2d4))
- **deps:** update dependency express-jwt to v6 [security] ([#623](https://github.com/spaship/spaship/issues/623)) ([71e905a](https://github.com/spaship/spaship/commit/71e905ab51356c1b382f5379424fc6efeb0b6cec))
- **deps:** update dependency helmet to v4 ([#691](https://github.com/spaship/spaship/issues/691)) ([d80ce1f](https://github.com/spaship/spaship/commit/d80ce1f440c3df565bea6553504e644c75db8b37))
- **deps:** update dependency lodash to v4.17.19 [security] ([ab8c0eb](https://github.com/spaship/spaship/commit/ab8c0eb602e7d45425a8bc6a44323c1fe3b9518f))
- **deps:** update dependency ora to v5 ([#700](https://github.com/spaship/spaship/issues/700)) ([289aabe](https://github.com/spaship/spaship/commit/289aabeba35e8679ead471bd700f511058c9fb75))
- **manager:** [#318](https://github.com/spaship/spaship/issues/318) disable submit button if use duplicate label ([#637](https://github.com/spaship/spaship/issues/637)) ([2528c6f](https://github.com/spaship/spaship/commit/2528c6f55010e620c40dba70b74b578603533ae8))
- **manager:** can not fetch application details ([d9a329d](https://github.com/spaship/spaship/commit/d9a329db0387d3be6561a9a34cd3810b21a41ddd))

### Features

- add better error messages to the cli ([#885](https://github.com/spaship/spaship/issues/885)) ([3b477ca](https://github.com/spaship/spaship/commit/3b477ca646844ed6527a8e950ad15f86612f2b88))
- **#513:** Added warning message to the New API Key modal. ([#634](https://github.com/spaship/spaship/issues/634)) ([64c3505](https://github.com/spaship/spaship/commit/64c3505324f808395637bfdabd4f6db7d4840c6f)), closes [#513](https://github.com/spaship/spaship/issues/513)
- **#616:** Updated Docusaurus pages and deployment configuration ([#619](https://github.com/spaship/spaship/issues/619)) ([9016d28](https://github.com/spaship/spaship/commit/9016d28e34d0032edb999d5c3cca510c7c96c3e8)), closes [#616](https://github.com/spaship/spaship/issues/616)
- **cli:** using api url origin ([#879](https://github.com/spaship/spaship/issues/879)) ([8137917](https://github.com/spaship/spaship/commit/8137917c3d76b0233578ee5250a881cd302c3f5c))
- **manager:** [#502](https://github.com/spaship/spaship/issues/502) enhance manager to be multi-tenant ([#625](https://github.com/spaship/spaship/issues/625)) ([0a257ea](https://github.com/spaship/spaship/commit/0a257ea1a689dff9f98d2ef1941954d2edd4d2a4)), closes [#570](https://github.com/spaship/spaship/issues/570)
- **manager:** display notification when after deploying a new spa ([#639](https://github.com/spaship/spaship/issues/639)) ([9b0fdfe](https://github.com/spaship/spaship/commit/9b0fdfe13f1f33e3060969d67657c388286092a9))

### Reverts

- Revert "chore(deps): update dependency @patternfly/react-table to v4 (#554)" (#561) ([fa8bb2e](https://github.com/spaship/spaship/commit/fa8bb2e38cc9097b4ed4c2dd6f10b8c60cb0eb10)), closes [#554](https://github.com/spaship/spaship/issues/554) [#561](https://github.com/spaship/spaship/issues/561)
- Revert "chore(deps): update dependency @patternfly/react-icons to v4 (#552)" (#560) ([9821532](https://github.com/spaship/spaship/commit/98215322adbc3901b99aa1fa8e985d05e45c0021)), closes [#552](https://github.com/spaship/spaship/issues/552) [#560](https://github.com/spaship/spaship/issues/560)

# [0.12.0](https://github.com/spaship/spaship/compare/v0.11.1...v0.12.0) (2020-11-05)

### Bug Fixes

- **manager:** the api key created but not show up ([#877](https://github.com/spaship/spaship/issues/877)) ([9f9f234](https://github.com/spaship/spaship/commit/9f9f234b1dad93640a0c661531040e76e1a78121))
- resolve noFallthroughCasesInSwitch typescript error ([#869](https://github.com/spaship/spaship/issues/869)) ([2f54164](https://github.com/spaship/spaship/commit/2f54164acddbcf670be0a25c84c8f8be5cd3dbfd))
- **api:** [#724](https://github.com/spaship/spaship/issues/724) Error: algorithms should be set ([#725](https://github.com/spaship/spaship/issues/725)) ([d17cbc0](https://github.com/spaship/spaship/commit/d17cbc0722067b8bb37823804b0e8051595a77af))
- **deps:** downgrade docusaurus/core and docusaurus/preset-classic from 2.0.0-alpha.66 to 2.0.0-alpha.65 ([#863](https://github.com/spaship/spaship/issues/863)) ([9d41b17](https://github.com/spaship/spaship/commit/9d41b17e51864cb6aefe43fdeca90bba767eb6b0))
- **deps:** pin dependencies ([d61232d](https://github.com/spaship/spaship/commit/d61232deea629aab2daedc8bf5475cb9f4a3f258))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.58 ([#577](https://github.com/spaship/spaship/issues/577)) ([5694c16](https://github.com/spaship/spaship/commit/5694c16755626a8546dc5816666fe746e7e7ae73))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.59 ([f8ebad1](https://github.com/spaship/spaship/commit/f8ebad121b153556e33a3e3fbd16a8e3aa02a5f2))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.60 ([698f13f](https://github.com/spaship/spaship/commit/698f13facebeceae56b7262485e3d1af740c4c44))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.61 ([7dfdd7a](https://github.com/spaship/spaship/commit/7dfdd7add3d692f66003f977ca3e40e8ff7e14d3))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.62 ([a36fdd2](https://github.com/spaship/spaship/commit/a36fdd209229e4834778fa3448703f7118654766))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.63 ([640f111](https://github.com/spaship/spaship/commit/640f111d3fd21227a85a1d8a38503ddbbe9ed500))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.64 ([#781](https://github.com/spaship/spaship/issues/781)) ([ad50c16](https://github.com/spaship/spaship/commit/ad50c1630f8ff13de4587ebc2642b55974c45bde))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.65 ([#807](https://github.com/spaship/spaship/issues/807)) ([011658a](https://github.com/spaship/spaship/commit/011658acc0f316ff742afac4104cf40adae8646e))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.66 ([66f4a06](https://github.com/spaship/spaship/commit/66f4a062e1273026098d3835a6e16fb32bb67e4d))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.58 ([#578](https://github.com/spaship/spaship/issues/578)) ([6c02950](https://github.com/spaship/spaship/commit/6c02950b3dc920b9314cab1420336ce0320b0f87))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.59 ([a96a706](https://github.com/spaship/spaship/commit/a96a7065cfff2c65d7c3de6b493359f480481324))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.60 ([5d1e4d1](https://github.com/spaship/spaship/commit/5d1e4d1c9be22ab77439462ad861458f3356dfcb))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.61 ([3af3395](https://github.com/spaship/spaship/commit/3af339551757513f7fa0a3bd496ffa351f164b9c))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.62 ([f4e5191](https://github.com/spaship/spaship/commit/f4e5191f6bebf248af25a66cc045a85fda72f148))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.63 ([4db96d8](https://github.com/spaship/spaship/commit/4db96d80de6d8167df36eeaac271e6063fb0d156))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.64 ([#782](https://github.com/spaship/spaship/issues/782)) ([fca86de](https://github.com/spaship/spaship/commit/fca86dece6056d5cac61718186e9c715448af3c0))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.65 ([#808](https://github.com/spaship/spaship/issues/808)) ([229eeeb](https://github.com/spaship/spaship/commit/229eeebd96fb5ccc7578a3cdf136a23b96057c20))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.66 ([20a705d](https://github.com/spaship/spaship/commit/20a705dafc1fb1fa69528498fefae95f7003fcd9))
- **deps:** update dependency @mdx-js/react to v1.6.18 ([#784](https://github.com/spaship/spaship/issues/784)) ([10840f3](https://github.com/spaship/spaship/commit/10840f389288d96e81d5a7eae55b5dff22149675))
- **deps:** update dependency @mdx-js/react to v1.6.19 ([ac19780](https://github.com/spaship/spaship/commit/ac19780d92a2b820e2d00596dc284d8277dbb9e0))
- **deps:** update dependency axios to v0.20.0 ([#731](https://github.com/spaship/spaship/issues/731)) ([c07a1af](https://github.com/spaship/spaship/commit/c07a1af2d1141178f247136e0e6872f6ce541002))
- **deps:** update dependency axios to v0.21.0 ([dc4b8b9](https://github.com/spaship/spaship/commit/dc4b8b9a61bf5985377aa9768cacd6780af1892d))
- **deps:** update dependency cosmiconfig to v7 ([#690](https://github.com/spaship/spaship/issues/690)) ([6538984](https://github.com/spaship/spaship/commit/65389844c9257023413ed8242bf1d181e589c2d4))
- **deps:** update dependency express-jwt to v6 [security] ([#623](https://github.com/spaship/spaship/issues/623)) ([71e905a](https://github.com/spaship/spaship/commit/71e905ab51356c1b382f5379424fc6efeb0b6cec))
- **deps:** update dependency helmet to v4 ([#691](https://github.com/spaship/spaship/issues/691)) ([d80ce1f](https://github.com/spaship/spaship/commit/d80ce1f440c3df565bea6553504e644c75db8b37))
- **deps:** update dependency lodash to v4.17.19 [security] ([ab8c0eb](https://github.com/spaship/spaship/commit/ab8c0eb602e7d45425a8bc6a44323c1fe3b9518f))
- **deps:** update dependency ora to v5 ([#700](https://github.com/spaship/spaship/issues/700)) ([289aabe](https://github.com/spaship/spaship/commit/289aabeba35e8679ead471bd700f511058c9fb75))
- **manager:** [#318](https://github.com/spaship/spaship/issues/318) disable submit button if use duplicate label ([#637](https://github.com/spaship/spaship/issues/637)) ([2528c6f](https://github.com/spaship/spaship/commit/2528c6f55010e620c40dba70b74b578603533ae8))
- **manager:** can not fetch application details ([d9a329d](https://github.com/spaship/spaship/commit/d9a329db0387d3be6561a9a34cd3810b21a41ddd))

### Features

- add better error messages to the cli ([#885](https://github.com/spaship/spaship/issues/885)) ([3b477ca](https://github.com/spaship/spaship/commit/3b477ca646844ed6527a8e950ad15f86612f2b88))
- **#513:** Added warning message to the New API Key modal. ([#634](https://github.com/spaship/spaship/issues/634)) ([64c3505](https://github.com/spaship/spaship/commit/64c3505324f808395637bfdabd4f6db7d4840c6f)), closes [#513](https://github.com/spaship/spaship/issues/513)
- **#616:** Updated Docusaurus pages and deployment configuration ([#619](https://github.com/spaship/spaship/issues/619)) ([9016d28](https://github.com/spaship/spaship/commit/9016d28e34d0032edb999d5c3cca510c7c96c3e8)), closes [#616](https://github.com/spaship/spaship/issues/616)
- **cli:** using api url origin ([#879](https://github.com/spaship/spaship/issues/879)) ([8137917](https://github.com/spaship/spaship/commit/8137917c3d76b0233578ee5250a881cd302c3f5c))
- **manager:** [#502](https://github.com/spaship/spaship/issues/502) enhance manager to be multi-tenant ([#625](https://github.com/spaship/spaship/issues/625)) ([0a257ea](https://github.com/spaship/spaship/commit/0a257ea1a689dff9f98d2ef1941954d2edd4d2a4)), closes [#570](https://github.com/spaship/spaship/issues/570)
- **manager:** display notification when after deploying a new spa ([#639](https://github.com/spaship/spaship/issues/639)) ([9b0fdfe](https://github.com/spaship/spaship/commit/9b0fdfe13f1f33e3060969d67657c388286092a9))

### Reverts

- Revert "chore(deps): update dependency @patternfly/react-table to v4 (#554)" (#561) ([fa8bb2e](https://github.com/spaship/spaship/commit/fa8bb2e38cc9097b4ed4c2dd6f10b8c60cb0eb10)), closes [#554](https://github.com/spaship/spaship/issues/554) [#561](https://github.com/spaship/spaship/issues/561)
- Revert "chore(deps): update dependency @patternfly/react-icons to v4 (#552)" (#560) ([9821532](https://github.com/spaship/spaship/commit/98215322adbc3901b99aa1fa8e985d05e45c0021)), closes [#552](https://github.com/spaship/spaship/issues/552) [#560](https://github.com/spaship/spaship/issues/560)

## [0.11.1](https://github.com/spaship/spaship/compare/v0.11.0...v0.11.1) (2020-06-05)

### Bug Fixes

- **cli:** form-data was missing ([#547](https://github.com/spaship/spaship/issues/547)) ([1b0bc0b](https://github.com/spaship/spaship/commit/1b0bc0b0cebc5f150deeda35130dab6e79d9b9c0))

# [0.11.0](https://github.com/spaship/spaship/compare/v0.10.0...v0.11.0) (2020-06-05)

### Bug Fixes

- **#367:** Fixed multiple minor styling issues across Manager components. ([#368](https://github.com/spaship/spaship/issues/368)) ([2bfcc47](https://github.com/spaship/spaship/commit/2bfcc473174b57d74b2bb2b31993cbf586c7d26b))
- **#435:** Fixed shortKey display issue post new key creation. ([#438](https://github.com/spaship/spaship/issues/438)) ([34f6b7d](https://github.com/spaship/spaship/commit/34f6b7d1b40f2078a70673e453faf6d496c39c63))
- **#439:** Fixed API Key deletion behaviour. ([#443](https://github.com/spaship/spaship/issues/443)) ([81f3a42](https://github.com/spaship/spaship/commit/81f3a426474f223faa79292b01e01058bb94a8b8))
- **#475:** Added path validation before publishing ([#477](https://github.com/spaship/spaship/issues/477)) ([ad81b88](https://github.com/spaship/spaship/commit/ad81b8808ddd759939adf72ebfa3b10ba935ed70)), closes [#475](https://github.com/spaship/spaship/issues/475)
- **api:** ([#392](https://github.com/spaship/spaship/issues/392)) deploy same path again should overwrite the previous one ([#396](https://github.com/spaship/spaship/issues/396)) ([849a64d](https://github.com/spaship/spaship/commit/849a64d839a0b7949d8d2cbde5e06aa2ec502e26))
- **api:** [#300](https://github.com/spaship/spaship/issues/300) apiKeys endpoint can not auth by apiKey ([#379](https://github.com/spaship/spaship/issues/379)) ([80c0e8b](https://github.com/spaship/spaship/commit/80c0e8bb23585a1db525bc8bfc4bc4b7602c056e))
- **api:** [#370](https://github.com/spaship/spaship/issues/370) return error if app's user not match ([#371](https://github.com/spaship/spaship/issues/371)) ([6068c28](https://github.com/spaship/spaship/commit/6068c28765ab95f497b843b4d4fd96f2d92ead09))
- **api:** avoid overwrite exists .htaccess ([#532](https://github.com/spaship/spaship/issues/532)) ([2491479](https://github.com/spaship/spaship/commit/2491479362215cf0ae3b93fac6a3871daa1729e9))
- **api:** remove hardcode api host in OpenAPI ([#536](https://github.com/spaship/spaship/issues/536)) ([102983c](https://github.com/spaship/spaship/commit/102983cbb7a407e6f670d95069f688a43d4c8e38))
- **api:** use fileService to find app by name ([#381](https://github.com/spaship/spaship/issues/381)) ([a0a7776](https://github.com/spaship/spaship/commit/a0a7776a782adb8bed3da57665300ee0c11d14a4))
- **cli:** undefined req issue ([#546](https://github.com/spaship/spaship/issues/546)) ([99611c9](https://github.com/spaship/spaship/commit/99611c96cacbf7776a51cb11e53c3c59c0e3e7d5))
- **deps:** pin dependencies ([#423](https://github.com/spaship/spaship/issues/423)) ([a796666](https://github.com/spaship/spaship/commit/a7966668af9a961da4a8af121a4fb7f6b4359fc3))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.55 ([5ac6529](https://github.com/spaship/spaship/commit/5ac652913f43cd2abcabbf94ccb3ab1b4d1e8930))
- **deps:** update dependency @docusaurus/core to v2.0.0-alpha.56 ([#516](https://github.com/spaship/spaship/issues/516)) ([5c96c7e](https://github.com/spaship/spaship/commit/5c96c7ec11c287916cb42a6217a4a37541c52a8b))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.55 ([07a1a7b](https://github.com/spaship/spaship/commit/07a1a7b433f9fa88c8b8f88b7a834d7ab36a9db6))
- **deps:** update dependency @docusaurus/preset-classic to v2.0.0-alpha.56 ([#517](https://github.com/spaship/spaship/issues/517)) ([ec86abf](https://github.com/spaship/spaship/commit/ec86abf7e6fa575b74ce24fd3e610544536bffa6))
- **deps:** update dependency @oclif/plugin-help to v3 ([#429](https://github.com/spaship/spaship/issues/429)) ([8fac4e7](https://github.com/spaship/spaship/commit/8fac4e7308e1241b801e634f54ecc4b42dabebd5))
- **deps:** update dependency express-pino-logger to v5 ([#430](https://github.com/spaship/spaship/issues/430)) ([1025d63](https://github.com/spaship/spaship/commit/1025d63be4b9f64c3182f878da286985730ba3c7))
- **manager:** add timestamp for config script tag to avoid cache issue ([#500](https://github.com/spaship/spaship/issues/500)) ([99d1f62](https://github.com/spaship/spaship/commit/99d1f62cd7b71b8fbc0c448d4e879d013a04e0cf))
- **manager:** Added SPAship definition & Footer info to SPAship login page. ([#366](https://github.com/spaship/spaship/issues/366)) ([fd8d789](https://github.com/spaship/spaship/commit/fd8d789b5e941faccfa377cdca2f2b4a53b36852)), closes [#365](https://github.com/spaship/spaship/issues/365)
- **manager:** show path error in environment details ([#386](https://github.com/spaship/spaship/issues/386)) ([4ebc6f5](https://github.com/spaship/spaship/commit/4ebc6f5450779eeaa8fcf16c39fc697b31e93aa6))
- **manager:** user should not redirect to login page if they already login ([#535](https://github.com/spaship/spaship/issues/535)) ([fd3f7ec](https://github.com/spaship/spaship/commit/fd3f7ec5fe70836a9a1855728bbebffdd58db5e8))
- **manager:** when apiKey generated without any environment name ([#372](https://github.com/spaship/spaship/issues/372)) ([eea19d5](https://github.com/spaship/spaship/commit/eea19d52b10ed0a31646fdc23245e8d1570c60cf))
- **router:** [#364](https://github.com/spaship/spaship/issues/364) - redirect root at root path spa ([#369](https://github.com/spaship/spaship/issues/369)) ([af8688c](https://github.com/spaship/spaship/commit/af8688cf3aa9fa96e315083b91690b602b08cf90))
- **test:** rename init.html to init/index.html ([#482](https://github.com/spaship/spaship/issues/482)) ([22deb49](https://github.com/spaship/spaship/commit/22deb49fb8c8252a62eac79b4bd9429723649a54))

### Features

- **#422:** Prettified Timestamp for APIKeys page. ([#426](https://github.com/spaship/spaship/issues/426)) ([0e8b366](https://github.com/spaship/spaship/commit/0e8b366a3292106303c1be6e2f4070e2d49f8e39)), closes [#422](https://github.com/spaship/spaship/issues/422)
- **cli:** add deploy progress ([#531](https://github.com/spaship/spaship/issues/531)) ([a17ca6b](https://github.com/spaship/spaship/commit/a17ca6b7a709a8b9a055c8b2660797cccf216de1))

# [0.10.0](https://github.com/spaship/spaship/compare/v0.9.2...v0.10.0) (2020-04-20)

### Bug Fixes

- **#328:** Added warning message to Deploy UI page. ([#339](https://github.com/spaship/spaship/issues/339)) ([60b6082](https://github.com/spaship/spaship/commit/60b60829fc9cfa9bd0d6404fa7b089d419c513f1)), closes [#328](https://github.com/spaship/spaship/issues/328)
- **#335:** Added catch block to serviceWorker unregister method. ([#336](https://github.com/spaship/spaship/issues/336)) ([893cb96](https://github.com/spaship/spaship/commit/893cb9662fef86e63f3bb1a4748034cba65a2f1e)), closes [#335](https://github.com/spaship/spaship/issues/335)
- **#359:** Jazzed up the Coming Soon message on the Dashboard page. ([#360](https://github.com/spaship/spaship/issues/360)) ([490cf52](https://github.com/spaship/spaship/commit/490cf5297cb71bdd93fd9ff0c05954da4bb01b14)), closes [#359](https://github.com/spaship/spaship/issues/359)
- **api:** GET application should return details info ([#357](https://github.com/spaship/spaship/issues/357)) ([025dd32](https://github.com/spaship/spaship/commit/025dd329700d440facced80408bb2b8bd10bb44c))
- **api:** upload was use wrong name ([#325](https://github.com/spaship/spaship/issues/325)) ([041e9c5](https://github.com/spaship/spaship/commit/041e9c5350a0c0a16d84cae307edaeb736f7ae88))
- **npm-audit:** Fix npm audit vulnerabilities. ([#334](https://github.com/spaship/spaship/issues/334)) ([594865a](https://github.com/spaship/spaship/commit/594865a9dd8fe0f04fd703c7992178a4bba6b3fe))

### Features

- **#267:** Added JWT refresh to APIService methods. ([#340](https://github.com/spaship/spaship/issues/340)) ([943ee5f](https://github.com/spaship/spaship/commit/943ee5f5a1d5c037cd25005f7da089118ad34e9c)), closes [#267](https://github.com/spaship/spaship/issues/267)
- **common:** add specific ROOTSPA case ([#361](https://github.com/spaship/spaship/issues/361)) ([0331399](https://github.com/spaship/spaship/commit/0331399ce1968dac5ed1c3819999468038092299))
- **manager:** show application index in real data ([#355](https://github.com/spaship/spaship/issues/355)) ([1c0934a](https://github.com/spaship/spaship/commit/1c0934a2f5110b6e61074bad10296276fbc90065))

## [0.9.2](https://github.com/spaship/spaship/compare/v0.9.1...v0.9.2) (2020-04-14)

### Bug Fixes

- **common:** use json format as default ([#324](https://github.com/spaship/spaship/issues/324)) ([4dc3d73](https://github.com/spaship/spaship/commit/4dc3d73eb9f72c683549af9c7712a8bd56fe7eab))

## [0.9.1](https://github.com/spaship/spaship/compare/v0.9.0...v0.9.1) (2020-04-14)

### Bug Fixes

- **cli:** duplicate path ([#323](https://github.com/spaship/spaship/issues/323)) ([1df100a](https://github.com/spaship/spaship/commit/1df100a07a88cd0462f1d8ea1e2f6b551accfcc9))

# [0.9.0](https://github.com/spaship/spaship/compare/v0.8.1...v0.9.0) (2020-04-14)

### Bug Fixes

- **api:** apiKey label should uniqu by userId ([#321](https://github.com/spaship/spaship/issues/321)) ([7a3d703](https://github.com/spaship/spaship/commit/7a3d703274cef00da41accf96717afb3e13bdf79))
- **api:** expiredDate should not before today ([#320](https://github.com/spaship/spaship/issues/320)) ([0f9b5ab](https://github.com/spaship/spaship/commit/0f9b5ab275422335d0e363d0eda113e84cf765f1))
- **cli:** send "name", "path" to API ([#317](https://github.com/spaship/spaship/issues/317)) ([412e145](https://github.com/spaship/spaship/commit/412e14574e3047115b04478125cda2f3eb82c04c)), closes [#316](https://github.com/spaship/spaship/issues/316)
- **manager:** remove mock link, add some information to display ([#322](https://github.com/spaship/spaship/issues/322)) ([1d3a927](https://github.com/spaship/spaship/commit/1d3a9275349218391e48b886590e6e52c3ebce32))

### Features

- **manager:** API Key list/create/revoke ([#315](https://github.com/spaship/spaship/issues/315)) ([b6ee36b](https://github.com/spaship/spaship/commit/b6ee36b8125db4ebc7a505d6495f01ba0d46f93f))

## [0.8.1](https://github.com/spaship/spaship/compare/v0.8.0...v0.8.1) (2020-04-09)

### Bug Fixes

- **sync:** add npm public access ([f145d7e](https://github.com/spaship/spaship/commit/f145d7ee445bdcbf80b9f90856b7d93fb352afaf))

# [0.8.0](https://github.com/spaship/spaship/compare/v0.7.0...v0.8.0) (2020-04-09)

### Bug Fixes

- **deps:** update dependency keycloak-js to v9.0.2 ([#276](https://github.com/spaship/spaship/issues/276)) ([bca161b](https://github.com/spaship/spaship/commit/bca161b854186096ad4aeeed1a1f2befca5276ba))
- **deps:** update dependency pino to v6 ([#277](https://github.com/spaship/spaship/issues/277)) ([5377079](https://github.com/spaship/spaship/commit/53770799dc8b0294297fe731357866b93c125934))
- **deps:** update dependency validator to v13 ([#278](https://github.com/spaship/spaship/issues/278)) ([f80767c](https://github.com/spaship/spaship/commit/f80767cb72455dadb5001e1e5bb3e4980e4775d3))

### Features

- **manager:** use config file to replace build environment vars ([#258](https://github.com/spaship/spaship/issues/258)) ([405fc0e](https://github.com/spaship/spaship/commit/405fc0e216316d40f8cce508993ec55617706bcc))

# [0.7.0](https://github.com/spaship/spaship/compare/v0.6.0...v0.7.0) (2020-03-27)

### Features

- **api:** add timestamp for list api ([#262](https://github.com/spaship/spaship/issues/262)) ([7cbb84d](https://github.com/spaship/spaship/commit/7cbb84dc035bd1357aa47d8658ce54fb4249da62))
- **cli:** Teach CLI to support API key auth and to communicate with multiple SPAship environments ([6661866](https://github.com/spaship/spaship/commit/666186671b90f6a2731ac645b009cd663139ff9a))

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
