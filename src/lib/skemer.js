"use strict";

/** @module Skemer */

var skemerSchemas = require('./schema.js');
var merge = require('merge');

/** @internal
 * Validates a value against a schema and returns the result
 *
 * @param {Object} context Context of the validation
 * @param context.object The current value - used to determine if a default
 *        value should be returned (when there is currently no value)
 * @param context.data The schema to validate the data against
 * @param {Object} context.schema The type to validate the value against
 * @param {boolean} context.add If true and value can contain multiple values
 *        add the value to the existing values
 * @param {Object} context.baseSchema The original schema, so that it can be
 *        used in recursive schema
 * @param {boolean} context.noThrow If true, if a value that doesn't match the
 *        schema is encountered, null will be returned instead of an error
 *        being thrown
 *
 * @throws {ValueError} When the value does not much the schema
 *
 * @returns {} undefined if no value set, either by the existing value, the new
 *          value or a default value. Otherwise, the new value
 */
function setValueToSchema(context) {
	console.log('\nsetValueToSchema:', context);

	if (context.schema === undefined) {
		throw new Error('Need a schema');
	}

	if (context.schema.types) {
		console.log('have types, checking for value', context.schema, context.data);
		// Return default value if we don't have a value
		if (context.data === undefined) {
			if (context.schema.default) {
				/// @TODO Deep copy
				console.log('no value, returning default');
				return context.schema.default;
			} else {
				console.log('no value, ignoring');
				return undefined;
			}
		}

		console.log('have types and a value', context.schema, context.data);
		//if (schema.type && schema.type instanceof Array) {
		//}

		// Go through possible types and return first one that returns a value
		var t, value;
		for (t in context.schema.types) {
			console.log('checking type ' + t + ' for ' + context.parameterName);
			if ((value = setValueToType(merge({}, context, {
						object: {},
						noThrow: true,
						schema: context.schema.types[t]
					}))) !== undefined) {
				console.log('success', value);
				return value;
			}
		}

		// Return current value
		return context.object;
	} else {
		return setValueToType(context);
	}
}

/** @internal
 * Validates a value against a certain type and returns the result. It is
 * different to (@link setValueToSchema) in that is does not handle a schema
 * with mulitple possible types instead a single type.
 *
 * @param {Object} context Context of the validation
 * @param {} context.object The current value
 * @param {} context.data The schema to validate the data against
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
	//console.log('\nsetValueToType', context);
	// If type is null start again the original schema for the value
	if (context.schema.type === null) { // magical value to represent the schema (schema within the schema)
		// Restart with base schema
		console.log('!!!!!!!restarting with base schema', merge({}, context, {
			schema: context.baseSchema,
			noThrow: true
		}));

		addData(merge({}, context, {
			schema: context.baseSchema
		}));
		console.log('after null diving, value is', context.object);
		return context.object;
	} else {
		if (typeof context.schema.type === 'string') { // A simple type or instance of a certain prototype
			console.log('type given as string', context.schema.type);
			switch (context.schema.type) {
				case 'number':
				case 'string':
				case 'boolean':
					if (context.data !== undefined) {
						if (typeof context.data === context.schema.type) {
							return context.data;
						} else if (!context.noThrow) {
							throw Error('Value of ' + context.parameterName
									+ ' should be a ' + context.schema.type);
						}
					} else if (context.object === undefined
							&& context.schema.default !== undefined) {
						return context.schema.default;
					}
					break;
				case 'null':
				case 'Null':
					if (context.data !== undefined) {
						if (context.data === null) {
							return null;
						} else if (!context.noThrow) {
							throw Error('Value of ' + context.parameterName
									+ ' should be null');
						}
					} else if (context.object === undefined
							&& context.schema.default !== undefined) {
						return context.schema.default;
					}
					break;
				default: /// @TODO Think of a safer way of doing this
					try {
						if (context.data !== undefined) {
							if (context.data instanceof eval(context.schema.type)) {
								return context.data;
							} else if (!context.noThrow) {
								throw Error('Value of ' + context.parameterName
										+ ' should be a ' + context.schema.type);
							}
							return context.data;
						} else if (context.object === undefined
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
			if (context.data === undefined) {
				if (context.object === undefined
						&& context.schema.default !== undefined) {
					context.object = context.schema.default;
					return true;
				} else {
					return false;
				}
			}

			if (context.object === undefined) {
				context.object = {};
			}

			var t;
			for (t in context.schema.type) {
				addObjecTypetData(merge({}, context, {
					schema:context.schema.type[t],
					data: context.data[t],
				}));
			}

			if (Object.keys(context.object).length === 0) {
				context.object = undefined;
			}
		}
	}
}

/** @internal
 *
 * Add data to an object based on a schema from the data given.
 *
 * @param {Object} context An Object containing the context of the call.
 * @param {} context.object The current value
 * @param {} context.data The schema to validate the data against
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
function addObjectTypeData(context, inMultiple) {
	//console.log('\n\n\naddData called', context);
	var s, valueAdded = false;

	if (context.data === undefined) {
		// Return if schema is a array
		if (context.schema instanceof Array) {
			return;
		}

		context.data = {};
	}

	if (!inMultiple && context.schema.multiple) {
		console.log('\nhave multiple value schema');
		var d, newObject;

		if (context.schema.object) {
			if (context.object && !replace) {
				newObject = context.object;
			} else {
				newObject = {};
			}
		} else {
			if (context.object && add) {
				newObject = context.object;
			} else {
				newObject = [];
			}
		}

		if (!(context.data instanceof Object)) {
			throw skemerError.ValueError('Multiple value ' + context.parameter
				+ ' must be given in an '
				+ (context.schema.object ? 'object' : 'array') + ' ('
				typeof context.data + ' given)');
		}

		for (d in context.data) {
			console.log('\n\n\nchecking  data[%s] against schema', d);
			if ((value = setValueToSchema(merge({}, context, {
				data: context.data[d],
				parameterName: (context.parameterName ? context.parameterName
						+ '.' : '') + d
			}), true)) !== undefined) {
				//console.log('success', context, 'subObject', subObject);

				if (context.schema.object) {
					newObject[d] = value
				} else {
					newObject.push(value);
				}
			}
		}

		// Set object
		if (context.schema.object) {
			if (Object.keys(newObject).length) {
				context.object = newObject;
			}
		} else if (newObject.length) {
			context.object = newObject;
		}
	} else {
		if ((value = setValueToSchema(merge({}, context, {
			data: context.data[d],
			parameterName: (context.parameterName ? context.parameterName
					+ '.' : '') + d
		}), true)) !== undefined) {
			context.object = value;
		}
	}
}

/* XXX
		// Go through parameters
		for (s in context.schema) {
			console.log('\nchecking item.%s against schema for %s, value is %s', s, s, context.data[s]);
			var value;
			if ((value = setValueToSchema(merge({}, context, {
						object: context.object[s],
						schema: context.schema[s],
						data: context.data[s],
						parameterName: (context.parameterName ? context.parameterName
								+ '.' : '') + s
					}))) !== undefined) {
				console.log('got value', value);
				context.object[s] = value;
				valueAdded = true;
			}
		}
	}

	return valueAdded;
	/// @TODO Handle parameters not included in the schema
}*/



/*let Skemer = function(schema, options) {
	// Check schema
	this.defineProperty('schema', {}, { writable: true });
	build(this.schema, skemerSchemas.schemaSchema, schema);

	// check options
	// store schema
	// store options
};*/

/**
 * @constructor
 *
 * Used to create a SkemedObject - an object that has been generated using a
 * Skemer schema.
 *
 * The created object should not be edited manually, but through its
 * {@link merge} and {@link set} functions.
 *
 * @param {Skemer} schema A schema to use for the creation of the new object
 * @param {Object} data Data to put into the new object
 */
var SkemedObject = function(schema, data) {
/*	if (schema && data) {
		if (!(data instanceof Object)) {
			throw new TypeError('data must be an Object');
		}
		if (schema instanceof Skemer) {
			build(this, schema, data);
		} else {
			throw new TypeError('Schema must be a validated schema');
		}
	}*/
};



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

		data = validateAddData(options, data);
		if (arguments.length > 2) {
			for (i = 2; i < arguments.length; i++) {
				data = validateAddData(options, data, arguments[i]);
			}
		}
		
		return data;
	}

	//verify:

	//SkemedObject:
};
















/**
 * @constructor Skemer
 * Skemer
 *
 * A Object schema validator and scheme JSDoc generator
 *
 * @param {Object} schema Schema @see SkemerSchema
 * @param {Object} [options] Skemer options @see SkemerOptions
 * @param {Object} [
 */
var Skemerd = {
	/*Schema: function(schema, options) {
		// Validate schema

		options = new Skemer(skemerSchema, undefined, options);
		scheme = new Skemer(skemerSchema);


		var access = function() {
			if (arguments.length == 0) {
				return
		};
		this.id = priv.push({
			schema: schema
		})

		var fn = function(

		return fn;
	},*/

	/*
	 * Generates a JSDoc comment for the given schema.
	 *
	 * @param {Object} [options] Generation options
	 * @param {string} [options.scope] The string to prepend to the start of
	 *        each parameter
	 * @param {string} [options.preLine] String to include before each line
	 * @param {number} [options.wrap] Wrap the lines at the given number of
	 *        characters
	 * @param {number} [options.tabWidth] Your favourite tab width used to
	 *        calculate 80 characters
	 * @param {boolean} [options.lineup] Line up broken lines with the start of
	 *        the parameter details
	 *
	 * @returns {string} JSDoc Formatted string containing the parameters of the
	 *          scheme
	 *
	buildDocs: function(schema, options) {
		if (!options) {
			options = {};
		}

		var doc = '';

		var tw = (options.tabWidth ? options.tabWidth : 4);
		var c, s, w, line, l, lines = buildLines(options.pre, this.schema);

		if (options.wrap) {
			// Go through and build the lines
			var lines = buildDocLines(pre);

			for (l in lines) {
				line = options.preLine + lines[l];

				c = 0;
				s = 0;

				while (c < line.length) {
					if (line[c] === ' ') {
						s = c;
					} else if (line[c] === "\t") {
						w += tw - 1;
						s = c;
					}
					w++;
					if (w > options.wrap) {
						doc += line.slice(0, s) + "\n";
						line = options.preLine + (options.lineup ? '       ' : '');
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
	},

	validate: function(schema, object) {
	},

	merge: function(schema, object) {
	}*/
};

/**
 * @internal
 * Builds the lines of documentation for each parameter of the scheme
 *
 * @param {Object} scheme Object containing the scheme to build the
 *        documentation for
 * @param {string} pre String to prepend to the start of each parameter
 */
function buildDocLines(schema, pre) {
	var lines = [], line, subLines, name, s;

	if (!pre) {
		pre = '';
	}

	for (s in schema) {
		line = '@param ';
		if (schema[s].types) {
		} else if (schema[s].type) {
		} else {
		}
		name = pre + '.' + s;
		if (schema[s].required !== true) {
			name = '[' + name + ']';
		}

		// Add parameter to lines
		lines.push(line);

		// Add sub parameters to lines
		if (subLines) {
			lines = lines.concat(subLines);
			subLines = false;
		}
	}

	return lines;
}


//Skemer.Schema.prototype
var otype = {
	/**
	 * Merge object values into the existing object verifying each before
	 * merging
	 *
	 * @param {Object} object Object to merge into existing object
	 * @param {boolean} [silent] If true, if a parameter is invalid, it will
	 *        be ignored rather than raising an Error
	 * @TODO extend given options or return a new object?
	 */
	build: function(object, silent) {
		//return Skemer.build(this.schema, object, silent);
	},

	/**
	 * Merge object values into the existing object verifying each before
	 * merging
	 *
	 * @param {Object} object Schema-shaped object
	 * @param {Object} newValues Object containing the values to merge into the
	 *        object
	 * @param {boolean} [silent] If true, if a parameter is invalid, it will
	 *        be ignored rather than raising an Error
	 * @param {Object} [options] Options
	 * @param {boolean} [options.addUnknown] Add unknown parameters to the
	 *        object. If, not the parameters will be returned as errors
	 * @param {boolean} [options.add] If the parameter is an Array, add the new
	 *        value instead of replacing the existing values
	 * @TODO Do we want options to be set with the schema?
	 *
	 * @returns {true|Array.Object} Returns true if all
	 */
	merge: function(object, newValues, options) {
		//return Skemer.merge(this.schema, object, newValues, options);
	},

	/**
	 * Set a new value to a parameter in an object shaped by a Schema
	 *
	 * @param {Object} object Schema-shaped object
	 * @param {string|Array.string} key Parameter key of parameter to set if
	 *        new value is validated. Use an Array of strings to set a nested
	 *        parameter
	 * @param value New value for the parameter
	 * @param {boolean} [add] If the parameter is an Array, add the new
	 *        value instead of replacing the existing values
	 *
	 * @returns {boolean|number} Returns false if the value failed validation or
	 *          the parameter did not exist. Returns try if the set was
	 *          successful. Returns the index of the new value if the parameter
	 *          was an Array and the value was added to it
	 */
	set: function(object, key, value, add) {
		//return Skemer.set(this.schema, object, key, value, add);
	},

	/**
	 * Generates a JSDoc comment for the given schema.
	 *
	 * @param {Object} [options] Generation options
	 * @param {string} [options.scope] The string to prepend to the start of
	 *        each parameter
	 * @param {string} [options.preLine] String to include before each line
	 * @param {number} [options.wrap] Wrap the lines at the given number of
	 *        characters
	 * @param {number} [options.tabWidth] Your favourite tab width used to
	 *        calculate 80 characters
	 * @param {boolean} [options.lineup] Line up broken lines with the start of
	 *        the parameter details
	 *
	 * @returns {string} JSDoc Formatted string containing the parameters of the
	 *          scheme
	 */
	buildDocs: function() {
		//return Skemer.buildDocs(this.schema, this.options.buildDocOptions);
	}
};

//module.exports = Skemer;
