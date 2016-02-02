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
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original function',
        input: ['func', 'undef', false],
        result: oldFunc
      },
      {
        label: 'should throw on a non-function value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a function')
      },
      {
        label: [
          'should return the new function',
          'should not throw on an invalid original value'
        ],
        input: [false, 'func', false],
        result: newFunc
      }
    ]
  },
  {
    label: 'simple function variable declared prototype name (Function)',
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
        label: 'should return an undefined value',
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
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the old function',
        input: ['func', 'undef', false],
        result: oldFunc
      },
      {
        label: 'should return the new function',
        input: [false, 'func', false],
        result: newFunc
      }
    ]
  }
];

buildTests('Function type tests', suites);
