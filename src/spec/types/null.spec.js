var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Test Data
var suites = [
  {
    label: 'Simple null variable',
    schema: {
      type: 'null'
    },
    data: {
      undef: undefined,
      nul: null
    },
    newData: {
      undef: undefined,
      invalid: 'string',
      nul: null
    },
    options: [{}],
    results: [
      {
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original null',
        input: ['nul', 'undef', false],
        result: null
      },
      {
        label: 'should throw on a non-null value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a null')
      },
      {
        label: 'should return the given null',
        input: [false, 'nul', false],
        result: null
      }
    ]
  },
  {
    label: 'Simple Null variable',
    schema: {
      type: 'Null'
    },
    data: {
      undef: undefined,
      nul: null
    },
    newData: {
      undef: undefined,
      invalid: 'string',
      nul: null
    },
    options: [{}],
    results: [
      {
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original null',
        input: ['nul', 'undef', false],
        result: null
      },
      {
        label: 'should throw on a non-null value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a null')
      },
      {
        label: 'should return the given null',
        input: [false, 'nul', false],
        result: null
      }
    ]
  }
];

buildTests('Null type tests', suites);
