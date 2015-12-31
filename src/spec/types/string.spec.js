var errors = require('../../lib/errors.js');
var buildTests = require('../helpers/builder.js');
var clone = require('clone');

// Test Data
var suites = [
	{
		label: 'String type',
		schema: {
			type: 'string'
		},
		data: {
			undef: undefined,
			string: 'test'
		},
		newData: {
			undef: undefined,
			invalid: 54,
			empty: '',
			string: 'newString'
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: ['string', 'undef', false],
				result: 'test'
			},
			{
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('Value must be a string')
			},
			{
				input: [false, 'empty', false],
				result: ''
			},
			{
				input: [false, 'string', false],
				result: 'newString'
			}
		]
	},
	{
		label: 'String type required',
		schema: {
			type: 'string',
			required: true
		},
		data: {
			undef: undefined,
			string: 'test'
		},
		newData: {
			undef: undefined,
			empty: '',
			string: 'newString'
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['string', 'undef', false],
				result: 'test'
			},
			{
				input: [false, 'empty', false],
				result: ''
			},
			{
				input: [false, 'string', false],
				result: 'newString'
			}
		]
	},
	{
		label: 'String type required min/max',
		schema: {
			type: 'string',
			required: true,
			min: 4,
			max: 9
		},
		data: {
			undef: undefined,
			string: 'test'
		},
		newData: {
			undef: undefined,
			empty: '',
			shortString: 'and',
			string: 'more',
			longString: 'newString',
			longerString: 'newString1'
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['string', 'undef', false],
				result: 'test'
			},
			{
				input: [false, 'empty', false],
				throws: new errors.DataRangeError('Value must be atleast 4 '
						+ 'characters and no more than 9 characters')
			},
			{
				input: [false, 'shortString', false],
				throws: new errors.DataRangeError('Value must be atleast 4 '
						+ 'characters and no more than 9 characters')
			},
			{
				input: [false, 'string', false],
				result: 'more'
			},
			{
				input: [false, 'longString', false],
				result: 'newString'
			},
			{
				input: [false, 'longerString', false],
				throws: new errors.DataRangeError('Value must be atleast 4 '
						+ 'characters and no more than 9 characters')
			},
		]
	},
];

buildTests(suites);