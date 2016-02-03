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
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original array',
        input: ['single', 'undef', false],
        result: ['test']
      },
      {
        label: 'should throw on a non-array-of-strings value',
        input: [
          ['undef', 'invalid', 'empty'],
          ['empty', 'invalid', 'empty'],
          ['single', 'invalid', 'empty'],
          ['double', 'invalid', 'empty']
        ],
        throws: new errors.DataTypeError('Value must be an array of values (string given)')
      },
      {
        label: 'should throw if the original value is not an array',
        input: ['invalid', false, false],
        throws: new errors.DataTypeError('Existing data is not an array as it should be')
      },
      {
        label: 'should replace the original array with the given empty array',
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
        label: 'should return an array with the new value',
        input: [['undef', 'single', false], ['empty', 'single', false]],
        result: ['newString']
      },
      {
        label: 'should return an empty array',
        input: [['empty', 'undef', false], ['empty', 'empty', false]],
        result: []
      },
      {
        label: 'should return an array with the original value',
        input: ['single', 'empty', 'empty'],
        result: ['test']
      },
      {
        label: 'should return a merged array',
        input: ['single', 'single', 'empty'],
        result: ['test', 'newString']
      },
      {
        label: 'should return a merged array',
        input: ['double', 'single', 'empty'],
        result: ['test1', 'test2', 'newString']
      },
      {
        label: 'should replace the original array with an array with the new '
            + 'value',
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
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original array',
        input: [
          ['single', 'undef', false],
          ['single', 'empty', 'empty'],
          ['single', 'empty', 'dont']
        ],
        result: ['test']
      },
      {
        label: 'should return an empty array',
        input: [
          [false, 'empty', 'global'],
          [false, 'empty', 'specific']
        ],
        result: []
      },
      {
        label: 'should return an array with the new value',
        input: [['undef', 'single', false], ['empty', 'single', false]],
        result: ['newString']
      },
      {
        label: 'should return an empty array',
        input: [['empty', 'undef', false], ['empty', 'empty', false]],
        result: []
      },
      {
        label: 'should return an array with the original value',
        input: ['single', 'empty', 'empty'],
        result: ['test']
      },
      {
        label: 'should replace the original array with an empty array',
        input: [['single', 'empty', 'global'], ['single', 'empty', 'specific'], ['double', 'empty', 'global'], ['double', 'empty', 'specific']],
        result: []
      },
      {
        label: 'should return a merged array',
        input: [
          ['single', 'single', 'empty'],
          ['single', 'single', 'dont']
        ],
        result: ['test', 'newString']
      },
      {
        label: 'should return a merged array',
        input: [
          ['double', 'single', 'empty'],
          ['double', 'single', 'dont']
        ],
        result: ['test1', 'test2', 'newString']
      },
      {
        label: 'should place the original array with an array with the new '
            + 'value',
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
        label: 'should return the default array',
        input: ['undef', 'undef', false],
        result: ['default']
      },
      {
        label: 'should return the original array',
        input: ['single', 'undef', false],
        result: ['test']
      },
      {
        label: 'should throw on a non-array-of-strings value',
        input: [
          ['undef', 'invalid', 'empty'],
          ['empty', 'invalid', 'empty'],
          ['single', 'invalid', 'empty'],
          ['double', 'invalid', 'empty']
        ],
        throws: new errors.DataTypeError('Value must be an array of values (string given)')
      },
      {
        label: 'should throw if the original value is not an array',
        input: [
          ['invalid', 'undef', 'empty'],
          ['invalid', 'empty', 'empty'],
          ['invalid', 'single', 'empty']
        ],
        throws: new errors.DataTypeError('Existing data is not an array as it should be')
      },
      {
        label: 'should replace the original array with the given empty array',
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
        label: 'should return an array with the new value',
        input: [['undef', 'single', false], ['empty', 'single', false]],
        result: ['newString']
      },
      {
        label: 'should return an empty array',
        input: [['empty', 'undef', false], ['empty', 'empty', false]],
        result: []
      },
      {
        label: 'should return the original array',
        input: ['single', 'empty', 'empty'],
        result: ['test']
      },
      {
        label: 'should return a merged array',
        input: ['single', 'single', 'empty'],
        result: ['test', 'newString']
      },
      {
        label: 'should return a merged array',
        input: ['double', 'single', 'empty'],
        result: ['test1', 'test2', 'newString']
      },
      {
        label: 'should the replace original array with an array with the new '
            + 'value',
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
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original array',
        input: ['single', 'undef', false],
        result: ['test']
      },
      {
        label: 'should throw a minimum number of values error',
        input: [
          [false, 'empty', 'global'],
          [false, 'empty', 'specific']
        ],
        throws: new errors.DataItemsError('Must have exactly 1 item(s)')
      },
      {
        label: 'should return the new array',
        input: [
          ['undef', 'single', false],
          ['empty', 'single', false]
        ],
        result: ['newString']
      },
      {
        label: 'should return the original, empty array as original should '
            + 'should not be validated',
        input: ['empty', 'undef', false],
        result: []
      },
      {
        label: 'should throw a minimum number of values error',
        input: ['empty', 'empty', false],
        throws: new errors.DataItemsError('Must have exactly 1 item(s)')
      },
      {
        label: 'should return the original array',
        input: ['single', 'empty', 'empty'],
        result: ['test']
      },
      {
        label: [
          'should replace existing array with empty array',
          'should throw a minimum number of values error'
        ],
        input: [
          ['single', 'empty', 'global'],
          ['single', 'empty', 'specific']
        ],
        throws: new errors.DataItemsError('Must have exactly 1 item(s)')
      },
      {
        label: [
          'should merge the arrays',
          'should throw a maximum number of values error'
        ],
        input: [
          ['single', 'single', 'empty'],
          ['single', 'double', 'empty']
        ],
        throws: new errors.DataItemsError('Must have exactly 1 item(s)')
      },
      {
        label: [
          'should replace existing array',
          'should return an array containing the new value'
        ],
        input: [
          ['single', 'single', 'global'],
          ['single', 'single', 'specific']
        ],
        result: ['newString']
      },
      {
        label: 'should throw a maximum number of values error',
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
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original array',
        input: ['single', 'undef', false],
        result: ['test']
      },
      {
        label: 'should throw a minimum number of values error',
        input: [
          [false, 'empty', 'global'],
          [false, 'empty', 'specific']
        ],
        throws: new errors.DataItemsError('Must have between 1 and 2 item(s)')
      },
      {
        label: 'should return an array with the new value in it',
        input: [
          ['undef', 'single', false],
          ['empty', 'single', false]
        ],
        result: ['newString']
      },
      {
        label: 'should return the original, empty array as original array '
            + 'should not be validated',
        input: ['empty', 'undef', false],
        result: []
      },
      {
        label: 'should throw a minimum number of values error',
        input: ['empty', 'empty', false],
        throws: new errors.DataItemsError('Must have between 1 and 2 item(s)')
      },
      {
        label: 'should return the original array',
        input: ['single', 'empty', 'empty'],
        result: ['test']
      },
      {
        label: [
          'should replace the existing array with the new empty array',
          'should throw a minimum number of values error'
        ],
        input: [
          ['single', 'empty', 'global'],
          ['single', 'empty', 'specific']
        ],
        throws: new errors.DataItemsError('Must have between 1 and 2 item(s)')
      },
      {
        label: 'should return a merged array',
        input: ['single', 'single', 'empty'],
        result: ['test', 'newString']
      },
      {
        label: [
          'should merge the arrays',
          'should throw a maximum number of values error'
        ],
        input: ['single', 'double', 'empty'],
        throws: new errors.DataItemsError('Must have between 1 and 2 item(s)')
      },
      {
        label: 'should return array with new value',
        input: [
          ['single', 'single', 'global'],
          ['single', 'single', 'specific']
        ],
        result: ['newString']
      },
      {
        label: 'should return array with new values',
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
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original array',
        input: ['single', 'undef', false],
        result: ['test']
      },
      {
        label: 'should throw a minimum number of values error',
        input: [
          [false, 'empty', 'global'],
          [false, 'empty', 'specific']
        ],
        throws: new errors.DataItemsError('Must have atleast 1 item(s)')
      },
      {
        label: 'should return an array with the new value in it',
        input: [
          ['undef', 'single', false],
          ['empty', 'single', false]
        ],
        result: ['newString']
      },
      {
        label: 'should return the original, empty array as original array '
          + 'should not be validated',
        input: ['empty', 'undef', false],
        result: []
      },
      {
        label: 'should throw a minimum number of values error',
        input: ['empty', 'empty', false],
        throws: new errors.DataItemsError('Must have atleast 1 item(s)')
      },
      {
        label: 'should return the orginal array',
        input: ['single', 'empty', 'empty'],
        result: ['test']
      },
      {
        label: 'should throw a minimum number of values error',
        input: [
          ['single', 'empty', 'global'],
          ['single', 'empty', 'specific']
        ],
        throws: new errors.DataItemsError('Must have atleast 1 item(s)')
      },
      {
        label: 'should return an array of merged values',
        input: ['single', 'double', 'empty'],
        result: ['test', 'test1', 'test2']
      },
      {
        label: 'should return an array of merged values',
        input: ['single', 'single', 'empty'],
        result: ['test', 'newString']
      },
      {
        label: 'should return array with new value',
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
