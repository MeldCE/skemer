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
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        input: ['nul', 'undef', false],
        result: null
      },
      {
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a null')
      },
      {
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
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        input: ['nul', 'undef', false],
        result: null
      },
      {
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a null')
      },
      {
        input: [false, 'nul', false],
        result: null
      }
    ]
  }
];

buildTests('Null type tests', suites);
