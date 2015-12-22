
module.exports = {
	/**
	 * Returned if the type of value for a parameter in the schema is incorrect
	 */
	DataTypeError,

	/**
	 * Returned if a parameter is required, but was not given
	 */
	DataRequiredError,

	/**
	 * Returned if the parameter value is out of the given range
	 */
	DataRangeError,
};
