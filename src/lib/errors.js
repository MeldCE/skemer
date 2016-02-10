var util = require('util');

/**
 * Thrown if the parameter value is out of the given range
 *
 * @param {string} message Error message
 * @param {*} extra Extra information
 *
 * @class
 */
function SchemaError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  //this.name = this.constructor.name;
  this.name = 'SchemaError';
  this.message = message;
  this.extra = extra;
}
util.inherits(SchemaError, Error);

/**
 * Thrown if the parameter value is out of the given range
 *
 * @param {string} message Error message
 * @param {*} extra Extra information
 *
 * @class
 */
function DataItemsError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  //this.name = this.constructor.name;
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(DataItemsError, Error);

/**
 * Thrown if the parameter value is out of the given range
 *
 * @param {string} message Error message
 * @param {*} extra Extra information
 *
 * @class
 */
function OptionsError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(OptionsError, Error);

/**
 * Thrown if the type of value for a parameter in the schema is incorrect,
 *
 * @param {string} message Error message
 * @param {*} extra Extra information
 *
 * @class
 */
function DataTypeError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(DataTypeError, Error);

/**
 * Thrown if a parameter is required, but was not given
 *
 * @param {string} message Error message
 * @param {*} extra Extra information
 *
 * @class
 */
function DataRequiredError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(DataRequiredError, Error);

/**
 * Thrown if the parameter value is out of the given range
 *
 * @param {string} message Error message
 * @param {*} extra Extra information
 *
 * @class
 */
function DataRangeError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(DataRangeError, Error);

/**
 * Thrown if the parameter value is not valid
 *
 * @param {string} message Error message
 * @param {*} extra Extra information
 *
 * @class
 */
function DataInvalidError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(DataInvalidError, Error);

/**
 * Thrown if the path given to the set function does not lead to a value
 *
 * @param {string} message Error message
 * @param {*} extra Extra information
 *
 * @class
 */
function DataPathError(message, extra) {
  Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
}
util.inherits(DataPathError, Error);

module.exports = {
  SchemaError: SchemaError,
  DataItemsError: DataItemsError,
  OptionsError: OptionsError,
  DataTypeError: DataTypeError,
  DataRequiredError: DataRequiredError,
  DataRangeError: DataRangeError,
  DataInvalidError: DataInvalidError
};
