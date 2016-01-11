var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Test Data
var suites = [
	{
		label: 'Simple boolean variable',
		schema: {
			type: 'boolean'
		},
		data: {
			undef: undefined,
			boolean: false
		},
		newData: {
			undef: undefined,
			invalid: 'string',
			boolean: true
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: ['boolean', 'undef', false],
				result: false
			},
			{
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('Value must be a boolean')
			},
			{
				input: [false, 'boolean', false],
				result: true
			}
		]
	},
	{
		label: 'Simple required boolean variable',
		schema: {
			type: 'boolean',
			required: true
		},
		data: {
			undef: undefined,
			boolean: false
		},
		newData: {
			undef: undefined,
			invalid: 'string',
			boolean: true
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['boolean', 'undef', false],
				result: false
			},
			{
				input: [false, 'boolean', false],
				result: true
			}
		]
	}
];

buildTests('Boolean type tests', suites);
