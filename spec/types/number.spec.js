var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Test Data
var suites = [
	{
		label: 'simple number variable',
		schema: {
			type: 'number'
		},
		data: {
			undef: undefined,
			number: 34
		},
		newData: {
			undef: undefined,
			invalid: 'string',
			zero: 0,
			newNum: 453
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
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('Value must be a number')
			},
			{
				input: [false, 'zero', false],
				result: 0
			},
			{
				input: [false, 'newNum', false],
				result: 453
			}
		]
	},
	{
		label: 'Simple required number variable',
		schema: {
			type: 'number',
			required: true
		},
		data: {
			undef: undefined,
			number: 34
		},
		newData: {
			undef: undefined,
			zero: 0,
			newNum: 453
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
				input: [false, 'zero', false],
				result: 0
			},
			{
				input: [false, 'newNum', false],
				result: 453
			}
		]
	},
	{
		label: 'Simple required number variable with min/max requirements',
		schema: {
			type: 'number',
			required: true,
			min: 4,
			max: 9
		},
		data: {
			undef: undefined,
			number: 5
		},
		newData: {
			undef: undefined,
			zero: 0,
			smallNumber: 3,
			number: 4,
			bigNumber: 8,
			biggerNumber: 9
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['number', 'undef', false],
				result: 5
			},
			{
				input: [false, 'zero', false],
				throws: new errors.DataRangeError('Value must be greater than or '
						+ 'equal to 4 and less than 9')
			},
			{
				input: [false, 'smallNumber', false],
				throws: new errors.DataRangeError('Value must be greater than or '
						+ 'equal to 4 and less than 9')
			},
			{
				input: [false, 'number', false],
				result: 4
			},
			{
				input: [false, 'bigNumber', false],
				result: 8
			},
			{
				input: [false, 'biggerNumber', false],
				throws: new errors.DataRangeError('Value must be greater than or '
						+ 'equal to 4 and less than 9')
			}
		]
	}
];

buildTests('Number type tests', suites);
