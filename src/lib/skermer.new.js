
function validateAddData(context, inMultiple) {
	var dataUndefined = (context.data === undefined);

	if (!inMultiple && context.schema.mulitple) {
		if (context.scehma.object) {
			if (context.newData) {
				// Throw if we don't have an Object
				if (!(context.newData instanceof Object)) {
					throw new skemerErrors.TypeError(context.parameter + 'must be an ' +
							+ 'object of values (' + typeof context.newData + ' given)');
				}
				if (context.data === undefined) {
					var o;

					context.data = {};

					for (o in context.)
				}
			}
		}
	}
	if ()
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


		data = validateAddData(context);
		if (arguments.length > 2) {
			for (i = 2; i < arguments.length; i++) {
				//build context
				context.newData = arguments[i];
				data = validateAddData(context);
			}
		}

		return data;
	}
};
