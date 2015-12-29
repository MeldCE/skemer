var merge = require('merge');
var clone = require('clone');
var errors = require('./errors.js');
var schemas = require('./schema.js');

/** @private
 * Returns whether a certain variable should be replaced
 *
 * @param {Object} context Context of parameter to check
 * @param {string} parameterName Name of parameter to check
 *
 * @returns {boolean}
 */
function shouldReplace(context) {
	if (context.replace instanceof Object
			&& typeof context.parameterName === 'string') {
		if (typeof context.replace[context.parameterName] === 'boolean') {
			return context.replace[context.parameterName];
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
 * @param {} context.data The current value
 * @param {} context.newData The schema to validate the data against
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
 * @returns undefined if no value set, either by the existing value, the new
 *          value or a default value. Otherwise, the new value
 */
function setValueToType(context) {
	//console.log('\nsetValueToType', context);
	
	// If type is null start again the original schema for the value
	if (context.schema.type === null) { // magical value to represent the schema (schema within the schema)
		// Restart with base schema
		//console.log('!!!!!!!restarting with base schema', merge({}, context, {
		//	schema: context.baseSchema
		//}));

		doValidateAdd(merge({}, context, {
			schema: context.baseSchema
		}));
		//console.log('after null diving, value is', context.data);
		return context.data;
	} else {
		if (typeof context.schema.type === 'string') { // A simple type or instance of a certain prototype
			//console.log('type given as string', context.schema.type);
			switch (context.schema.type) {
				case 'number':
				case 'string':
				case 'boolean':
					if (context.newData !== undefined) {
						if (typeof context.newData === context.schema.type) {
							return context.newData;
						} else {
							throw new errors.DataTypeError('Value of '
									+ context.parameterName + ' should be a '
									+ context.schema.type);
						}
					} else if (context.data === undefined
							&& context.schema.default !== undefined) {
						return context.schema.default;
					}
					break;
				case 'null':
				case 'Null':
					if (context.newData !== undefined) {
						if (context.newData === null) {
							return null;
						} else {
							throw new errors.DataTypeError('Value of '
									+ context.parameterName + ' should be a '
									+ context.schema.type);
						}
					} else if (context.data === undefined
							&& context.schema.default !== undefined) {
						return context.schema.default;
					}
					break;
				default: /// @TODO Think of a safer way of doing this
					try {
						if (context.newData !== undefined) {
							if (context.newData instanceof eval(context.schema.type)) {
								return context.newData;
							} else {
								throw new errors.DataTypeError('Value of '
										+ context.parameterName + ' should be a '
										+ context.schema.type);
							}
							return context.newData;
						} else if (context.data === undefined
								&& context.schema.default !== undefined) {
							return context.schema.default;
						}
					} catch(error) {
						// Check and throw error if eval(context.schema.type) caused error
						throw error;
					}
					break;
			}
		} else if (context.schema.type instanceof Object) {

			if (context.newData === undefined) {
				if (context.data === undefined) {
					if (context.schema.default !== undefined) {
						return (context.data = context.schema.default);
					}
				} else {
					return context.data;
				}
				return undefined;
			}

			if (!(context.newData instanceof Object)) {
				throw new errors.DataTypeError('Value of '
						+ context.parameterName + ' should be an Object');
			}


			var newData;
			if (context.data === undefined) {
				newData = {};
			} else {
				newData = context.data;
			}

			var t, newValue;
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

			if (Object.keys(newData).length !== 0
					|| (context.data === undefined && context.newData !== undefined)) {
				return (context.data = newData);
			} else {
				return context.data;
			}
		}
	}

	return context.data;
}

/** @private
 *
 * Add data to an object based on a schema from the data given.
 *
 * @param {Object} context An Object containing the context of the call.
 * @param {} context.data The current value
 * @param {} context.newData The schema to validate the data against
 * @param {Object} context.type The type to validate the value against
 * @param {boolean} context.add If true and value can contain multiple values
 *        add the value to the existing values
 * @param {Object} context.baseSchema The original schema, so that it can be
 *        used in recursive schema
 * @param {boolean} context.inMultiple Used to determine if have called itself
 *        to validate a value that can have multiple values
 *
 * @returns {boolean} True if any data was added to the object
 */
function doValidateAdd(context, inMultiple) {
	console.log('doValidateAdd', context, inMultiple);

	if (!inMultiple && context.schema.multiple) {
		//console.log('should have multiple values');

		if (context.newData === undefined) {
			if (context.data) {
				return context.data;
			} else if (context.schema.default) {
				return (context.data = clone(context.schema.default));
			} else {
				return undefined;
			}
		}

		if (context.schema.object) {
			//console.log('store in object');
			if (context.newData) {
				// Throw if we don't have an Object
				if (!(context.newData instanceof Object)) {
					throw new errors.TypeError(context.parameter + 'must be an ' +
							+ 'object of values (' + typeof context.newData + ' given)');
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

				if (Object.keys(newData).length) {
					context.data = newData;
				}
			}
		} else {
			//console.log('store in array');
			// Throw if we don't have an Array
			if (!(context.newData instanceof Array)) {
				//console.log(context);
				throw new errors.DataTypeError(context.parameter + 'must be '
						+ 'an array of values (' + typeof context.newData + ' given)');
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

			if (newData.length) {
				context.data = newData;
			}
		}
	} else {
		if (context.schema.types) {
			console.log('have types, checking for value', context.schema, context.newData);
			// Return default value if we don't have a value
			if (context.newData === undefined) {
				if (context.data) {
					return context.data;
				} else if (context.schema.default) {
					context.data = merge(true, context.schema.default);
				} else {
					return undefined;
				}
			}

			console.log('have types and a value', context.schema, context.newData);
			//if (schema.type && schema.type instanceof Array) {
			//}

			// Go through possible types and return first one that returns a value
			var t, value, validData = false;
			for (t in context.schema.types) {
				console.log('checking type ' + t + ' for ' + context.parameterName);
				try {
					if ((value = setValueToType(merge({}, context, {
								data: undefined,
								schema: context.schema.types[t]
							}))) !== undefined) {
						//console.log('success', value);
						return context.data = value;
					}
				} catch(err) {
					if (!(err instanceof errors.DataTypeError)) {
						throw err;
					}
					//console.log('Caught a type error - not that type');
				}
			}

			throw new errors.DataTypeError('invalid value for '
					+ context.parameterName);
		} else {
			return setValueToType(context);
		}
	}

	return context.data;
}

/** @private
 *
 * Validates the given options Object
 *
 * @param {Object} options Options Object to validate
 */
function validateOptions(options) {
	// Validate the schema
	//try {
		console.log(schemas.options);
		return doValidateAdd({
			schema: schemas.options,
			newData: options,
			baseSchema: schemas.schema
		});
	//} catch (err) {
	//	console.log(err);
	//	throw new errors.OptionsError(err.msg);
	//}
}

module.exports = {};

/**
 * Add data to an object based on a schema from the data given.
 *
 * @param {Object} options An object containing options
 * @param {Object} options.schema An Object containing a valid schema
 *        should contain
 * @param {} data Data to validate and return. If no data is given,
 *           data containing any default values will be returned. If newData
 *           is given, newData will be validated and merged into data.
 * @param {} newData, ... Data to validate and merge into data
 *
 * @returns {} Validated and merged data
 */
var validateAdd = module.exports.validateAdd
		= function(options, data, newData) {
	
	// @TODO Properly validate options
	if (!options.schema) {
		throw new errors.SchemaError('Need a schema');
	}
	
	options = validateOptions(options);

	//console.log('doValidateAdd called with ', arguments.length, 'arguments\n', options);

	var context = merge({}, options);

	if (context.baseSchema === undefined) {
		context.baseSchema = context.schema;
	}

	if (newData !== undefined) {
		context.newData = newData;
		context.data = data;
	} else {
		context.newData = data;
	}

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
};

var Skemer = module.exports.Skemer = function(options) {
	// Validate options and schema
	options = validateOptions(options);

	Object.defineProperty(this, 'options', { value: options });
};

Skemer.prototype = {
	validateAdd: {}
};
