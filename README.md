# skemer 0.0.1
<!--[![NPM version](http://img.shields.io/npm/v/convict.svg)](https://www.npmjs.org/package/convict)-->
[![Build status](https://api.travis-ci.org/MeldCE/skemer.svg)](https://travis-ci.org/MeldCE/skemer)
[![Dependency Status](https://david-dm.org/MeldCE/skemer.svg)](https://david-dm.org/MeldCE/skemer)
[![devDependency Status](https://david-dm.org/MeldCE/skemer/dev-status.svg)](https://david-dm.org/MeldCE/skemer#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/MeldCE/skemer/badge.svg)](https://coveralls.io/github/MeldCE/skemer)
[![Development Hours](https://img.shields.io/badge/development%20hours-10-blue.svg)](https://www.paypal.me/MeldCE) (since [5a3e25f](https://github.com/MeldCE/skemer/commit/5a3e25fac0b992033799f9f295d98a4101a39077))
[![Donate](https://img.shields.io/badge/donate-%20%E2%9D%A4%20-blue.svg)](https://www.paypal.me/MeldCE)

A Javascript variable validation and merge tool

This library can be used to ensure a variable and any additions to that
variable adhere to a certain schema. The schema can be as simple as allowing
a string value, to as complex as a nested Object.

The library contains the `validateAdd` function for doing single
validations / merges, a `Skemer` prototype for doing multiple validations /
merges against the same schema, and a `makeJSDoc` function for creating
a JSDoc comment from the schema and its `doc` parameters.

# Skemer API

## validateAdd

Add data to an object based on a schema from the data given.

**Parameters**

-   `options` **Object** An object containing options
    -   `options.schema` **Object** An Object containing a valid schema
               should contain
-   `data`  
-   `newData`  

## validateAdd

Add new data to data based on the stored schema.

**Parameters**

-   `data`  
-   `newData`  

## validateNew

Add new data to data based on the stored schema.

**Parameters**

-   `newData`  


# Skemer Errors

The Skemer library will throw the following Errors if any errors in the Schema
or the variables are found

## DataItemsError

**Parameters**

-   `message` **string** Error message
-   `extra`  

## DataRangeError

**Parameters**

-   `message` **string** Error message
-   `extra`  

## DataRequiredError

**Parameters**

-   `message` **string** Error message
-   `extra`  

## DataTypeError

**Parameters**

-   `message` **string** Error message
-   `extra`  

## OptionsError

**Parameters**

-   `message` **string** Error message
-   `extra`  

## SchemaError

**Parameters**

-   `message` **string** Error message
-   `extra`  

