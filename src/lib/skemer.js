var merge = require('merge');
var skemerErrors = require('./errors.js');

/** @internal
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
 * @param {boolean} context.noThrow If true, if a value that doesn't match the
 *        schema is encountered, null will be returned instead of an error
 *        being thrown
 *
 * @throws {ValueError} When the new value (given in context.data) is not of
 *         the given type
 *
 * @returns undefined if no value set, either by the existing value, the new
 *          value or a default value. Otherwise, the new value
 */
function setValueToType(context) {
	console.log('\nsetValueToType', context);
	// If type is null start again the original schema for the value
	if (context.schema.type === null) { // magical value to represent the schema (schema within the schema)
		// Restart with base schema
		console.log('!!!!!!!restarting with base schema', merge({}, context, {
			schema: context.baseSchema
		}));

		validateAddData(merge({}, context, {
			schema: context.baseSchema
		}));
		console.log('after null diving, value is', context.data);
		return context.data;
	} else {
		if (typeof context.schema.type === 'string') { // A simple type or instance of a certain prototype
			console.log('type given as string', context.schema.type);
			switch (context.schema.type) {
				case 'number':
				case 'string':
				case 'boolean':
					if (context.newData !== undefined) {
						if (typeof context.newData === context.schema.type) {
							return context.newData;
						} else if (!context.noThrow) {
							throw new skemerErrors.DataTypeError('Value of '
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
						} else if (!context.noThrow) {
							throw new skemerErrors.DataTypeError('Value of '
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
							} else if (!context.noThrow) {
								throw new skemerErrors.DataTypeError('Value of '
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
			console.log('have a sub schema');
			if (context.newData === undefined) {
				if (context.data === undefined
						&& context.schema.default !== undefined) {
					return (context.data = context.schema.default);
				} else {
					return undefined;
				}
			}


			var newData;
			if (context.data === undefined) {
				newData = {};
			} else {
				newData = context.data;
			}

			var t, newValue;
			for (t in context.schema.type) {
				console.log('checking newData value of ' + t);
				if ((newValue = validateAddData(merge({}, context, {
					schema:context.schema.type[t],
					newData: context.newData[t],
					data: newData[t],
					parameterName: (context.parameterName ? context.parameterName + '.'
							: '') + t
				}))) !== undefined) {
					newData[t] = newValue;
				}
			}

			if (Object.keys(newData).length !== 0) {
				return (context.data = newData);
			} else {
				return context.data;
			}
		}
	}

	return context.data;
}

/** @internal
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
 * @param {boolean} context.noThrow If true, if a value that doesn't match the
 *        schema is encountered, null will be returned instead of an error
 *        being thrown
 *
 * @returns {boolean} True if any data was added to the object
 */
function validateAddData(context, inMultiple) {
	console.log('validateAddData', context, inMultiple);
	
	var dataUndefined = (context.data === undefined);

	if (!inMultiple && context.schema.multiple) {
		console.log('should have multiple values');
		
		if (context.newData === undefined) {
			return undefined;
		}
		
		if (context.schema.object) {
			console.log('store in object');
			if (context.newData) {
				// Throw if we don't have an Object
				if (!(context.newData instanceof Object)) {
					throw new skemerErrors.TypeError(context.parameter + 'must be an ' +
							+ 'object of values (' + typeof context.newData + ' given)');
				}
				var newData;
				if (context.data === undefined || context.schema.replace) {
					newData = {};
				} else {
					newData = context.data;
				}

				var o, newDataPart;

				for (o in context.newData) {
					console.log('looking at ' + o + ' in newData');
					if ((newDataPart = validateAddData(merge({}, context, {
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
			console.log('store in array');
			// Throw if we don't have an Array
			if (!(context.newData instanceof Array)) {
				throw new skemerErrors.DataTypeError(context.parameter + 'must be '
						+ 'an array of values (' + typeof context.newData + ' given)');
			}

			//let newData;
			console.log(context.data);
			if (context.data === undefined || context.schema.replace) {
				console.log('currently undefined, creating array');
				newData = [];
			} else {
				console.log('have a value already');
				newData = context.data;
			}

			//let o, newDataPart;

			for (o in context.newData) {
				if ((newDataPart = validateAddData(merge({}, context, {
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
				if (context.schema.default) {
					/// @TODO Deep copy
					console.log('no value, returning default');
					return context.schema.default;
				} else {
					console.log('no value, ignoring');
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
						console.log('success', value);
						return context.data = value;
					}
				} catch(err) {
					if (!(err instanceof skemerErrors.DataTypeError)) {
						throw err;
					}
					console.log('Caught a type error - not that type');
				}
			}

			throw new skemerErrors.DataTypeError('invalid value for '
					+ context.parameterName);
		} else {
			return setValueToType(context);
		}
	}

	return context.data;
}

module.exports = {
	/**
	 * Add data to an object based on a schema from the data given.
	 *
	 * @param {Object} options An object containing options
	 * @param {Object} options.schema An Object containing a valid schema
	 *        should contain
	 * @param {} data Data to validate and return. If no data is given,
	 *           data containing any default values will be returned
	 * @param {} ... Data to validate and merge into data
	 *
	 * @returns {} Validated and merged data
	 */
	validateAddData: function(options, data) {
		// @TODO Properly validate options
		if (!options.schema) {
			throw new Error('Need a schema');
		}

		var context = options;

		context.newData = data;

		if (context.baseSchema === undefined) {
			context.baseSchema = context.schema;
		}

		data = validateAddData(context);
		var i;
		
		if (arguments.length > 2) {
			for (i = 2; i < arguments.length; i++) {
				//build context
				context.newData = arguments[i];
				data = validateAddData(context);
			}
		}

		console.log('validateAdd complete', context);

		return data;
	}
};
