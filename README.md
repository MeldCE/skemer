# skemer 0.8.6-r1
<!--[![NPM version](http://img.shields.io/npm/v/convict.svg)](https://www.npmjs.org/package/convict)-->
[![Build status](https://api.travis-ci.org/MeldCE/skemer.svg?branch=master)](https://travis-ci.org/MeldCE/skemer/branches)
[![Dependency Status](https://david-dm.org/MeldCE/skemer.svg)](https://david-dm.org/MeldCE/skemer)
[![devDependency Status](https://david-dm.org/MeldCE/skemer/dev-status.svg)](https://david-dm.org/MeldCE/skemer#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/MeldCE/skemer/badge.svg)](https://coveralls.io/github/MeldCE/skemer)

[![Development Hours](https://img.shields.io/badge/development%20hours%20%28since%205a3e25f%29-37-lightgrey.svg)](https://github.com/MeldCE/skemer/commit/5a3e25fac0b992033799f9f295d98a4101a39077)
[![Bountysource](https://img.shields.io/bountysource/team/meldce/activity.svg)](https://www.bountysource.com/teams/meldce/issues?tracker_ids=27337966)
[![Donate](https://img.shields.io/badge/donate%20via%20Paypal.me-%20%E2%9D%A4%20-blue.svg)](https://www.paypal.me/MeldCE)

<!--[![Gratipay Team](https://img.shields.io/gratipay/meldce/shields.svg)](https://gratipay.com/meldce)-->

A Javascript variable validation and merge tool.

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

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Uses](#uses)
- [Example](#example)
- [Skemer API](#skemer-api)
  - [buildJsDocs](#buildjsdocs)
  - [Skemer](#skemer)
    - [set](#set)
    - [validateAdd](#validateadd)
    - [validateNew](#validatenew)
  - [validateAdd](#validateadd-1)
  - [validateNew](#validatenew-1)
- [Schema and Validate Options](#schema-and-validate-options)
  - [options](#options)
  - [schema](#schema)
- [Skemer Errors](#skemer-errors)
  - [DataInvalidError](#datainvaliderror)
  - [DataItemsError](#dataitemserror)
  - [DataPathError](#datapatherror)
  - [DataRangeError](#datarangeerror)
  - [DataRequiredError](#datarequirederror)
  - [DataTypeError](#datatypeerror)
  - [OptionsError](#optionserror)
  - [ReferenceError](#referenceerror)
  - [SchemaError](#schemaerror)

<!-- END doctoc generated TOC please keep comment here to allow auto update -->

# Uses
- Validating static data during testing
- Validating dynamic data during runtime

# Example
[Try on Tonic](https://tonicdev.com/npm/skemer)

```javascript
var skemer = require('skemer');


var schema = {
  doc: 'A basic schema',
  type: {
    value: {
      doc: 'Some string value',
      type: 'string'
    },
    figure: {
      doc: 'A number value',
      type: 'number',
      min: 20,
      max: 50
    }
  }
};

var valid = {
  value: 'a string',
  figure: 30
};

var valid1 = {
  figure: 35
};

var valid2 = {
  value: 'a different string'
};

var invalid = false;

var stringSchema = {
  type: 'string'
};

var aString = 'string';


skemer.validateNew({ schema: stringSchema }, aString);

var Schema, data;

console.log(data = skemer.buildJsDocs(schema, {
  wrap: 80,
  preLine: ' * ',
  lineup: true
}));

Schema = new skemer.Skemer({ schema: schema });

console.log(data = Schema.validateNew(valid));

console.log(data = Schema.validateAdd(data, valid1));

Schema.validateAdd(data, valid2, invalid);

```

# Skemer API

## buildJsDocs

Build a JSDoc for a variable using the given `schema`.

**Parameters**

-   `schema` **Object** An Object containing a valid
           `schema`
-   `options` **Object** An Object containing build options
    -   `options.name` **[string]** Name of the object documenting (will be
               prepended to any parameter names
    -   `options.type` **[string]** Specify what block tag should be used
               for the variables (optional, default `'prop'`)
    -   `options.tabWidth` **[number]** The width (number of characters) of a
               tab (optional, default `8`)
    -   `options.preLine` **[string]** String (normally indentation) to include
               before each line
    -   `options.lineup` **[boolean]** Whether to line up text in a JSDoc
               block (eg `@param`) with the end of the block command (optional, default `true`)
    -   `options.wrap` **[number]** Number of characters to wrap the JSDoc lines
               at

Returns **string** A string containing the JSDoc for the given schema

## Skemer

Skemer prototype to enable simple reuse of a schema

**Parameters**

-   `options` **Object** An object containing the validation
           `options`, including the `schema`

### set

Validate and set a specific variable given by the string path in
the given validated data

**Parameters**

-   `data` **Any** Data to add the given value to
-   `path` **String** Path to variable to set. Dots should be used to
           separate parts of the path
-   `newData` **Any** Value to set the specified variable to

Returns **undefined** 

### validateAdd

Add new data to existing validated data based on the stored schema.
NOTE: Existing data WILL NOT be validated

**Parameters**

-   `data` **Any** Existing data to merge new data into.
-   `newData` **...Any** Data to validate and merge into the existing data.

Returns **Any** Validated and merged data

### validateNew

Validate and merge new data based on the stored schema.

**Parameters**

-   `newData` **...Any** Data to validate, merge and return. If no data is
           given, a variable containing any default values, if configured,
           will be returned.

Returns **Any** Validated and merged data

## validateAdd

Validata and add new data to existing validated data based on the given
schema. NOTE: Existing data WILL NOT be validated

**Parameters**

-   `options` **Object** An object containing the validation
           `options`, including the `schema`
-   `data` **Any** Data to validate and return. If no data is given,
           data containing any default values will be returned. If newData
           is given, newData will be validated and merged into data.
-   `newData` **...Any** Data to validate and merge into `data`

Returns **Any** Validated and merged data

## validateNew

Validate and merge new data based on the given schema.

**Parameters**

-   `options` **Object** An object containing the validation
           `options`, including the `schema`
-   `newData` **...Any** Data to validate, merge and return

Returns **Any** Validated and merged data


# Schema and Validate Options

## options

Options Object that must be passed to the one-off
`validate` `functions` and
on creating an instance of a `Skemer`

**Parameters**

-   `schema` **schema** `Schema` to use for the validation
-   `baseSchema` **[Object]** Schema to be used for recursive schemas. If
           none given, the given, the full schema given in `schema` will be
           used
-   `replace` **[boolean or Array&lt;boolean&gt;]** A boolean to specify whether to
           globally replace all existing values for arrays and objects, or an
           object of string/boolean key/value pairs used to specify what
           variables(their name given as the key) should have their value
           replaced by default (a boolean value of true)

## schema

Schema Object detailing the schema to be used for validating and merging
data.

**Parameters**

-   `description` **[string]** A String giving information on the value
           expected
-   `doc` **[string]** A String giving information on the value expected
-   `docType` **[string]** A string containing the type of the value
           expected that will be used instead of calculating the type of value
           expected
-   `noDocDig` **[boolean]** If set and the value expected is an object,
           buildJsDoc will not document the parameters of the object
-   `type` **[string or  or Array&lt;schema&gt;]** The value type of the parameter
           expected
-   `types` **[Array&lt;schema&gt;]** An Array or Object of `schema` containing
           different schemas of the values expected
-   `values` **[Array&lt;Any&gt;]** Specifies the possible values for strings, numbers
           and dates
-   `multiple` **[boolean]** Whether or not multiple values (stored in an
           Array, or if `object is set to`true` an Object) are allowed. Can be
           a boolean, a number (the number of values that the value expected
           must have), or an array containing the minimum number of values and,
           optionally, the maximum number of values.
-   `object` **[boolean]** If `multiple` is true and `object` is true, the
           multiple values will be stored in an object. If multiple is true and
           object is false, any keys will be ignored and the values will be
           stored in an array
-   `regex` **[RegExp]** A regular expression to validate a String value
-   `min` **[number or date]** The minimum number, string length or number of
           Array elements required
-   `max` **[number or date]** The maximum number, string length or number of
           Array elements allowed
-   `replace` **[boolean]** Whether a new value should completely replace an
           old value when the value expected is either an array or an object
-   `required` **[boolean or Function or number or Array&lt;number&gt;]** Either true/false or
           a function returning true/false whether the parameter is required,
           or if the variable is a multiple stored in an array an number given
           the number of required elements, or an array of numbers, the first
           being the minimum number of elements and the second being the
           maximum number of elements (a maximum is not required)
-   `default` **[Any]** Default value to use if no value is given


# Skemer Errors

The Skemer module will throw the following Errors if any errors in the Schema
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

## DataPathError

Thrown if the path given to the set function does not lead to a value

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

## ReferenceError

Thrown if a reference is invalid or can not be resolved

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information

## SchemaError

Thrown if the parameter value is out of the given range

**Parameters**

-   `message` **string** Error message
-   `extra` **Any** Extra information


