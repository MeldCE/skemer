var util = require('util');

/** @constructor
 * Returned if the parameter value is out of the given range
 *
 * @param {string} message Error message
 * @param {} extra Extra information
 */
function SchemaError(message, extra) {
	Error.captureStackTrace(this, this.constructor);
  //this.name = this.constructor.name;
  this.name = 'SchemaError';
  this.message = message;
  this.extra = extra;
};
util.inherits(SchemaError, Error);

/** @constructor
 * Returned if the parameter value is out of the given range
 *
 * @param {string} message Error message
 * @param {} extra Extra information
 */
function DataItemsError(message, extra) {
	Error.captureStackTrace(this, this.constructor);
  //this.name = this.constructor.name;
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
};
util.inherits(DataItemsError, Error);

/** @constructor
 * Returned if the parameter value is out of the given range
 *
 * @param {string} message Error message
 * @param {} extra Extra information
 */
function OptionsError(message, extra) {
	Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
};
util.inherits(OptionsError, Error);

/** @constructor
 * Returned if the type of value for a parameter in the schema is incorrect,
 *
 * @param {string} message Error message
 * @param {} extra Extra information
 */
function DataTypeError(message, extra) {
	Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
};
util.inherits(DataTypeError, Error);

/** @constructor
 * Returned if a parameter is required, but was not given
 *
 * @param {string} message Error message
 * @param {} extra Extra information
 */
function DataRequiredError(message, extra) {
	Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
};
util.inherits(DataRequiredError, Error);

/** @constructor
 * Returned if the parameter value is out of the given range
 *
 * @param {string} message Error message
 * @param {} extra Extra information
 */
function DataRangeError(message, extra) {
	Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
};
util.inherits(DataRangeError, Error);

module.exports = {
	SchemaError: SchemaError,
	DataItemsError: DataItemsError,
	OptionsError: OptionsError,
	DataTypeError: DataTypeError,
	DataRequiredError: DataRequiredError,
	DataRangeError: DataRangeError
};
