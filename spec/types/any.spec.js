var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Test Data
var suites = [
  {
    label: 'Simple (any) variable',
    schema: {
      type: 'any'
    },
    data: {
      undef: undefined,
      string: 'testString',
      object: { test: 'cool'}
    },
    newData: {
      undef: undefined,
      number: 74,
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
        label: 'should return the original value',
        input: ['string', 'undef', false],
        result: 'testString'
      },
      {
        label: 'should return the original object',
        input: ['object', 'undef', false],
        result: { test: 'cool' }
      },
      {
        label: 'should return the new numerical value',
        input: [false, 'number', false],
        result: 74
      },
      {
        label: 'should return the new boolean value',
        input: [false, 'boolean', false],
        result: true
      }
    ]
  },
  {
    label: 'Simple required (any) variable',
    schema: {
      type: 'any',
      required: true
    },
    data: {
      undef: undefined,
      string: 'testString',
      object: { test: 'cool'}
    },
    newData: {
      undef: undefined,
      number: 74,
      boolean: true
    },
    options: [{}],
    results: [
      {
        label: 'should throw a value require error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original value',
        input: ['string', 'undef', false],
        result: 'testString'
      },
      {
        label: 'should return the original object',
        input: ['object', 'undef', false],
        result: { test: 'cool' }
      },
      {
        label: 'should return the new numerical value',
        input: [false, 'number', false],
        result: 74
      },
      {
        label: 'should return the new boolean value',
        input: [false, 'boolean', false],
        result: true
      }
    ]
  }
];

buildTests('Any type tests', suites);
