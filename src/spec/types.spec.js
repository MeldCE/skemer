var skemerErrors = require('../lib/errors.js');
var buildTests = require('./helpers/builder.js');
var clone = require('clone');

var options = {
	empty: {},
	replaceSomeVar: {
		replace: {
			'someVar': true
		}
	},
	replaceAll: {
		replace: true // So leave if no value in data, could do delete if empty value in data
	}
};

// Test Data
var suites = [
	{
		label: 'String schema',
		schema: {
			type: 'string'
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
		options: clone(options),
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
				input: [false, 'empty', false],
				result: ''
			},
			{
				input: [false, 'string', false],
				result: 'newString'
			}
		]
	}/*,
	{
		label: 'Required fields',
		schema: {
			type: {
				string: {
					type: 'string',
					required: true
				},
				object: {
					type: {
						bool: {
							type: 'boolean',
							required: true
						},
						number: {
							type: 'number',
							required: true
						}
					},
					required: true
				}
			}
		}
	}*/
];

buildTests(suites);
