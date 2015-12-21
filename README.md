# skemer 0.1.0
<!--[![NPM version](http://img.shields.io/npm/v/convict.svg)](https://www.npmjs.org/package/convict)-->
[![Build status](https://api.travis-ci.org/MeldCE/skemer.svg)](https://travis-ci.org/MeldCE/skemer)
[![Dependency Status](https://david-dm.org/MeldCE/skemer.svg)](https://david-dm.org/MeldCE/skemer)
[![devDependency Status](https://david-dm.org/MeldCE/skemer/dev-status.svg)](https://david-dm.org/MeldCE/skemer#info=devDependencies)
[![Coverage Status](https://img.shields.io/coveralls/MeldCE/skemer.svg)](https://coveralls.io/r/MeldCE/skemer)

An object validation tool to check an object against a scheme


# Skemer

## addData

Add data to an object based on a schema from the data given.

**Parameters**

-   `schema` **Object** An Object containing a valid schema
           should contain
-   `data` **Object** An Object containing data to put into the new object
-   `object` **Object** The Object that will be built

Returns **boolean** True if any data was added to the object

## buildDocOptions

Options that can be passed to the `buildDocs` functions

## schema

Schema detailing the requirements for Skemer Schema

## schemaOptions

Options that can be passed when creating a Skemer Schema

# addData

**Parameters**

-   `context` **Object** An Object containing the context of the call.
    -   `context.type` **Object** The type to validate the value against
    -   `context.add` **boolean** If true and value can contain multiple values
               add the value to the existing values
    -   `context.baseSchema` **Object** The original schema, so that it can be
               used in recursive schema
    -   `context.inMultiple` **boolean** Used to determine if have called itself
               to validate a value that can have multiple values
    -   `context.noThrow` **boolean** If true, if a value that doesn't match the
               schema is encountered, null will be returned instead of an error
               being thrown

Returns **boolean** True if any data was added to the object

# build

Merge object values into the existing object verifying each before
merging

**Parameters**

-   `object` **Object** Object to merge into existing object
-   `silent` **[boolean]** If true, if a parameter is invalid, it will
           be ignored rather than raising an Error

# buildDocs

Generates a JSDoc comment for the given schema.

**Parameters**

-   `options` **[Object]** Generation options
    -   `options.scope` **[string]** The string to prepend to the start of
               each parameter
    -   `options.preLine` **[string]** String to include before each line
    -   `options.wrap` **[number]** Wrap the lines at the given number of
               characters
    -   `options.tabWidth` **[number]** Your favourite tab width used to
               calculate 80 characters
    -   `options.lineup` **[boolean]** Line up broken lines with the start of
               the parameter details

Returns **string** JSDoc Formatted string containing the parameters of the
         scheme

# merge

Merge object values into the existing object verifying each before
merging

**Parameters**

-   `object` **Object** Schema-shaped object
-   `newValues` **Object** Object containing the values to merge into the
           object
-   `silent` **[boolean]** If true, if a parameter is invalid, it will
           be ignored rather than raising an Error
-   `options` **[Object]** Options
    -   `options.addUnknown` **[boolean]** Add unknown parameters to the
               object. If, not the parameters will be returned as errors
    -   `options.add` **[boolean]** If the parameter is an Array, add the new
               value instead of replacing the existing values

Returns **true or Array.Object** Returns true if all

# set

Set a new value to a parameter in an object shaped by a Schema

**Parameters**

-   `object` **Object** Schema-shaped object
-   `key` **string or Array.string** Parameter key of parameter to set if
           new value is validated. Use an Array of strings to set a nested
           parameter
-   `value`  New value for the parameter
-   `add` **[boolean]** If the parameter is an Array, add the new
           value instead of replacing the existing values

Returns **boolean or number** Returns false if the value failed validation or
         the parameter did not exist. Returns try if the set was
         successful. Returns the index of the new value if the parameter
         was an Array and the value was added to it

# buildDocLines

**Parameters**

-   `scheme` **Object** Object containing the scheme to build the
           documentation for
-   `schema`  
-   `pre` **string** String to prepend to the start of each parameter

# buildDocLines

Generates a JSDoc comment for the given schema.

**Parameters**

-   `options` **[Object]** Generation options
    -   `options.scope` **[string]** The string to prepend to the start of
               each parameter
    -   `options.preLine` **[string]** String to include before each line
    -   `options.wrap` **[number]** Wrap the lines at the given number of
               characters
    -   `options.tabWidth` **[number]** Your favourite tab width used to
               calculate 80 characters
    -   `options.lineup` **[boolean]** Line up broken lines with the start of
               the parameter details
-   `schema`  
-   `pre`  


# regexps

Common regular expressions that can be used the regex Schema parameter

## GIT_REF_NAME

Git reference (branches etc) name

## HOSTNAME

Hostname or domain name

## IPV4

IPv4 address

## IPV6

IPv6 address

# regexps

## GIT_REF_NAME

Git reference (branches etc) name

## HOSTNAME

Hostname or domain name

## IPV4

IPv4 address

## IPV6

IPv6 address

# regex

# setValueToSchema

**Parameters**

-   `context` **Object** Context of the validation
    -   `context.object`  The current value
    -   `context.data`  The schema to validate the data against
    -   `context.schema` **Object** The type to validate the value against
    -   `context.add` **boolean** If true and value can contain multiple values
               add the value to the existing values
    -   `context.baseSchema` **Object** The original schema, so that it can be
               used in recursive schema
-   `inMultiple` **boolean** Used to determine if have called itself to
           validate a value that can have multiple values
-   `noThrow` **boolean** If true, if a value that doesn't match the schema
           is encountered, null will be returned instead of an error being
           thrown

# setValueToType

**Parameters**

-   `context` **Object** Context of the validation
    -   `context.schema` **Object** The schema to validate the value against
    -   `context.add` **boolean** If true and value can contain multiple values
               add the value to the existing values
    -   `context.baseSchema` **Object** The original schema, so that it can be
               used in recursive schema
    -   `context.inMultiple` **boolean** Used to determine if have called itself
               to validate a value that can have multiple values
    -   `context.noThrow` **boolean** If true, if a value that doesn't match the
               schema is encountered, null will be returned instead of an error
               being thrown

Returns **** undefined if no value set, either by the existing value, the new
         value or a default value. Otherwise, the new value

# SkemedObject

**Parameters**

-   `schema` **Skemer** A schema to use for the creation of the new object
-   `data` **Object** Data to put into the new object

# Skemerd

**Parameters**

-   `schema` **Object** Schema @see SkemerSchema
-   `options` **[Object]** Skemer options @see SkemerOptions
-   `Object`  
