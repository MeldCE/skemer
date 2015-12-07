modules.export = {
	doc: {
		doc: "A String giving information on the parameter",
		type: 'string'
	},
	type: {
		doc: "The value type of the parameter expected",
		types: [
			{
				type: 'string',
				regex: regex.TYPEOF
			},
			{}
		]
	},
	types: {
		doc: "An Array of Objects containing the details of the values expected",
		type: [ Object ],
	}
	regex: {
		doc: "A regular expression to validate a String value",
		type: RegExp
	},
	min: {
		doc: "The minimum number, or number of Array elements required",
		type: Number
	},
	max: {
		doc: "The maximum number, or number of Array elements allowed",
		type: Number
	},
	required: {
		doc: "Either true/false or a function returning true/false to whether the "
				+ "parameter is required",
		types: [
			{
				type: Function
			},
			{
				type: 'boolean'
			}
		]
	},
	default: {
		doc: "Default value for parameter",
	},
	validation: {
		doc: "Function to validate the value of the parameter. Will be given "
				+ "the value as the parameter. The function must return true if "
				+ "valid, false if not, or null if no value",
		type: Function
	}
};

