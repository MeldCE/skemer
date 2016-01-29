var merge = require('merge');
var clone = require('clone');
var errors = require('./errors.js');
var schemas = require('./schema.js');

var util = require('util');

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
	var t, value;
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
					thrown = true;
					//console.log('Caught a type error - not that type');
				}
			}

			if (thrown) {
				//console.log('throwing error', util.inspect(context, {depth: null}));
				throw new errors.DataTypeError('Invalid value'
						+ (context.parameterName ? ' for ' + context.parameterName : ''),
						context);
			}
		}
	} else {
		if (context.newData !== undefined) {
			// If type is null start again the original schema for the value
			if (context.schema.type === null) { // magical value to represent the schema (schema within the schema)
				// Restart with base schema
				//console.log('!!!!!!!restarting with base schema', merge({}, context, {
				//	schema: context.baseSchema
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
								var parts = [];
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
										+ context.schema.type);
							}
						}
						break;
          case 'Date':
						context.schema.type = 'date';
          case 'date':
						if (context.newData !== undefined) {
							if (typeof context.newData === context.schema.type) {
								var parts = [];

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
										+ context.schema.type);
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
										+ context.schema.type);
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
										+ ': ' + error.toString());
							}
							if (context.newData instanceof type) {
								context.data = context.newData;
							} else {
								throw new errors.DataTypeError('Value'
										+ (context.parameterName ? ' for ' + context.parameterName
										: '') + ' must be a '
										+ context.schema.type);
							}
						}
						break;
				}
			} else if (context.schema.type instanceof Object) {
				if (context.newData !== undefined) {
					if (!(context.newData instanceof Object)) {
						throw new errors.DataTypeError('Value'
								+ (context.parameterName ? ' for ' + context.parameterName : '')
								+ ' must be an object (' + typeof context.newData + ' given)');
					}


					var newData;
					if (context.data === undefined || shouldReplace(context)) {
						newData = {};
					} else {
						newData = context.data;
					}

					var newValue;
					for (t in context.schema.type) {
						//console.log('checking newData value of ' + t);
						if ((newValue = doValidateAdd(merge({}, context, {
							schema:context.schema.type[t],
							newData: context.newData[t],
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
							: '') + ' is not an object as it should be');
				}
			} else {
				if (!(context.data instanceof Array)) {
					throw new errors.DataTypeError('Existing data'
							+ (context.parameterName ? ' for ' + context.parameterName : '')
							+ ' is not an array as it should be');
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
										: '') + ' required');
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
							+ ' given)');
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
									+ typeof context.newData + ' given)');
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
										: ''));
						} else {
							throw new errors.DataItemsError('Must have between '
									+ context.schema.required.join(' and ') + ' item(s)'
										+ (context.parameterName ? ' for ' + context.parameterName
										: ''));
						}
					} else {
						throw new errors.DataItemsError('Must have atleast '
								+ context.schema.required[0] + ' item(s)'
									+ (context.parameterName ? ' for ' + context.parameterName
									: ''));
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
		if (err.extra.parameterName.startsWith('options.schema')) {
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
function validateAdd(options, data, newData) {
	//console.log('validateAdd called with ', arguments.length, 'arguments\n', arguments);

	var context = merge({}, options);

	if (context.baseSchema === undefined) {
		context.baseSchema = context.schema;
	}

	//if (newData !== undefined) {
		context.newData = newData;
		context.data = data;
	//} else {
	//	context.newData = data;
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

	//console.log('validateAdd complete', context, data);

	return data;
}

module.exports = {
	/**
	 * Add new data to data based on the stored schema.
	 *
	 * @param {Object} options An object containing options
	 * @param {Object} options.schema An Object containing a valid schema
	 *        should contain
	 * @param {...*} newData Data to validate and merge into data
	 *
	 * @returns {*} Validated and merged data
	 */
	validateNew: function (options) {
		options = validateOptions(options);

		//console.log('options after validation', util.inspect(options, {depth: null}));
		//return;
		//console.log('skemer.validateAdd called', arguments);

		return validateAdd.apply(this, [options, 
				undefined].concat(Array.prototype.slice.call(arguments, 1)));
	},

	/**
	 * Add data to an object based on a schema from the data given.
	 * NOTE: Existing data WILL NOT be validated
	 *
	 * @param {Object} options An object containing options
	 * @param {Object} options.schema An Object containing a valid schema
	 *        should contain
	 * @param {*} data Data to validate and return. If no data is given,
	 *           data containing any default values will be returned. If newData
	 *           is given, newData will be validated and merged into data.
	 * @param {...*} newData Data to validate and merge into data
	 *
	 * @returns {*} Validated and merged data
	 */
	validateAdd: function(options) {
		options = validateOptions(options);

		//console.log('options after validation', util.inspect(options, {depth: null}));
		//return;
		//console.log('skemer.validateAdd called', arguments);

		return validateAdd.apply(this,
				[options].concat(Array.prototype.slice.call(arguments, 1)));
	}
};

/**
 * Skemer prototype to enable simple reuse of a schema
 *
 * @param {Object} options An object containing options
 *
 * @class
 */
var Skemer = module.exports.Skemer = function(options) {
	// Validate options and schema
	options = validateOptions(options);

	Object.defineProperty(this, 'options', { value: options });
};

Skemer.prototype = {
	/**
	 * Add new data to data based on the stored schema.
	 *
	 * @param {...*} newData Data to validate and merge into data
	 *
	 * @returns {*} Validated and merged data
	 */
	validateNew: function () {
		return validateAdd.apply(this, [this.options,
				undefined].concat(Array.prototype.slice.call(arguments)));
	},
	
	/**
	 * Add new data to data based on the stored schema.
	 * NOTE: Existing data WILL NOT be validated
	 *
	 * @param {*} data Data to validate and return. If no data is given,
	 *           data containing any default values will be returned. If newData
	 *           is given, newData will be validated and merged into data.
	 * @param {...*} newData Data to validate and merge into data
	 *
	 * @returns {*} Validated and merged data
	 */
	validateAdd: function () {
		return validateAdd.apply(this, 
				[this.options].concat(Array.prototype.slice.call(arguments)));
	}
};
