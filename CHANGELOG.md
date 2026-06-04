# CHANGELOG

## v2.0.3 - 2026.06.04 17
* docs: improve export of types and correct naming of a types file
* regular: bump up dependencies


## v2.0.2 - 2026.05.27 14
* improve: standardize the `at` value of RichError thrown in code


## v2.0.1 - 2026.05.26 16
* docs: **IMPORTANT!** update license to ***MIT***
* docs: add refactoring note in README


## v2.0.0 - 2026.05.26 14
* refactor!: due to a change in design philosophy, remove all error message text
  * in my design philosophy, an error should only contain a code and associated data. text-based message should be rendered by the terminal (including i18n and terminal highlighting)
* docs: add README and English version
* docs: add error code reference table
* docs: improve types and export
* test: refactor `describe()` and `it()` with `test()` from `node:test`
* regular: improve enviroment
* regular: bump up dependencies


## v1.4.0 - 2024.08.23 14
* docs: renew locale with latest `@nuogz/i18n`
* docs: renew types
* deps: bump up dependencies
* chore: renew develop environments


## v1.3.1 - 2023.12.05 16
* fix `test/proto.test.js`
* tweak enviroment
* bump up dependencies


## v1.3.0 - 2023.05.28 23
* update code to properly support browser build
* bump up dependencies
	* update `typescript` to `v5.x`, and renew jsdoc
* use eslint flat config, and related config udpate
	* use `eslint.config.js` instead `eslintrc.cjs`


## v1.2.2 - 2023.04.07 11
* improve locales


## v1.2.1 - 2023.04.03 15
* bump up `@nuogz/i18n` to `v3.1.0` and renew related code
* renew locales


## v1.2.0 - 2023.03.27 16
* renew locales for `@nuogz/i18n@3.x` 
* improve error message
* stricter regexps for test object prototype and constructor
* improve description
* bump up dependencies


## v1.1.2 - 2023.03.24 16
* update description
* bump up dependencies


## v1.1.1 - 2023.03.24 15
* bump up dependencies


## v1.1.0 - 2023.03.07 16
* use library `@nuogz/i18n` for i18n error
* improve jsdoc


## v1.0.7 - 2023.01.05 16
* improve `package.json`


## v1.0.6 - 2023.01.05 16
* fix `repository.url` in `package.json`


## v1.0.5 - 2023.01.05 16
* try to fix fucking types definition in `package.json`


## v1.0.4 - 2023.01.05 16
* try to fix fucking types definition in `package.json`


## v1.0.3 - 2023.01.05 15
* try to fix fucking types definition in `package.json`


## v1.0.2 - 2023.01.05 15
* fix types definition in `package.json`


## v1.0.1 - 2022.08.31 11
* move `src/index.js` to `index.js`
* add declaration files
* add declare script to `package.json`


## v1.0.0 - 2022.08.31 11
* tweak all files for publishing to npm
* start use `CHANGLOG.md` since version `v1.0.0`
