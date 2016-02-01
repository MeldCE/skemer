# skemer 0.8.1
<!--[![NPM version](http://img.shields.io/npm/v/convict.svg)](https://www.npmjs.org/package/convict)-->
[![Build status](https://api.travis-ci.org/MeldCE/skemer.svg?branch=master)](https://travis-ci.org/MeldCE/skemer/branches)
[![Dependency Status](https://david-dm.org/MeldCE/skemer.svg)](https://david-dm.org/MeldCE/skemer)
[![devDependency Status](https://david-dm.org/MeldCE/skemer/dev-status.svg)](https://david-dm.org/MeldCE/skemer#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/MeldCE/skemer/badge.svg)](https://coveralls.io/github/MeldCE/skemer)
[![Development Hours](https://img.shields.io/badge/development%20hours-15-blue.svg)](https://www.paypal.me/MeldCE) (since [5a3e25f](https://github.com/MeldCE/skemer/commit/5a3e25fac0b992033799f9f295d98a4101a39077))
[![Donate](https://img.shields.io/badge/donate-%20%E2%9D%A4%20-blue.svg)](https://www.paypal.me/MeldCE)

A Javascript variable validation and merge tool.

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

## buildJsDocs

Add data to an object based on a schema from the data given.

**Parameters**

-   `schema` **Object** An Object containing a valid
           `schema`
-   `options` **Object** An object containing options
           should contain
    -   `options.name` **[string]** Name of the object documenting (will be
               prepended to any parameter names
    -   `options.type` **[string]** Specify what block tag should be used
               for the variables (optional, default `'prop'`)
    -   `options.tabWidth` **[number]** The width (number of characters) of a
               tab (optional, default `8`)
    -   `options.preLine` **[string]** String (normally indentation) to include
               before each line
    -   `options.lineup` **[boolean]** Whether to line up text in a JSDoc
               (eg @param) with the end of the end of the command (optional, default `true`)
    -   `options.wrap` **[number]** Number of characters to wrap the JSDoc lines
               at

Returns **string** JSDoc Formatted string containing the parameters of the

## validateAdd

Add data to an object based on a schema from the data given.
NOTE: Existing data WILL NOT be validated

**Parameters**

-   `options` **Object** An object containing options
    -   `options.schema` **Object** An Object containing a valid schema
               should containi
-   `newData` **...Any** Data to validate and merge into data
-   `schema` **Object** `Schema` to use for the validation
    -   `schema.doc`  A String giving information on the parameter
    -   `schema.type`  The value type of the parameter expected
    -   `schema.types`  An Array or Object of Objects containing the details
               of the values expected
    -   `schema.values` **[Any]** Specifies the possible values for strings,
               numbers and dates
    -   `schema.multiple` **[boolean]** Whether or not multiple values (stored
               in an array) are allowed. Can be a boolean, or a number (the number
               of values that the parameter must have, or an array containing the
               minimum number of values and teh maximum number of values.
    -   `schema.object` **[boolean]** If multiple is true object is true, will
               force values to be stored in an object - appending will not work. If
               multiple is true and object is false, the key will be ignored and
               the values will be stored in an array
    -   `schema.regex` **[RegExp]** A regular expression to validate a String
               value
    -   `schema.min` **[number]** The minimum number, string length or number of
               Array elements required
    -   `schema.max` **[number]** The maximum number, string length or number of
               Array elements allowed
    -   `schema.replace` **[boolean]** Whether a new value should completely
               replace an old value
    -   `schema.required`  Either true/false or a function returning
               true/false to whether the parameter is required
    -   `schema.default` **[Any]** Default value for parameter
    -   `schema.validation` **[Function]** Function to validate the value of the
               parameter. Will be given the value as the parameter. The function
               must return true if valid, false if not, or null if no value
-   `baseSchema.doc`  A String giving information on the parameter
-   `baseSchema.type`  The value type of the parameter expected
-   `baseSchema.types`  An Array or Object of Objects containing the
           details of the values expected
-   `baseSchema.values` **[Any]** Specifies the possible values for strings,
           numbers and dates
-   `baseSchema.multiple` **[boolean]** Whether or not multiple values
           (stored in an array) are allowed. Can be a boolean, or a number (the
           number of values that the parameter must have, or an array
           containing the minimum number of values and teh maximum number of
           values.
-   `baseSchema.object` **[boolean]** If multiple is true object is true,
           will force values to be stored in an object - appending will not
           work. If multiple is true and object is false, the key will be
           ignored and the values will be stored in an array
-   `baseSchema.regex` **[RegExp]** A regular expression to validate a
           String value
-   `baseSchema.min` **[number]** The minimum number, string length or
           number of Array elements required
-   `baseSchema.max` **[number]** The maximum number, string length or
           number of Array elements allowed
-   `baseSchema.replace` **[boolean]** Whether a new value should completely
           replace an old value
-   `baseSchema.required`  Either true/false or a function returning
           true/false to whether the parameter is required
-   `baseSchema.default` **[Any]** Default value for parameter
-   `baseSchema.validation` **[Function]** Function to validate the value of
           the parameter. Will be given the value as the parameter. The
           function must return true if valid, false if not, or null if no
           value
-   `replace`  A boolean to specify whether to globally replace all
           existing values for arrays and objects, or an object of
           variable/boolean pairs used to specify what variables (their name
           given as the key) should have their value replaced by default (a
           boolean value of true
-   `data` **Any** Data to validate and return. If no data is given,
              data containing any default values will be returned. If newData
              is given, newData will be validated and merged into data.
-   `baseSchema` **[Object]** 

Returns **Any** Validated and merged data

## validateNew

Add new data to data based on the stored schema.

**Parameters**

-   `options` **Object** An object containing options
    -   `options.schema` **Object** An Object containing a valid schema
               should contain
-   `newData` **...Any** Data to validate and merge into data

Returns **Any** Validated and merged data

## Skemer

Skemer prototype to enable simple reuse of a schema

**Parameters**

-   `options` **Object** An object containing options

### validateAdd

Add new data to data based on the stored schema.
NOTE: Existing data WILL NOT be validated

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


# Skemer Errors

The Skemer library will throw the following Errors if any errors in the Schema
or the variables are found

## DataInvalidError

Thrown if the parameter value is not valid

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information

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

