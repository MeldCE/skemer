# skemer 0.8.5-r22
<!--[![NPM version](http://img.shields.io/npm/v/convict.svg)](https://www.npmjs.org/package/convict)-->
[![Build status](https://api.travis-ci.org/MeldCE/skemer.svg?branch=master)](https://travis-ci.org/MeldCE/skemer/branches)
[![Dependency Status](https://david-dm.org/MeldCE/skemer.svg)](https://david-dm.org/MeldCE/skemer)
[![devDependency Status](https://david-dm.org/MeldCE/skemer/dev-status.svg)](https://david-dm.org/MeldCE/skemer#info=devDependencies)
[![Coverage Status](https://coveralls.io/repos/MeldCE/skemer/badge.svg)](https://coveralls.io/github/MeldCE/skemer)

[![Development Hours](https://img.shields.io/badge/development%20hours%20%28since%205a3e25f%29-30-lightgrey.svg)](https://github.com/MeldCE/skemer/commit/5a3e25fac0b992033799f9f295d98a4101a39077)
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
and a [`buildJsDoc`](#buildJsDoc) function for creating
a JSDoc comment from the [`schema`](#schema) and its `doc` parameters.

<!-- START doctoc generated TOC please keep comment here to allow auto update -->
<!-- DON'T EDIT THIS SECTION, INSTEAD RE-RUN doctoc TO UPDATE -->


- [Uses](#uses)
- [Example](#example)
- [Skemer API](#skemer-api)
  - [buildJsDocs](#buildjsdocs)
  - [promiseBuildJsDocs](#promisebuildjsdocs)
  - [Skemer](#skemer)
    - [promiseValidateAdd](#promisevalidateadd)
    - [promiseValidateNew](#promisevalidatenew)
    - [validateAdd](#validateadd)
    - [validateNew](#validatenew)
  - [promiseValidateAdd](#promisevalidateadd-1)
  - [promiseValidateNew](#promisevalidatenew-1)
  - [validateAdd](#validateadd-1)
  - [validateNew](#validatenew-1)
- [Schema and Validate Options](#schema-and-validate-options)
  - [options](#options)
  - [schema](#schema)
- [Skemer Errors](#skemer-errors)
  - [DataInvalidError](#datainvaliderror)
  - [DataItemsError](#dataitemserror)
  - [DataRangeError](#datarangeerror)
  - [DataRequiredError](#datarequirederror)
  - [DataTypeError](#datatypeerror)
  - [OptionsError](#optionserror)
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
	type: {
		value: {
			type: 'string'
		},
		figure: {
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
               block (eg `@param`) with the end of the end of the block command (optional, default `true`)
    -   `options.wrap` **[number]** Number of characters to wrap the JSDoc lines
               at

Returns **string** A string containing the JSDoc for the given schema

## promiseBuildJsDocs

Get a promise to build a JSDoc for a variable using the given
`schema`.

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
               block (eg `@param`) with the end of the end of the block command (optional, default `true`)
    -   `options.wrap` **[number]** Number of characters to wrap the JSDoc lines
               at

Returns **Promise** A promise that will resolve to a string containing the
         JSDoc for the given schema

## Skemer

Skemer prototype to enable simple reuse of a schema

**Parameters**

-   `options` **Object** An object containing the validation
           `options`, including the `schema`

### promiseValidateAdd

Get a promise to add new data to data based on the stored schema.
NOTE: Existing data WILL NOT be validated

**Parameters**

-   `data` **Any** Data to validate and return. If no data is given,
              data containing any default values will be returned. If newData
              is given, newData will be validated and merged into data.
-   `newData` **...Any** Data to validate and merge into data

Returns **Promise** A promise that will resolve to the validated and
         merged data

### promiseValidateNew

Get a promise to add new data to data based on the stored schema.

**Parameters**

-   `newData` **...Any** Data to validate and merge into data

Returns **Promise** A promise that will resolve to the validated and
         merged data

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

## promiseValidateAdd

Get a promise to add data to an object based on a schema from the data
given.
NOTE: Existing data WILL NOT be validated

**Parameters**

-   `options` **Object** An object containing the validation
           `options`, including the `schema`
-   `data` **Any** Data to validate and return. If no data is given,
           data containing any default values will be returned. If newData
           is given, newData will be validated and merged into data.
-   `newData` **...Any** Data to validate and merge into data

Returns **Promise** A Promise that will resolve to the validated and
         merged data

## promiseValidateNew

Get a promise to add new data to data based on the stored schema.

**Parameters**

-   `options` **Object** An object containing the validation
           `options`, including the `schema`
-   `newData` **...Any** Data to validate and merge into data

Returns **Promise** A Promise that will resolve to the validated and
         merged data

## validateAdd

Add data to an object based on a schema from the data given.
NOTE: Existing data WILL NOT be validated

**Parameters**

-   `options` **Object** An object containing the validation
           `options`, including the `schema`
-   `data` **Any** Data to validate and return. If no data is given,
           data containing any default values will be returned. If newData
           is given, newData will be validated and merged into data.
-   `newData` **...Any** Data to validate and merge into data

Returns **Any** Validated and merged data

## validateNew

Add new data to data based on the stored schema.

**Parameters**

-   `options` **Object** An object containing the validation
           `options`, including the `schema`
-   `newData` **...Any** Data to validate and merge into data

Returns **Any** Validated and merged data


# Schema and Validate Options

## options

Options to that must be passed to the one off
`validate](#validateAdd) [functions](#validateNew) and
on creating a [`Skemer``

**Parameters**

-   `schema` **Object** `Schema` to use for the validation
-   `baseSchema` **[schema]** Schema to be used for recursive schemas. If
           none given, the given schema will be used
-   `replace` **[boolean or Array&lt;boolean&gt;]** A boolean to specify whether to
           globally replace all existing values for arrays and objects, or an
           object of variable/boolean pairs used to specify what variables
           (their name given as the key) should have their value replaced by
           default (a boolean value of true

## schema

Schema detailing the requirements for Skemer Schema

**Parameters**

-   `doc` **[string]** A String giving information on the parameter
-   `noDocDig` **[boolean]** If set and the variable is an object,
           buildJsDoc will not document the parameters of the object
-   `type` **[string or  or Array&lt;schema&gt;]** The value type of the parameter
           expected
-   `types` **[Array&lt;schema&gt;]** An Array or Object of `schema` containing
           different schemas of the values expected
-   `values` **[Array&lt;Any&gt;]** Specifies the possible values for strings, numbers
           and dates
-   `multiple` **[boolean]** Whether or not multiple values (stored in an
           array) are allowed. Can be a boolean, or a number (the number of
           values that the parameter must have, or an array containing the
           minimum number of values and the maximum number of values.
-   `object` **[boolean]** If multiple is true object is true, will force
           values to be stored in an object. If multiple is true and object is
           false, the key will be ignored and the values will be stored in an
           array
-   `regex` **[RegExp]** A regular expression to validate a String value
-   `min` **[number or date]** The minimum number, string length or number of
           Array elements required
-   `max` **[number or date]** The maximum number, string length or number of
           Array elements allowed
-   `replace` **[boolean]** Whether a new value should completely replace an
           old value
-   `required` **[boolean or Function or number or Array&lt;number&gt;]** Either true/false or
           a function returning true/false whether the parameter is required,
           or if the variable is a multiple stored in an array an number given
           the number of required elements, or an array of numbers, the first
           being the minimum number of elements and the second being the
           maximum number of elements (a maximum is not required)
-   `default` **[Any]** Default value for parameter
-   `validation` **[Function]** Function to validate the value of the
           parameter. Will be given the value as the parameter. The function
           must return true if valid, false if not, or null if no value


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


