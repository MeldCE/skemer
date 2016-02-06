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
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original number',
        input: ['number', 'undef', false],
        result: 34
      },
      {
        label: 'should throw on a non-numerical number',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a number')
      },
      {
        label: 'should return 0',
        input: [false, 'zero', false],
        result: 0
      },
      {
        label: 'should return the given number',
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
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original value',
        input: ['number', 'undef', false],
        result: 34
      },
      {
        label: 'should return 0',
        input: [false, 'zero', false],
        result: 0
      },
      {
        label: 'should return the given number',
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
      number: 3
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
        label: 'should throw on a non-numerical value',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: [
          'should not validate original number',
          'should return the original number'
        ],
        input: ['number', 'undef', false],
        result: 3
      },
      {
        label: 'should throw if number is below minimum',
        input: [false, 'zero', false],
        throws: new errors.DataRangeError('Value must be greater than or '
            + 'equal to 4 and less than 9')
      },
      {
        label: 'should throw if number is below minimum',
        input: [false, 'smallNumber', false],
        throws: new errors.DataRangeError('Value must be greater than or '
            + 'equal to 4 and less than 9')
      },
      {
        label: 'should return given number if within min/max',
        input: [false, 'number', false],
        result: 4
      },
      {
        label: 'should return given number if within min/max',
        input: [false, 'bigNumber', false],
        result: 8
      },
      {
        label: 'should throw if number is equal to or above maximum',
        input: [false, 'biggerNumber', false],
        throws: new errors.DataRangeError('Value must be greater than or '
            + 'equal to 4 and less than 9')
      }
    ]
  }
];

buildTests('Number type tests', suites);
