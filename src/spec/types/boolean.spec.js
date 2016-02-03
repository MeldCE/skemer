var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Test Data
var suites = [
  {
    label: 'Simple boolean variable',
    schema: {
      type: 'boolean'
    },
    data: {
      undef: undefined,
      boolean: false
    },
    newData: {
      undef: undefined,
      invalid: 'string',
      boolean: true
    },
    options: [{}],
    results: [
      {
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original boolean value',
        input: ['boolean', 'undef', false],
        result: false
      },
      {
        label: 'should throw on an non-boolean value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a boolean')
      },
      {
        label: 'should return the new boolean value',
        input: [false, 'boolean', false],
        result: true
      }
    ]
  },
  {
    label: 'Simple required boolean variable',
    schema: {
      type: 'boolean',
      required: true
    },
    data: {
      undef: undefined,
      boolean: false
    },
    newData: {
      undef: undefined,
      invalid: 'string',
      boolean: true
    },
    options: [{}],
    results: [
      {
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original boolean value',
        input: ['boolean', 'undef', false],
        result: false
      },
      {
        label: 'should return the new boolean value',
        input: [false, 'boolean', false],
        result: true
      }
    ]
  }
];

buildTests('Boolean type tests', suites);
