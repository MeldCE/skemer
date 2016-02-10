var merge = require('merge');
var clone = require('clone');
var errors = require('./errors.js');
var schemas = require('./schema.js');

//var util = require('util');

/** @private
 * Returns whether a certain variable should be replaced
 *
 * @param {Object} context Context of parameter to check
 * @param {string} parameterName Name of parameter to check
 *
 * @returns {boolean} Whether any existing value should be replaced
 */
function shouldReplace(context) {
  //console.log('\nshouldReplace\n', context);
  if (context.replace instanceof Object) {
    var name = (context.parameterName !== undefined ? context.parameterName
        : '');
    //console.log('\nname is: ', name);
    if (typeof context.replace[name] === 'boolean') {
      return context.replace[name];
    }
  }
  if (typeof context.replace === 'boolean') {
    return context.replace;
  }
  if (typeof context.schema.replace === 'boolean') {
    return context.schema.replace;
  }
  return false;
}

/** @private
 * Validates a value against a certain type and returns the result. It is
 * different to (@link setValueToSchema) in that is does not handle a schema
 * with mulitple possible types instead a single type.
 *
 * @param {Object} context Context of the validation
 * @param {*} context.data The current value
 * @param {*} context.newData The schema to validate the data against
 * @param {Object} context.schema The schema to validate the value against
 * @param {boolean} context.add If true and value can contain multiple values
 *        add the value to the existing values
 * @param {Object} context.baseSchema The original schema, so that it can be
 *        used in recursive schema
 * @param {boolean} context.inMultiple Used to determine if have called itself
 *        to validate a value that can have multiple values
 *
 * @throws {ValueError} When the new value (given in context.data) is not of
 *         the given type
 *
 * @returns {*} undefined if no value set, either by the existing value, the
 *          new value or a default value. Otherwise, the new value
 */
function setValueToType(context) {
  var t, value, parts;
  //console.log('\nsetValueToType', util.inspect(context, {depth: null}));
  if (context.schema.types) {
    //console.log('have types, checking for value', context.schema, context.newData);
    // Return default value if we don't have a value
    if (context.newData !== undefined) {
      //console.log('have types and a value', context.schema, context.newData);
      //if (schema.type && schema.type instanceof Array) {
      //}

      // Go through possible types and return first one that returns a value
      var thrown;
      for (t in context.schema.types) {
        thrown = false;
        //console.log('checking type ' + t + ' for ' + context.parameterName, context.schema.types[t]);
        try {
          if ((value = doValidateAdd(merge({}, context, {
                data: undefined,
                schema: context.schema.types[t]
              }))) !== undefined) {
            //console.log('success', value);
            context.data = value;
            //console.log(util.inspect(context, {depth: null}));
            return context.data;
          }
        } catch(err) {
          //console.log('types error thrown', err);
          if (!(err instanceof errors.DataTypeError)) {
            //console.log('error is not a DataTypeError - rethrowing');
            throw err;
          }
          thrown = err;
          //console.log('Caught a type error - not that type');
        }
      }

      if (thrown) {
        //console.log('throwing error', util.inspect(context, {depth: null}));
        //console.log(context);
        throw new errors.DataTypeError(typeof context.newData + ' value is '
            + 'not allowed' + (thrown.extra && thrown.extra.parameterName ?
            ' for ' + thrown.extra.parameterName : (context.parameterName ? 
            ' for ' + context.parameterName : '')), context);
      }
    }
  } else {
    if (context.schema.type instanceof Object) {
      if (context.newData !== undefined || context.schema.required) {
        if (!(context.schema.required && context.newData === undefined)
            && !(context.newData instanceof Object)) {
          throw new errors.DataTypeError('Value'
              + (context.parameterName ? ' for ' + context.parameterName : '')
              + ' must be an object (' + typeof context.newData + ' given)',
              context);
        }

        //console.log('\nstart', context);

        var newData;
        if (context.data === undefined
            || (shouldReplace(context) && context.newData !== undefined)) {
          newData = {};
        } else {
          newData = context.data;
        }

        var newValue;
        for (t in context.schema.type) {
          //console.log('checking newData value of ' + t);
          if ((newValue = doValidateAdd(merge({}, context, {
            schema:context.schema.type[t],
            newData: (context.newData ? context.newData[t] : undefined),
            data: newData[t],
            parameterName: (context.parameterName ? context.parameterName + '.'
                : '') + t
          }))) !== undefined) {
            newData[t] = newValue;
          }
        }

        if (Object.keys(newData).length || context.newData !== undefined) {
          context.data = newData;
        }
      }
    } else if (context.newData !== undefined) {
      // If type is null start again the original schema for the value
      if (context.schema.type === null) { // magical value to represent the schema (schema within the schema)
        // Restart with base schema
        //console.log('!!!!!!!restarting with base schema', merge({}, context, {
        //  schema: context.baseSchema
        //}));

        if ((value = doValidateAdd(merge({}, context, {
          schema: context.baseSchema
        }))) !== undefined) {
          context.data = value;
          //console.log('got a value from null schema', util.inspect(context, {depth: null}));
        }
      } else if (typeof context.schema.type === 'string') { // A simple type or instance of a certain prototype
        //console.log('type given as string', context.schema.type);
        switch (context.schema.type) {
          case 'any':
            if (context.newData !== undefined) {
              context.data = context.newData;
            }
            break;
          case 'Number':
          case 'String':
          case 'Boolean':
          case 'Function':
            // Change Function (prototype) to function (typeof)
            context.schema.type = context.schema.type.toLowerCase();
          case 'function':
          case 'number':
          case 'string':
          case 'boolean':
            if (context.newData !== undefined) {
              if (typeof context.newData === context.schema.type) {
                parts = [];
                
                // Validate string against regex if we have one
                if (context.schema.type === 'string' && context.schema.regex
                    && !context.schema.regex.test(context.newData)) {
                  throw new errors.DataInvalidError('Value of \''
                      + context.newData + '\'' + (context.parameterName ?
                      ' for ' + context.parameterName : '') + ' does not meet '
                      + 'the required pattern of '
                      + context.schema.regex.toString(), context);
                }
                // Validate new value against values if have them
                if ((context.schema.type === 'number'
                    || context.schema.type === 'string')
                    && context.schema.values
                    && context.schema.values.indexOf(context.newData) === -1) {
                  throw new errors.DataInvalidError('Value of \''
                      + context.newData + '\'' + (context.parameterName ?
                      ' for ' + context.parameterName : '') + ' is not one '
                      + 'of the allowed values ('
                      + context.schema.values.join(', ') + ')', context);
                }

                // Check number range or string length if have min/max
                if (context.schema.type === 'number') {
                  if ((context.schema.min !== undefined
                      && context.newData < context.schema.min)
                      || (context.schema.max !== undefined
                      && context.newData >= context.schema.max)) {
                    if (context.schema.min !== undefined) {
                      parts.push('greater than or equal to '
                          + context.schema.min);
                    }
                    if (context.schema.max !== undefined) {
                      parts.push('less than ' + context.schema.max);
                    }
                    throw new errors.DataRangeError('Value'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : '') + ' must be '
                        + parts.join(' and '), context);
                  }
                } else if (context.schema.type === 'string') {
                  if ((context.schema.min !== undefined
                      && context.newData.length < context.schema.min)
                      || (context.schema.max !== undefined
                      && context.newData.length > context.schema.max)) {
                    if (context.schema.min !== undefined) {
                      parts.push('atleast ' + context.schema.min
                          + ' characters');
                    }
                    if (context.schema.max !== undefined) {
                      parts.push('no more than ' + context.schema.max
                          + ' characters');
                    }
                    throw new errors.DataRangeError('Value'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : '') + ' must be '
                        + parts.join(' and '), context);
                  }
                }

                context.data = context.newData;
              } else {
                throw new errors.DataTypeError('Value'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : '') + ' must be a '
                    + context.schema.type, context);
              }
            }
            break;
          case 'Date':
            context.schema.type = 'date';
          case 'date':
            if (context.newData !== undefined) {
                if (context.newData instanceof Date) {
                parts = [];

                if ((context.schema.min !== undefined
                    && context.newData < context.schema.min)
                    || (context.schema.max !== undefined
                    && context.newData >= context.schema.max)) {
                  if (context.schema.min !== undefined) {
                    parts.push('at or after '
                        + context.schema.min);
                  }
                  if (context.schema.max !== undefined) {
                    parts.push('before ' + context.schema.max);
                  }
                  throw new errors.DataRangeError('Value'
                  + (context.parameterName ? ' for ' + context.parameterName
                  : '') + ' must be '
                      + parts.join(' and '), context);
                }

                context.data = context.newData;
              } else {
                throw new errors.DataTypeError('Value'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : '') + ' must be a '
                    + context.schema.type, context);
              }
            }
            break;
          case 'Null':
            context.schema.type = 'null';
          case 'null':
            if (context.newData !== undefined) {
              if (context.newData === null) {
                context.data = null;
              } else {
                throw new errors.DataTypeError('Value'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : '') + ' must be a '
                    + context.schema.type, context);
              }
            }
            break;
          default: /// @TODO Think of a safer way of doing this
            if (context.newData !== undefined) {
              var type;
              try {
                type = eval(context.schema.type);
              } catch(error) {
                throw new errors.SchemaError('Error determining type to test ' 
                    + 'against'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : '')
                    + ': ' + error.toString(), context);
              }
              if (context.newData instanceof type) {
                context.data = context.newData;
              } else {
                throw new errors.DataTypeError('Value'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : '') + ' must be a '
                    + context.schema.type, context);
              }
            }
            break;
        }
      }
    }
  }

  if (context.data === undefined
      && context.schema.default !== undefined) {
    /// @TODO Should we be checking the baseSchema default value as well?
    context.data = context.schema.default;
  }

  if (context.data === undefined && context.schema.required) {
    throw new errors.DataRequiredError('Value'
        + (context.parameterName ? ' for ' + context.parameterName : '')
        + ' required', context);
  }

  return context.data;
}

/** @private
 *
 * Add data to an object based on a schema from the data given.
 *
 * @param {Object} context An Object containing the context of the call.
 * @param {*} context.data The current value
 * @param {*} context.newData The schema to validate the data against
 * @param {Object} context.type The type to validate the value against
 * @param {boolean} context.add If true and value can contain multiple values
 *        add the value to the existing values
 * @param {Object} context.baseSchema The original schema, so that it can be
 *        used in recursive schema
 * @param {boolean} context.inMultiple Used to determine if have called itself
 *        to validate a value that can have multiple values
 * @param {boolean} inMultiple Flag to tell whether have called itself while
 *        handling a multiple value variable
 *
 * @returns {boolean} True if any data was added to the object
 */
function doValidateAdd(context, inMultiple) {
  //console.log('doValidateAdd', util.inspect(context, {depth: null}), inMultiple);

  if (!inMultiple && context.schema.multiple) {
    //console.log('should have multiple values');

    if (context.data !== undefined) {
      if (context.schema.object) {
        if (!(context.data instanceof Object)) {
          throw new errors.DataTypeError('Existing data'
              + (context.parameterName ? ' for ' + context.parameterName 
              : '') + ' is not an object as it should be', context);
        }
      } else {
        if (!(context.data instanceof Array)) {
          throw new errors.DataTypeError('Existing data'
              + (context.parameterName ? ' for ' + context.parameterName : '')
              + ' is not an array as it should be', context);
        }
      }
    }

    if (context.newData === undefined) {
      if (context.data !== undefined) {
        return context.data;
      } else if (context.schema.default) {
        return (context.data = clone(context.schema.default));
      } else {
        if (context.schema.required) {
          throw new errors.DataRequiredError('Value' + (context.parameterName
              ? ' for ' + context.parameterName
                    : '') + ' required', context);
        }
        return undefined;
      }
    }

    if (context.schema.object) {
      //console.log('store in object');
      if (context.newData) {
        // Throw if we don't have an Object
        if (!(context.newData instanceof Object)) {
          throw new errors.DataTypeError('Value'
              + (context.parameterName ? ' for ' + context.parameterName : '')
              + ' must be an object of values (' + typeof context.newData
              + ' given)', context);
        }
        var newData;
        if (context.data === undefined || shouldReplace(context)) {
          newData = {};
        } else {
          newData = context.data;
        }

        var o, newDataPart;

        for (o in context.newData) {
          //console.log('looking at ' + o + ' in newData');
          if ((newDataPart = doValidateAdd(merge({}, context, {
                newData: context.newData[o],
                data: newData[o],
                parameterName: (context.parameterName ? context.parameterName
                    + '.' : '') + o
              }), true)) !== undefined) {
            newData[o] = newDataPart;
          }
        }

        if (Object.keys(newData).length || context.newData !== undefined) {
          context.data = newData;
        }
      }
    } else {
      //console.log('store in array');
      // Throw if we don't have an Array
      if (!(context.newData instanceof Array)) {
        //console.log(context);
        throw new errors.DataTypeError('Value'
                  + (context.parameterName ? ' for ' + context.parameterName
                  : '') + ' must be an array of values (' 
                  + typeof context.newData + ' given)', context);
      }

      //let newData;
      //console.log(context.data);
      if (context.data === undefined || shouldReplace(context)) {
        //console.log('currently undefined, creating array');
        newData = [];
      } else {
        //console.log('have a value already');
        newData = context.data;
      }

      //let o, newDataPart;

      for (o in context.newData) {
        if ((newDataPart = doValidateAdd(merge({}, context, {
              newData: context.newData[o],
              data: undefined,
              parameterName: (context.parameterName ? context.parameterName
                  + '.' : '') + o
            }), true)) !== undefined) {
          newData.push(newDataPart);
        }
      }

      context.data = newData;

      if (context.schema.required) {
        if (context.schema.required instanceof Array
            && (context.data.length < context.schema.required[0]
            || (context.schema.required.length == 2
            && context.data.length > context.schema.required[1]))) {
          if (context.schema.required.length == 2) {
            if (context.schema.required[0] === context.schema.required[1]) {
              throw new errors.DataItemsError('Must have exactly '
                  + context.schema.required[0] + ' item(s)'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : ''), context);
            } else {
              throw new errors.DataItemsError('Must have between '
                  + context.schema.required.join(' and ') + ' item(s)'
                    + (context.parameterName ? ' for ' + context.parameterName
                    : ''), context);
            }
          } else {
            throw new errors.DataItemsError('Must have atleast '
                + context.schema.required[0] + ' item(s)'
                  + (context.parameterName ? ' for ' + context.parameterName
                  : ''), context);
          }
        }

      }
    }
  } else {
    return setValueToType(context);
  }

  return context.data;
}

/** @private
 *
 * Validates the given options Object
 *
 * @param {Object} options Options Object to validate
 *
 * @returns {undefined}
 */
function validateOptions(options) {
  // Validate the schema
  try {
    //console.log(schemas.options);
    return doValidateAdd({
      parameterName: 'options',
      schema: schemas.options,
      newData: options,
      baseSchema: schemas.schema
    });
  } catch (err) {
    // @TODO Add test to see if it was a schema problem rather than options
    //console.log(err);
    if (err.extra && err.extra.parameterName.startsWith('options.schema')) {
      throw new errors.SchemaError(err.message, err.extra);
    }
    throw new errors.OptionsError(err.message, err.extra);
  }
}

/** @private
 *
 * Adds new data to the existing data based on the given schema.
 * 
 *
 * @param {Object} options An object containing options
 * @param {Object} options.schema An Object containing a valid schema
 *        should contain
 * @param {*} data Data to validate and return. If no data is given,
 *           data containing any default values will be returned. If newData
 *           is given, newData will be validated and merged into data.
 * @param {...*} newData, ... Data to validate and merge into data
 *
 * @returns {*} Validated and merged data
 */
function validateData(options, data, newData) {
  //console.log('validateData called with ', arguments.length, 'arguments\n', 
  //    util.inspect(arguments, {depth: null}));

  var context = merge({}, options);

  if (context.baseSchema === undefined) {
    context.baseSchema = context.schema;
  }

  //if (newData !== undefined) {
    context.newData = newData;
    context.data = data;
  //} else {
  //  context.newData = data;
  //}

  //console.log('about to start', context);
  data = doValidateAdd(context);
  var i;

  //console.log('after initial data load, data is: ', context.data, '\n', context);

  if (arguments.length > 3) {
    //console.log('have more than two datas');
    for (i = 3; i < arguments.length; i++) {
      //build context
      context.newData = arguments[i];
      data = doValidateAdd(context);
      //console.log('after handling data', i, 'data is', context.data);
    }
  }

  //console.log('validateData complete', context, data);

  return data;
}

/** @private
 *
 * Converts the schema type value into a JSDoc type string WITHOUT the curly
 * braces.
 *
 * @param {*} schema Schema to return type value of
 *
 * @returns {String} JSDoc string of type
 */
function typeToJsDocString(schema) {
  //console.log(schema.type);
  if (schema.docType) {
    return schema.docType;
  }
  
  if (typeof schema.type === 'string') {
    switch (schema.type) {
      /* TODO Implement as @callback
      case 'Function':
      case 'function':
        if (schema.doc && schema.doc.parameters) {
          return 'function'; // + (Object.keys(schema.doc.parameters)).join(', ')
          //    + ')';
        } else {
          return 'function';
        }*/
      case 'any':
        return '*';
      default:
        return schema.type;
    }
  } else if (schema.type === null) {
    return 'schema';
  } else if (schema.type instanceof Object) {
    return 'Object';
  }
}

/** @private
 * Builds line of JSDoc for the given schema
 *
 * @param {Object} schema Schema to build the schema for
 * @param {Object} options Options for building JSDoc
 * @param {Boolean} [parameter] Whether or not schema is for a parameter (if
 *        not, will return @type instead of @param
 * @param {String} [name] Name of object building JSDoc for
 *
 * @returns {Array} Array of string lines containing the JSDoc schema
 */
function buildLines(schema, options, parameter, name) {
  var line, lines = [], type = '', defaultValue;
  //console.log('buildLines called', util.inspect(arguments, { deep: null }));

  if (name === undefined) {
    //console.log('no name\n', options, options.name);
    if (options.name !== undefined) {
      //console.log('have a name\n');
      name = options.name;
    } else {
      name = '';
    }
  }

  //console.log('name is', name);
  if (schema.types) {
    type = [];
    var t, tType;

    for (t in schema.types) {
      tType = typeToJsDocString(schema.types[t]);

      if (schema.types[t].multiple) {
        // JsDoc can't handle {}
        //if (schema.types[t].object) {
        //  tType = tType + '{}';
        //} else {
          tType = tType + '[]';
        //}
      }
      type.push(tType);
    }
    type = '{(' + type.join('|') + ')}';
  } else {
    type = typeToJsDocString(schema);

    if (schema.multiple) {
      // JsDoc can't handle {}
      //if (schema.object) {
      //  type = type + '{}';
      //} else {
        type = type + '[]';
      //}
    }
    
    type = '{' + type + '}';
  }

  if (parameter) {
    line = '@' + options.type + ' ' + type;

    if (name) {
      if (schema.default) {
        switch (typeof schema.default) {
          case 'object':
            defaultValue = '';
            break;
          case 'boolean':
            defaultValue = '=' + (schema.default ? 'true' : 'false');
            break;
          case 'string':
            defaultValue = '=\'' + schema.default + '\'';
            break;
          default:
            defaultValue = '=' + schema.default;
            break;
        }
      } else {
        defaultValue = '';
      }
      if (schema.required) {
        line += ' ' + name + defaultValue;
      } else {
        line += ' [' + name + defaultValue + ']';
      }
    }
    
    if (schema.doc) {
      line += ' ' + schema.doc;
    }

    lines.push(line);
  } else {
    if (schema.doc) {
      lines.push(schema.doc);
      lines.push('');
    }

    if (!(schema.type instanceof Object)) {
      lines.push('@type ' + type + (name ? ' ' + name : ''));
    }
  }

  if (schema.type instanceof Object && !schema.noDocDig) {
    var o;
    for (o in schema.type) {
      lines = lines.concat(buildLines(schema.type[o], options, true,
          (name ? name + '.' : '') + o));
    }
  }

  //console.log('returning', lines);
  return lines;
}

/**
 * Validate and merge new data based on the given schema.
 *
 * @param {Object} options An object containing the validation
 *        [`options`]{@link #options}, including the [`schema`]{@link #schema}
 * @param {...*} newData Data to validate, merge and return
 *
 * @returns {*} Validated and merged data
 */
function validateNew(options) {
  options = validateOptions(options);

  //console.log('options after validation', util.inspect(options, {depth: null}));
  //return;
  //console.log('skemer.validateAdd called', arguments);

  return validateData.apply(this, [options, 
      undefined].concat(Array.prototype.slice.call(arguments, 1)));
}

/** @private @deprecated
 * Get a promise to validate and merge new data base on the given schema.
 *
 * @param {Object} options An object containing the validation
 *        [`options`]{@link #options}, including the [`schema`]{@link #schema}
 * @param {...*} newData Data to validate, merge and return
 *
 * @returns {Promise} A Promise that will resolve to the validated and
 *          merged data
 */
function promiseValidateNew() {
  void 0;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    try {
      resolve(validateNew.apply(this, args));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Validata and add new data to existing validated data based on the given
 * schema. NOTE: Existing data WILL NOT be validated
 *
 * @param {Object} options An object containing the validation
 *        [`options`]{@link #options}, including the [`schema`]{@link #schema}
 * @param {*} data Data to validate and return. If no data is given,
 *        data containing any default values will be returned. If newData
 *        is given, newData will be validated and merged into data.
 * @param {...*} newData Data to validate and merge into `data`
 *
 * @returns {*} Validated and merged data
 */
function validateAdd(options) {
  options = validateOptions(options);

  //console.log('options after validation', util.inspect(options, {depth: null}));
  //return;
  //console.log('skemer.validateAdd called', arguments);

  return validateData.apply(this,
      [options].concat(Array.prototype.slice.call(arguments, 1)));
}

/** @private @deprecated
 * Get a promise to validata and add new data to existing validated data based
 * on the given schema. NOTE: Existing data WILL NOT be validated
 *
 * @param {Object} options An object containing the validation
 *        [`options`]{@link #options}, including the [`schema`]{@link #schema}
 * @param {*} data Data to validate and return. If no data is given,
 *        data containing any default values will be returned. If newData
 *        is given, newData will be validated and merged into data.
 * @param {...*} newData Data to validate and merge into `data`
 *
 * @returns {Promise} A Promise that will resolve to the validated and
 *          merged data
 */
function promiseValidateAdd() {
  void 0;
  var args = arguments;
  return new Promise(function(resolve, reject) {
    try {
      resolve(validateAdd.apply(this, args));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Build a JSDoc for a variable using the given {@link schema}.
 *
 * @param {Object} schema An Object containing a valid
 *        [schema]{@link #schema}
 * @param {Object} options An Object containing build options
 %%buildJsDocOptions%%
 *
 * @returns {string} A string containing the JSDoc for the given schema
 */
function buildJsDocs(schema, options) {
  //console.log('skemer.buildJsDocs called', util.inspect(arguments));
  
  // Validate schema
  schema = validateData({
    schema: schemas.schema,
    keepNull: true
  }, {}, schema);

  // Validate options
  options = validateData({
    schema: schemas.buildDocOptions
  }, {}, {}, options);

  //console.log('\n\noptions are', options);

  var doc = '';

  var tw = options.tabWidth;
  var c, s, w, line, l;
  var lines = buildLines(schema, options, options.parameter);
  var block;

  if (options.wrap) {
    for (l in lines) {
      line = options.preLine + lines[l];

      c = 0;
      s = 0;
      w = 0;

      // Find length of jsdoc tag
      if (options.lineup) {
        if ((block = line.match(/@\S+/))) {
          block = Array(block[0].length + 1).join(' ');
        } else {
          block = Array(3).join(' ');
        }
      }

      while (c < line.length) {
        if (line[c] === ' ') {
          s = c;
        } else if (line[c] === "\t") {
          w += tw - 1;
          s = c;
        }
        w++;
        if (w > options.wrap) {
          // @TODO test that s does not equal 0
          doc += line.slice(0, s) + "\n";
          line = options.preLine + (options.lineup ? block : '')
              + line.slice(s);
          c = 0;
          s = 0;
          w = 0;
        } else {
          c++;
        }
      }
      if (line) {
        doc += line + "\n";
      }
    }
  } else {
    doc = lines.join("\n");
  }

  return doc;
}

/** @private @deprecated
 * Get a promise to build a JSDoc for a variable using the given
 * {@link schema}.
 *
 * @param {Object} schema An Object containing a valid
 *        [schema]{@link #schema}
 * @param {Object} options An Object containing build options
 %%buildJsDocOptions%%
 *
 * @returns {Promise} A promise that will resolve to a string containing the
 *          JSDoc for the given schema
 */
function promiseBuildJsDocs(schema, options) {
  void 0;
  return new Promise(function(resolve, reject) {
    try {
      resolve(buildJsDocs(schema, options));
    } catch (err) {
      reject(err);
    }
  });
}

/**
 * Skemer prototype to enable simple reuse of a schema
 *
 * @param {Object} options An object containing the validation
 *        [options]{@link #options}, including the [schema]{@link #schema}
 *
 * @class
 */
function Skemer(options) {
  // Validate options and schema
  options = validateOptions(options);

  Object.defineProperty(this, 'options', { value: options });
}

Skemer.prototype = {
  /**
   * Validate and merge new data based on the stored schema.
   *
   * @param {...*} newData Data to validate, merge and return. If no data is
   *        given, a variable containing any default values, if configured,
   *        will be returned.
   *
   * @returns {*} Validated and merged data
   */
  validateNew: function () {
    return validateData.apply(this, [this.options,
        undefined].concat(Array.prototype.slice.call(arguments)));
  },
  
  /** @private @deprecated
   * Get a promise to validate and merge new data based on the
   * stored schema.
   *
   * @param {...*} newData Data to validate, merge and return. If no data is
   *        given, a variable containing any default values, if configured,
   *        will be returned.
   *
   * @returns {Promise} A promise that will resolve to the validated and
   *          merged data
   */
  promiseValidateNew: function () {
    void 0;
    var args = arguments;
    return new Promise(function(resolve, reject) {
      try {
        resolve(validateData.apply(this, [this.options,
            undefined].concat(Array.prototype.slice.call(args))));
      } catch(err) {
        reject(err);
      }
    }.bind(this));
  },
  
  /**
   * Add new data to existing validated data based on the stored schema.
   * NOTE: Existing data WILL NOT be validated
   *
   * @param {*} data Existing data to merge new data into.
   * @param {...*} newData Data to validate and merge into the existing data.
   *
   * @returns {*} Validated and merged data
   */
  validateAdd: function () {
    return validateData.apply(this, 
        [this.options].concat(Array.prototype.slice.call(arguments)));
  },
  
  /** @private @deprecated
   * Get a promise to add new data to exsiting validated data based on the
   * stored schema. NOTE: Existing data WILL NOT be validated
   *
   * @param {*} data Existing data to merge new data into.
   * @param {...*} newData Data to validate and merge into the existing data.
   *
   * @returns {Promise} A promise that will resolve to the validated and
   *          merged data
   */
  promiseValidateAdd: function () {
    void 0;
    var args = arguments;
    return new Promise(function(resolve, reject) {
      try {
        resolve(validateData.apply(this, 
            [this.options].concat(Array.prototype.slice.call(args))));
      } catch(err) {
        reject(err);
      }
    }.bind(this));
  }
};

module.exports = {
  Skemer: Skemer,
  validateNew: validateNew,
  promiseValidateNew: promiseValidateNew,
  validateAdd: validateAdd,
  promiseValidateAdd: promiseValidateAdd,
  buildJsDocs: buildJsDocs,
  promiseBuildJsDocs: promiseBuildJsDocs
};


