# skemer 0.8.0
<!--[![NPM version](http://img.shields.io/npm/v/convict.svg)](https://www.npmjs.org/package/convict)-->
[![Build status](https://api.travis-ci.org/MeldCE/skemer.svg?branch=master)](https://travis-ci.org/MeldCE/skemer/branches)
[![Dependency Status](https://david-dm.org/MeldCE/skemer.svg)](https://david-dm.org/MeldCE/skemer)
[![devDependency Status](https://david-dm.org/MeldCE/skemer/dev-status.svg)](https://david-dm.org/MeldCE/skemer#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/MeldCE/skemer/badge.svg)](https://coveralls.io/github/MeldCE/skemer)
[![Development Hours](https://img.shields.io/badge/development%20hours-10-blue.svg)](https://www.paypal.me/MeldCE) (since [https://github.com/MeldCE/skemer/commit/5a3e25fac0b992033799f9f295d98a4101a39077](5a3e25f))
[![Donate](https://img.shields.io/badge/donate-%20%E2%9D%A4%20-blue.svg)](https://www.paypal.me/MeldCE)

A Javascript variable validation and merge tool.

This library can be used to ensure a variable and any additions to that
variable adhere to a certain schema. The schema can be as simple as allowing
a string value, to as complex as a nested Object.

The library contains the `validateAdd` function for doing single
validations / merges, a `Skemer` prototype for doing multiple validations /
merges against the same schema, and a `makeJSDoc` function for creating
a JSDoc comment from the schema and its `doc` parameters.

# Skemer API

## Skemer

Skemer prototype to enable simple reuse of a schema

**Parameters**

-   `options` **Object** An object containing options

### validateAdd

Add new data to data based on the stored schema.

**Parameters**

-   `data` **Any** Data to validate and return. If no data is given,
              data containing any default values will be returned. If newData
              is given, newData will be validated and merged into data.
-   `newData` **...Any** Data to validate and merge into data

Returns **Any** Validated and merged data

### validateNew

Add new data to data based on the stored schema.

**Parameters**

-   `newData` **...Any** Data to validate and merge into data

Returns **Any** Validated and merged data

## validateAdd

Add data to an object based on a schema from the data given.

**Parameters**

-   `options` **Object** An object containing options
    -   `options.schema` **Object** An Object containing a valid schema
               should contain
-   `data` **Any** Data to validate and return. If no data is given,
              data containing any default values will be returned. If newData
              is given, newData will be validated and merged into data.
-   `newData` **...Any** Data to validate and merge into data

Returns **Any** Validated and merged data

## validateNew

Add new data to data based on the stored schema.

**Parameters**

-   `options` **Object** An object containing options
    -   `options.schema` **Object** An Object containing a valid schema
               should contain
-   `newData` **...Any** Data to validate and merge into data

Returns **Any** Validated and merged data


# Skemer Errors

The Skemer library will throw the following Errors if any errors in the Schema
or the variables are found

## DataItemsError

Thrown if the parameter value is out of the given range

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information

## DataRangeError

Thrown if the parameter value is out of the given range

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information

## DataRequiredError

Thrown if a parameter is required, but was not given

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information

## DataTypeError

Thrown if the type of value for a parameter in the schema is incorrect,

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information

## OptionsError

Thrown if the parameter value is out of the given range

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information

## SchemaError

Thrown if the parameter value is out of the given range

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information

