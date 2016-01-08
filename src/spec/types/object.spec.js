var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');
var clone = require('clone');

// Test Data
var options = {
	empty: {},
	dont: {
		replace: false
	},
	global: {
		replace: true
	},
	specific: {
		replace: {
			'': true
		}
	}
};

var suites = [
	{
		label: 'Simple object containing string variables',
		schema: {
			type: {
				test: {
					type: 'string'
				},
				value: {
					type: 'number'
				},
				flip: {
					type: 'boolean'
				}
			}
		},
		data: {
			undef: undefined,
			empty: {},
			value: {
				test: 'test',
				value: 9
			}
		},
		newData: {
			undef: undefined,
			invalid: 'notinarray',
			empty: {},
			value: {
				test: 'string',
				flip: true
			}
		},
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: [false, 'invalid', 'empty'],
				throws: new errors.DataTypeError('Value must be an object (string given)')
			},
			{
				input: [[false, 'empty', 'global'], [false, 'empty', 'specific']],
				result: {}
			},
			{
				input: [['empty', 'undef', false], ['empty', 'empty', false]],
				result: {}
			},
			{
				input: [
					['value', 'undef', false],
					['value', 'empty', 'empty'],
					['value', 'empty', 'dont']
				],
				result: {
					test: 'test',
					value: 9
				}
			},
			{
				label: 'should merge values',
				input: [
					['value', 'value', 'empty'],
					['value', 'value', 'dont']
				],
				result: {
					test: 'string',
					value: 9,
					flip: true
				}
			},
			{
				label: 'should replace existing object',
				input: [
					['value', 'value', 'global'],
					['value', 'value', 'specific'] 
				],
				result: {
					test: 'string',
					flip: true
				}
			}
		]
	},
	{
		pending: true,
		label: 'Simple object containing string variables with replace set to true',
		schema: {
			type: {
				test: {
					type: 'string'
				},
				value: {
					type: 'number'
				},
				flip: {
					type: 'boolean'
				}
			},
			replace: true
		},
		data: {
			undef: undefined,
			empty: {},
			value: {
				test: 'test',
				value: 9
			}
		},
		newData: {
			undef: undefined,
			invalid: 'notinarray',
			empty: {},
			value: {
				test: 'string',
				flip: true
			}
		},
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: [false, 'invalid', 'empty'],
				throws: new errors.DataTypeError('Value must be an object (string given)')
			},
			{
				input: [
					[false, 'empty', 'empty'],
					[false, 'empty', 'global'],
					[false, 'empty', 'specific']
				],
				result: {}
			},
			{
				input: [['empty', 'undef', false], ['empty', 'empty', false]],
				result: {}
			},
			{
				input: [
					['value', 'undef', false],
					['value', 'empty', 'dont']
				],
				result: {
					test: 'test',
					value: 9
				}
			},
			{
				label: 'should merge values',
				input: [
					['value', 'value', 'dont']
				],
				result: {
					test: 'string',
					value: 9,
					flip: true
				}
			},
			{
				label: 'should replace existing object',
				input: [
					['value', 'value', 'empty'],
					['value', 'value', 'global'],
					['value', 'value', 'specific'] 
				],
				result: {
					test: 'string',
					flip: true
				}
			}
		]
	}
];

buildTests('Object type tests', suites);
