var buildDocOptions = {
  type: {
    name: {
      doc: 'Name of the object documenting (will be prepended to any '
          + 'parameter names',
      type: 'string'
    },
    type: {
      doc: 'Specify what block tag should be used for the variables',
      type: 'string',
      values: ['parameter', 'param', 'prop', 'property', 'var', 'member'],
      default: 'prop'
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
      doc: 'Whether to line up text in a JSDoc block (eg `@param`) with the '
          + 'end of the block command',
      type: 'boolean',
      default: true
    },
    wrap: {
      doc: 'Number of characters to wrap the JSDoc lines at',
      type: 'number'
    }
  }
};

var schema = {
  type: {
    description: {
      doc: "A String giving information on the value expected",
      types: [
        {
          type: 'string'
        }/*,
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
              type: {
                doc: {
                  type: 'string',
                  required: true
                },
                type: {
                  type: 'string',
                  required: true
                }
              }
            }
          }
        }*/
      ]
    },
    doc: {
      doc: "A String giving information on the value expected",
      types: [
        {
          type: 'string'
        }/*,
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
              type: {
                doc: {
                  type: 'string',
                  required: true
                },
                type: {
                  type: 'string',
                  required: true
                }
              }
            }
          }
        }*/
      ]
    },
    docType: {
      doc: "A string containing the type of the value expected that will be "
          + "used instead of calculating the type of value expected",
      types: [
        {
          type: 'string'
        }
      ]
    },
    noDocDig: {
      doc: 'If set and the value expected is an object, buildJsDoc will not '
          + 'document the parameters of the object',
      type: 'boolean'
    },
    type: {
      doc: "The value type of the parameter expected",
      types: [
        {
          type: 'string'
        },
        {
          type: 'null'
        },
        {
          type: null,
          multiple: true,
          object: true
        }
      ]
    },
    types: {
      doc: "An Array or Object of {@link schema} containing different schemas "
          + 'of the values expected',
      type: null,
      multiple: true,
      object: true
    },
    values: {
      doc: 'Specifies the possible values for strings, numbers and dates',
      type: 'any', // @TODO Change to type reference once implemented
      multiple: true
    },
    multiple: {
      doc: "Whether or not multiple values (stored in an Array, or if "
          + "`object is set to `true` an Object) are allowed. Can be a "
          + "boolean, a number (the number of values that the value expected "
          + "must have), or an array containing the minimum number of values "
          + "and, optionally, the maximum number of values.",
      type: 'boolean'
    },
    object: {
      doc: "If `multiple` is true and `object` is true, the multiple values "
          + "will be stored in an object. If multiple is true and object is "
          + 'false, any keys will be ignored and the '
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
      types: [
        {
          type: 'number'
        },
        {
          type: 'date'
        }
      ]
    },
    max: {
      doc: "The maximum number, string length or number of Array elements "
          + "allowed",
      types: [
        {
          type: 'number'
        },
        {
          type: 'date'
        }
      ]
    },
    replace: {
      doc: 'Whether a new value should completely replace an old value when '
          + 'the value expected is either an array or an object',
      type: 'boolean'
    },
    required: {
      doc: 'Either true/false or a function returning true/false '
          + 'whether the parameter is required, or if the variable is a '
          + 'multiple stored in an array an number given the number of '
          + 'required elements, or an array of numbers, the first being the '
          + 'minimum number of elements and the second being the maximum '
          + 'number of elements (a maximum is not required)',
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
      doc: "Default value to use if no value is given",
      type: 'any'
    }/*,
     @TODO validation: {
      doc: "Function to validate the value of the parameter. Will be given "
          + "the value as the parameter. The function must return true if "
          + "valid, false if not, or null if no value",
      type: 'Function'
    }*/
  }
};

module.exports = {
  /** @private  (documented inline)
   * Options that can be passed to the {@link #buildJsDocs} functions
   %%buildDocOptions%%
   */
  buildDocOptions: buildDocOptions,

  /**
   * Schema Object detailing the schema to be used for validating and merging
   * data.
  %%schema%%
   */
  schema: schema,

  /**
   * Options Object that must be passed to the one-off
   * [validate]{@link #validateAdd} [functions]{@link #validateNew} and
   * on creating an instance of a [`Skemer`]{@link #Skemer}
   %%options%%
   */
  options: {
    type: {
      schema: {
        doc: '[Schema]{@link #schema} to use for the validation',
        docType: 'schema',
        noDocDig: true,
        required: true,
        type: schema.type
      },
      //baseSchema: schema,
      baseSchema: {
        doc: 'Schema to be used for recursive schemas. If none given, the '
            + 'given, the full schema given in `schema` will be used',
        noDocDig: true,
        type: null
      },
      replace: {
        doc: 'A boolean to specify whether to globally replace all existing '
            + 'values for arrays and objects, or an object of '
            + 'string/boolean key/value pairs used to specify what variables'
            + '(their name given as the key) should have their value replaced '
            + 'by default (a boolean value of true)',
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

