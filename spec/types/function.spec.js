var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

/** @private
 * Old Function
 *
 * @returns {undefined}
 */
function oldFunc() {
}

/** @private
 * New Function
 *
 * @returns {undefined}
 */
function newFunc() {
}

// Test Data
var suites = [
	{
		label: 'simple function variable',
		schema: {
			type: 'function'
		},
		data: {
			undef: undefined,
			func: oldFunc
		},
		newData: {
			undef: undefined,
			invalid: 'string',
			func: newFunc
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: ['func', 'undef', false],
				result: oldFunc
			},
			{
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('Value must be a function')
			},
			{
				input: [false, 'func', false],
				result: newFunc
			}
		]
	},
	{
		label: 'simple function variable declare as prototype',
		schema: {
			type: 'Function'
		},
		data: {
			undef: undefined,
			func: oldFunc
		},
		newData: {
			undef: undefined,
			invalid: 'string',
			func: newFunc
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: ['func', 'undef', false],
				result: oldFunc
			},
			{
				input: [false, 'invalid', false],
				throws: new errors.DataTypeError('Value must be a function')
			},
			{
				input: [false, 'func', false],
				result: newFunc
			}
		]
	},
	{
		label: 'Simple required number variable',
		schema: {
			type: 'function',
			required: true
		},
		data: {
			undef: undefined,
			func: oldFunc
		},
		newData: {
			undef: undefined,
			invalid: 'string',
			func: newFunc
		},
		options: [{}],
		results: [
			{
				input: ['undef', 'undef', false],
				throws: new errors.DataRequiredError('Value required')
			},
			{
				input: ['func', 'undef', false],
				result: oldFunc
			},
			{
				input: [false, 'func', false],
				result: newFunc
			}
		]
	}
];

buildTests('Function type tests', suites);
