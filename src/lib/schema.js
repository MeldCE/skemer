/** @private
 * Schema for the buildDocOptions
 */
var buildDocOptions = {
  type: {
    name: {
      doc: 'Name of the object documenting (will be prepended to any '
          + 'parameter names',
      type: 'string'
    },
    tabWidth: {
      doc: 'The width (number of characters) of a tab',
      type: 'number',
      default: 8
    },
    preLine: {
      doc: 'String (normally indentation) to include before each line',
      type: 'string',
      default: ''
    },
    lineup: {
      doc: 'Whether to line up text in a JSDoc (eg @param) with the end of '
          + 'the end of the command',
      type: 'boolean',
      default: true
    },
    wrap: {
      doc: 'Number of characters to wrap the JSDoc lines at',
      type: 'number'
    }
  }
};

/** @private
 * Schema for Skemer schemas
 */
var schema = {
	type: {
		doc: {
			doc: "A String giving information on the parameter",
			types: [
        {
          type: 'string'
        },
        {
          type: {
            doc: {
              type: 'string'
            },
            parameters: {
              type: {
                doc: {
                  type: 'string',
                  required: true
                },
                type: {
                  type: 'string',
                  required: true
                },
                required: {
                  type: 'boolean'
                }
              },
              multiple: true,
              object: true
            },
            returns: {
              doc: {
                type: 'string',
                required: true
              },
              type: {
                doc: 'string',
                required: true
              }
            }
          }
        }
      ]
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
			doc: "The minimum number, string length or number of Array elements "
					+ "required",
			type: 'number'
		},
		max: {
			doc: "The maximum number, string length or number of Array elements "
					+ "allowed",
			type: 'number'
		},
		replace: {
			doc: 'Whether a new value should completely replace an old value',
			type: 'boolean'
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
			doc: "Default value for parameter",
			type: 'any'
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

