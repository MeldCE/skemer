var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Test Data
var suites = [
	{
		label: 'Simple (any) variable',
		schema: {
			type: 'any'
		},
		data: {
			undef: undefined,
			string: 'testString',
			object: { test: 'cool'}
		},
		newData: {
			undef: undefined,
			number: 74,
			boolean: true
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: ['string', 'undef', false],
				result: 'testString'
			},
			{
				input: ['object', 'undef', false],
				result: { test: 'cool' }
			},
			{
				input: [false, 'number', false],
				result: 74
			},
			{
				input: [false, 'boolean', false],
				result: true
			}
		]
	},
	{
		label: 'Simple required (any) variable',
		schema: {
			type: 'any',
			required: true
		},
		data: {
			undef: undefined,
			string: 'testString',
			object: { test: 'cool'}
		},
		newData: {
			undef: undefined,
			number: 74,
			boolean: true
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['string', 'undef', false],
				result: 'testString'
			},
			{
				input: ['object', 'undef', false],
				result: { test: 'cool' }
			},
			{
				input: [false, 'number', false],
				result: 74
			},
			{
				input: [false, 'boolean', false],
				result: true
			}
		]
	}
];

buildTests('Any type tests', suites);
