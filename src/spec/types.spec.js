var errors = require('../lib/errors.js');
var buildTests = require('./lib/builder.js');

// Test Data
var suites = [
	{
		label: 'simple number variable',
		schema: {
			types: [
				{
					type: 'number'
				},
				{
					type: 'string'
				}
			]
		},
		data: {
			undef: undefined,
			number: 34,
			string: 'string'
		},
		newData: {
			undef: undefined,
			invalid: true,
			string: 'newString',
			number: 453
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: ['number', 'undef', false],
				result: 34
			},
			{
				input: ['string', 'undef', false],
				result: 'string'
			},
			{
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('boolean value is not allowed')
			},
			{
				input: [false, 'string', false],
				result: 'newString'
			},
			{
				input: [false, 'number', false],
				result: 453
			}
		]
	},
	{
		label: 'simple required string or number variable',
		schema: {
			types: [
				{
					type: 'number'
				},
				{
					type: 'string'
				}
			],
			required: true
		},
		data: {
			undef: undefined,
			number: 34,
			string: 'string'
		},
		newData: {
			undef: undefined,
			invalid: true,
			string: 'newString',
			number: 453
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['number', 'undef', false],
				result: 34
			},
			{
				input: ['string', 'undef', false],
				result: 'string'
			},
			{
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('boolean value is not allowed')
			},
			{
				input: [false, 'string', false],
				result: 'newString'
			},
			{
				input: [false, 'number', false],
				result: 453
			}
		]
	},
	{
		label: 'Simple required number variable with number min/max requirements',
		schema: {
			types: [
				{
					type: 'number',
					min: 453,
					max: 454
				},
				{
					type: 'string'
				}
			],
			required: true
		},
		data: {
			undef: undefined,
			number: 34,
			string: 'string'
		},
		newData: {
			undef: undefined,
			invalid: true,
			string: 'newString',
			number: 453,
			smallNumber: 452,
			bigNumber: 454
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				label: 'Will return as existing data should not be validated',
				input: ['number', 'undef', false],
				result: 34
			},
			{
				input: ['string', 'undef', false],
				result: 'string'
			},
			{
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('boolean value is not allowed')
			},
			{
				input: [false, 'string', false],
				result: 'newString'
			},
			{
				input: [false, 'number', false],
				result: 453
			},
			{
				input: [false, 'smallNumber', false],
				throws: new errors.DataRangeError('Value must be greater than or '
						+ 'equal to 453 and less than 454')
			},
			{
				input: [false, 'bigNumber', false],
				throws: new errors.DataRangeError('Value must be greater than or '
						+ 'equal to 453 and less than 454')
			}
		]
	}
];

buildTests('Types (string/number) tests', suites);
