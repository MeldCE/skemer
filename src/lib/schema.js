"use strict";

/** @module Skemer/Schemas */

var buildDocOptions = {
};

var schema = {
	type: {
		doc: {
			doc: "A String giving information on the parameter",
			type: 'string'
		},
		type: {
			doc: "The value type of the parameter expected",
			types: [
				{
					type: 'string'
				},
				{
					type: null,
					multiple: true,
					object: true
				}
			]
		},
		types: {
			doc: "An Array of Objects containing the details of the values expected",
			type: null,
			multiple: true
		},
		multiple: {
			doc: "Whether or not multiple values (stored in an array) are "
					+ "allowed. Can be a boolean, or a number (the number of values "
					+ "that the parameter must have, or an array containing the "
					+ "minimum number of values and teh maximum number of values.",
			type: 'boolean'
		},
		object: {
			doc: "If multiple is true object is true, will force values to be "
					+ "stored in an object - appending will not work. If multiple is "
					+ "true and object is false, the key will be ignored and the "
					+ "values will be stored in an array",
			type: 'boolean'
		},
		regex: {
			doc: "A regular expression to validate a String value",
			type: 'RegExp'
		},
		min: {
			doc: "The minimum number, or number of Array elements required",
			type: 'number'
		},
		max: {
			doc: "The maximum number, or number of Array elements allowed",
			type: 'number'
		},
		required: {
			doc: "Either true/false or a function returning true/false to whether the "
					+ "parameter is required",
			types: [
				{
					type: 'boolean'
				},
				{
					type: 'Function'
				},
				{
					type: 'number'
				},
				{
					type: 'number',
					multiple: true,
					required: [1, 2]
				}
			]
		},
		default: {
			doc: "Default value for parameter"
		},
		validation: {
			doc: "Function to validate the value of the parameter. Will be given "
					+ "the value as the parameter. The function must return true if "
					+ "valid, false if not, or null if no value",
			type: 'Function'
		}
	}
};

module.exports = {
	/** @private
	 * Options that can be passed to the {@link buildDocs} functions
	 */
	buildDocOptions: buildDocOptions,

	/** @private
	 * Schema detailing the requirements for Skemer Schema
	 */
	schema: schema,

	options: {
		type: {
			schema: {
				required: true,
				type: schema.type
			},
			baseSchema: schema,
			replace: {
				types: [
					{
						type: 'boolean'
					},
					{
						type: 'boolean',
						multiple: true,
						object: true
					}
				]
			}
		}
	},

	/** @private
	 * Options that can be passed when creating a Skemer Schema
	 */
	schemaOptions: {
		buildDocOptions: {
			type: buildDocOptions
		}
	}
};

