# %%name%% %%version%%
<!--[![NPM version](http://img.shields.io/npm/v/convict.svg)](https://www.npmjs.org/package/convict)-->
[![Build status](https://api.travis-ci.org/MeldCE/skemer.svg?branch=master)](https://travis-ci.org/MeldCE/skemer/branches)
[![Dependency Status](https://david-dm.org/MeldCE/skemer.svg)](https://david-dm.org/MeldCE/skemer)
[![devDependency Status](https://david-dm.org/MeldCE/skemer/dev-status.svg)](https://david-dm.org/MeldCE/skemer#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/MeldCE/skemer/badge.svg)](https://coveralls.io/github/MeldCE/skemer)

[![Development Hours](https://img.shields.io/badge/development%20hours%20%28since%205a3e25f%29-37-lightgrey.svg)](https://github.com/MeldCE/skemer/commit/5a3e25fac0b992033799f9f295d98a4101a39077)
[![Bountysource](https://img.shields.io/bountysource/team/meldce/activity.svg)](https://www.bountysource.com/teams/meldce/issues?tracker_ids=27337966)
[![Donate](https://img.shields.io/badge/donate%20via%20Paypal.me-%20%E2%9D%A4%20-blue.svg)](https://www.paypal.me/MeldCE)

<!--[![Gratipay Team](https://img.shields.io/gratipay/meldce/shields.svg)](https://gratipay.com/meldce)-->

%%description%%

This library can be used to ensure a variable and any additions to that
variable adhere to a certain schema. The schema can be as simple as allowing
a string value, to as complex as a nested Object.

The library contains the [`validateNew`](#validateNew) function for validating
and merging all new data, the [`validateAdd`](#validataAdd) function for doing
validating and merging new data into existing data, a [`Skemer`](#Skemer)
prototype for doing multiple validations / merges against the same schema,
and a [`buildJsDocs`](#buildJsDocs) function for creating
a JSDoc comment string from the [`schema`](#schema) and its `doc` parameters.
It also contains versions of each of the functions that return a Promise.

<!-- START doctoc -->
<!-- END doctoc -->

# Uses
- Validating static data during testing
- Validating dynamic data during runtime

# Example
[Try on Tonic](https://tonicdev.com/npm/skemer)

```javascript
<!--=include ../example.js -->
```

# Skemer API

<!--=include ../build/skemer.js.md -->

# Schema and Validate Options

<!--=include ../build/schema.js.md -->

# Skemer Errors

The Skemer module will throw the following Errors if any errors in the Schema
or the variables are found

<!--=include ../build/errors.js.md -->

