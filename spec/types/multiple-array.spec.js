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
	},
	specificButNot: {
		replace: {
			bob: true
		}
	}
};

var suites = [
	{
		label: 'Simple array of strings variable',
		schema: {
			type: 'string',
			multiple: true
		},
		data: {
			undef: undefined,
			empty: [],
			single: ['test'],
	  	double: ['test1', 'test2'],
			invalid: 'string'
		},
		newData: {
			undef: undefined,
			invalid: 'notinarray',
			empty: [],
			single: ['newString']
		},
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: ['single', 'undef', false],
				result: ['test']
			},
			{
				input: [
					['undef', 'invalid', 'empty'],
					['empty', 'invalid', 'empty'],
					['single', 'invalid', 'empty'],
					['double', 'invalid', 'empty']
				],
				throws: new errors.DataTypeError('Value must be an array of values (string given)')
			},
			{
				input: ['invalid', false, false],
				throws: new errors.DataTypeError('Existing data is not an array as it should be')
			},
			{
				input: [
					['undef', 'empty', 'global'],
					['empty', 'empty', 'global'],
					['single', 'empty', 'global'],
					['double', 'empty', 'global'],
					['undef', 'empty', 'specific'],
					['empty', 'empty', 'specific'],
					['single', 'empty', 'specific'],
					['double', 'empty', 'specific']
				],
				result: []
			},
			{
				input: [['undef', 'single', false], ['empty', 'single', false]],
				result: ['newString']
			},
			{
				input: [['empty', 'undef', false], ['empty', 'empty', false]],
				result: []
			},
			{
				input: ['single', 'empty', 'empty'],
				result: ['test']
			},
			{
				input: ['single', 'single', 'empty'],
				result: ['test', 'newString']
			},
			{
				input: ['double', 'single', 'empty'],
				result: ['test1', 'test2', 'newString']
			},
			{
				input: [['single', 'single', 'global'], ['single', 'single', 'specific'], ['double', 'single', 'global'], ['double', 'single', 'specific']],
				result: ['newString']
			}
		]
	},
	{
		label: 'Simple required array of strings variable',
		schema: {
			type: 'string',
			multiple: true,
			required: true
		},
		data: {
			undef: undefined,
			empty: [],
			single: ['test'],
			double: ['test1', 'test2']
		},
		newData: {
			undef: undefined,
			empty: [],
			single: ['newString']
		},
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: [
					['single', 'undef', false],
					['single', 'empty', 'empty'],
					['single', 'empty', 'dont']
				],
				result: ['test']
			},
			{
				input: [
					[false, 'empty', 'global'],
					[false, 'empty', 'specific']
				],
				result: []
			},
			{
				input: [['undef', 'single', false], ['empty', 'single', false]],
				result: ['newString']
			},
			{
				input: [['empty', 'undef', false], ['empty', 'empty', false]],
				result: []
			},
			{
				input: ['single', 'empty', 'empty'],
				result: ['test']
			},
			{
				input: [['single', 'empty', 'global'], ['single', 'empty', 'specific'], ['double', 'empty', 'global'], ['double', 'empty', 'specific']],
				result: []
			},
			{
				input: [
					['single', 'single', 'empty'],
					['single', 'single', 'dont']
				],
				result: ['test', 'newString']
			},
			{
				input: [
					['double', 'single', 'empty'],
					['double', 'single', 'dont']
				],
				result: ['test1', 'test2', 'newString']
			},
			{
				input: [['single', 'single', 'global'], ['single', 'single', 'specific'], ['double', 'single', 'global'], ['double', 'single', 'specific']],
				result: ['newString']
			}
		]
	},
	{
		label: 'Simple array of strings variable with default value',
		schema: {
			type: 'string',
			multiple: true,
			default: ['default']
		},
		data: {
			undef: undefined,
			empty: [],
			single: ['test'],
	  	double: ['test1', 'test2'],
			invalid: 'string'
		},
		newData: {
			undef: undefined,
			invalid: 'notinarray',
			empty: [],
			single: ['newString']
		},
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				result: ['default']
			},
			{
				input: ['single', 'undef', false],
				result: ['test']
			},
			{
				input: [
					['undef', 'invalid', 'empty'],
					['empty', 'invalid', 'empty'],
					['single', 'invalid', 'empty'],
					['double', 'invalid', 'empty']
				],
				throws: new errors.DataTypeError('Value must be an array of values (string given)')
			},
			{
				input: [
					['invalid', 'undef', 'empty'],
					['invalid', 'empty', 'empty'],
					['invalid', 'single', 'empty']
				],
				throws: new errors.DataTypeError('Existing data is not an array as it should be')
			},
			{
				input: [
					['undef', 'empty', 'global'],
					['empty', 'empty', 'global'],
					['single', 'empty', 'global'],
					['double', 'empty', 'global'],
					['undef', 'empty', 'specific'],
					['empty', 'empty', 'specific'],
					['single', 'empty', 'specific'],
					['double', 'empty', 'specific']
				],
				result: []
			},
			{
				input: [['undef', 'single', false], ['empty', 'single', false]],
				result: ['newString']
			},
			{
				input: [['empty', 'undef', false], ['empty', 'empty', false]],
				result: []
			},
			{
				input: ['single', 'empty', 'empty'],
				result: ['test']
			},
			{
				input: ['single', 'single', 'empty'],
				result: ['test', 'newString']
			},
			{
				input: ['double', 'single', 'empty'],
				result: ['test1', 'test2', 'newString']
			},
			{
				input: [['single', 'single', 'global'], ['single', 'single', 'specific'], ['double', 'single', 'global'], ['double', 'single', 'specific']],
				result: ['newString']
			}
		]
	},
	{
		label: 'Simple required array of strings variable with exact number of elements',
		schema: {
			type: 'string',
			multiple: true,
			required: [1,1]
		},
		data: {
			undef: undefined,
			empty: [],
			single: ['test']
		},
		newData: {
			undef: undefined,
			empty: [],
			single: ['newString'],
			double: ['test1', 'test2']
		},
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['single', 'undef', false],
				result: ['test']
			},
			{
				input: [
					[false, 'empty', 'global'],
					[false, 'empty', 'specific']
				],
				throws: new errors.DataItemsError('Must have exactly 1 item(s)')
			},
			{
				input: [
					['undef', 'single', false],
					['empty', 'single', false]
				],
				result: ['newString']
			},
			{
				input: ['empty', 'undef', false],
				result: []
			},
			{
				input: ['empty', 'empty', false],
				throws: new errors.DataItemsError('Must have exactly 1 item(s)')
			},
			{
				input: ['single', 'empty', 'empty'],
				result: ['test']
			},
			{
				input: [
					['single', 'empty', 'global'],
					['single', 'empty', 'specific']
				],
				throws: new errors.DataItemsError('Must have exactly 1 item(s)')
			},
			{
				input: [
					['single', 'single', 'empty'],
					['single', 'double', 'empty']
				],
				throws: new errors.DataItemsError('Must have exactly 1 item(s)')
			},
			{
				input: [
					['single', 'single', 'global'],
					['single', 'single', 'specific']
				],
				result: ['newString']
			},
			{
				input: [false, 'double', false],
				throws: new errors.DataItemsError('Must have exactly 1 item(s)')
			}
		]
	},
	{
		label: 'Simple required array of strings variable with min/max number of elements',
		schema: {
			type: 'string',
			multiple: true,
			required: [1,2]
		},
		data: {
			undef: undefined,
			empty: [],
			single: ['test']
		},
		newData: {
			undef: undefined,
			empty: [],
			single: ['newString'],
			double: ['test1', 'test2']
		},
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['single', 'undef', false],
				result: ['test']
			},
			{
				input: [
					[false, 'empty', 'global'],
					[false, 'empty', 'specific']
				],
				throws: new errors.DataItemsError('Must have between 1 and 2 item(s)')
			},
			{
				input: [
					['undef', 'single', false],
					['empty', 'single', false]
				],
				result: ['newString']
			},
			{
				label: 'Will return empty array as don\'t check existing data',
				input: ['empty', 'undef', false],
				result: []
			},
			{
				input: ['empty', 'empty', false],
				throws: new errors.DataItemsError('Must have between 1 and 2 item(s)')
			},
			{
				input: ['single', 'empty', 'empty'],
				result: ['test']
			},
			{
				input: [
					['single', 'empty', 'global'],
					['single', 'empty', 'specific']
				],
				throws: new errors.DataItemsError('Must have between 1 and 2 item(s)')
			},
			{
				input: ['single', 'single', 'empty'],
				result: ['test', 'newString']
			},
			{
				input: ['single', 'double', 'empty'],
				throws: new errors.DataItemsError('Must have between 1 and 2 item(s)')
			},
			{
				input: [
					['single', 'single', 'global'],
					['single', 'single', 'specific']
				],
				result: ['newString']
			},
			{
				input: [
					['empty', 'double', 'empty'],
					['empty', 'double', 'dont'],
					[false, 'double', 'global'],
					[false, 'double', 'specific']
				],
				result: ['test1', 'test2']
			}
		]
	},
	{
		label: 'Simple required array of strings variable with min number of elements',
		schema: {
			type: 'string',
			multiple: true,
			required: [1]
		},
		data: {
			undef: undefined,
			empty: [],
			single: ['test']
		},
		newData: {
			undef: undefined,
			empty: [],
			single: ['newString'],
			double: ['test1', 'test2']
		},
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['single', 'undef', false],
				result: ['test']
			},
			{
				input: [
					[false, 'empty', 'global'],
					[false, 'empty', 'specific']
				],
				throws: new errors.DataItemsError('Must have atleast 1 item(s)')
			},
			{
				input: [
					['undef', 'single', false],
					['empty', 'single', false]
				],
				result: ['newString']
			},
			{
				label: 'Will return empty array as don\'t check existing data',
				input: ['empty', 'undef', false],
				result: []
			},
			{
				input: ['empty', 'empty', false],
				throws: new errors.DataItemsError('Must have atleast 1 item(s)')
			},
			{
				input: ['single', 'empty', 'empty'],
				result: ['test']
			},
			{
				input: [
					['single', 'empty', 'global'],
					['single', 'empty', 'specific']
				],
				throws: new errors.DataItemsError('Must have atleast 1 item(s)')
			},
			{
				input: ['single', 'double', 'empty'],
				result: ['test', 'test1', 'test2']
			},
			{
				input: ['single', 'single', 'empty'],
				result: ['test', 'newString']
			},
			{
				input: [
					['single', 'single', 'global'],
					['single', 'single', 'specific']
				],
				result: ['newString']
			}
		]
	}
];

buildTests('Multiple (Array) type tests', suites);
