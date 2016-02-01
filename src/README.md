# %%name%% %%version%%
<!--[![NPM version](http://img.shields.io/npm/v/convict.svg)](https://www.npmjs.org/package/convict)-->
[![Build status](https://api.travis-ci.org/MeldCE/skemer.svg?branch=master)](https://travis-ci.org/MeldCE/skemer/branches)
[![Dependency Status](https://david-dm.org/MeldCE/skemer.svg)](https://david-dm.org/MeldCE/skemer)
[![devDependency Status](https://david-dm.org/MeldCE/skemer/dev-status.svg)](https://david-dm.org/MeldCE/skemer#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/MeldCE/skemer/badge.svg)](https://coveralls.io/github/MeldCE/skemer)
[![Development Hours](https://img.shields.io/badge/development%20hours-15-blue.svg)](https://www.paypal.me/MeldCE) (since [5a3e25f](https://github.com/MeldCE/skemer/commit/5a3e25fac0b992033799f9f295d98a4101a39077))
[![Donate](https://img.shields.io/badge/donate-%20%E2%9D%A4%20-blue.svg)](https://www.paypal.me/MeldCE)

%%description%%

This library can be used to ensure a variable and any additions to that
variable adhere to a certain schema. The schema can be as simple as allowing
a string value, to as complex as a nested Object.

The library contains the `validateNew` function for validating and merging all
new data, the `validateAdd` function for doing validating and merging new data
into existing data, a `Skemer` prototype for doing multiple validations /
merges against the same schema, and a `makeJSDoc` function for creating
a JSDoc comment from the schema and its `doc` parameters.

## Uses
- Validating static data during testing
- Validating dynamic data during runtime

# Skemer API

<!--=include ../build/skemer.js.md -->

# Skemer Errors

The Skemer library will throw the following Errors if any errors in the Schema
or the variables are found

<!--=include ../build/errors.js.md -->
