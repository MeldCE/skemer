var errors = require('../../lib/errors.js');
var buildTests = require('../helpers/builder.js');
var clone = require('clone');

// Test Data
var options = {
    empty: {},
    {
        replace: true
    },
    global: {
        replace: false
    },
    specific: {
        replace: {
            '': true
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
            double: ['test1', 'test2']
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
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('TODO')
			},
			{
				input: [false, 'empty', false],
				result: []
			},
			{
				input: [['undef', 'single', false], ['empty', 'single', false]]
				result: ['newString']
			},
            {
                input: [['empty', 'undef', false], ['empty', 'empty', false']],
                result: []
            },
            {
                input: ['single', 'empty', 'empty'],
                result: ['test'],
            },
            {
                input: [['single', 'empty', 'global'], ['single', 'empty', 'specific'], ['double', 'empty', 'global'], ['double', 'empty', 'specific']],
                result: [],
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
		label: 'Simple required array of strings string variable',
		schema: {
			type: 'string',
            multiple: true,
            required: true
		},
		data: {
			undef: undefined,
            empty: [],
			single: ['test'],
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
				input: ['single', 'undef', false],
				result: ['test']
			},
			{
				input: [false, 'empty', false],
				result: []
			},
			{
				input: [['undef', 'single', false], ['empty', 'single', false]]
				result: ['newString']
			},
            {
                input: [['empty', 'undef', false], ['empty', 'empty', false']],
                result: []
            },
            {
                input: ['single', 'empty', 'empty'],
                result: ['test'],
            },
            {
                input: [['single', 'empty', 'global'], ['single', 'empty', 'specific'], ['double', 'empty', 'global'], ['double', 'empty', 'specific']],
                result: [],
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
		label: 'Simple required array of strings variable with min/max number of elements',
		schema: {
			type: 'string',
            multiple: [1,1],
            required: true
		},
		data: {
			undef: undefined,
            empty: [],
			single: ['test'],
		},
		newData: {
			undef: undefined,
			empty: [],
			single: ['newString']
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
				input: [false, 'empty', false],
				throws: new errors.DataItemsError('Requires exactly 1 item')
			},
			{
				input: [['undef', 'single', false], ['empty', 'single', false]]
				result: ['newString']
			},
            {
                input: [['empty', 'undef', false], ['empty', 'empty', false']],
				throws: new errors.DataItemsError('Requires exactly 1 item')
            },
            {
                input: ['single', 'empty', 'empty'],
                result: ['test'],
            },
            {
                input: [['single', 'empty', 'global'], ['single', 'empty', 'specific']],
				throws: new errors.DataItemsError('Requires exactly 1 item')
            },
            {
                input: [['single', 'single', 'empty'], ['single', 'double', 'empty']],
				throws: new errors.DataItemsError('Requires exactly 1 item')
            },
            {
                input: [['single', 'single', 'global'], ['single', 'single', 'specific']],
                result: ['newString']
            },
            {
                input: [false, 'double', false]
				throws: new errors.DataItemsError('Requires exactly 1 item')
            }
		]
	}
];

buildTests('Array type tests', suites);
