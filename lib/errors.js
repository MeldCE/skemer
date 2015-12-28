var util = require('util');


module.exports = {};

/** @constructor
 * Returned if the type of value for a parameter in the schema is incorrect,
 *
 * @param {string} message Error message
 * @param {} extra Extra information
 */
var DataTypeError = module.exports.DataTypeError = function(message, extra) {
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
var DataRequiredError = module.exports.DataRequiredError
		= function(message, extra) {
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
var DataRangeError = module.exports.DataRangeError
		= function(message, extra) {
	Error.captureStackTrace(this, this.constructor);
  this.name = this.constructor.name;
  this.message = message;
  this.extra = extra;
};

util.inherits(DataRangeError, Error);
