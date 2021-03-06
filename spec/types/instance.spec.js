var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

/**
 * Test prototype function
 *
 * @param {number} num A random number
 *
 * @class
 */
function TestPrototype(num) {
  this.num = num;
}

global.TestPrototype = TestPrototype;

var proto1 = new TestPrototype(1);
var proto2 = new TestPrototype(2);


// Test Data
var suites = [
  {
    label: 'Simple TestPrototype instance variable',
    schema: {
      type: 'TestPrototype'
    },
    data: {
      undef: undefined,
      proto: proto1
    },
    newData: {
      undef: undefined,
      invalid: {},
      proto: proto2
    },
    options: [{}],
    results: [
      {
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original prototype instance',
        input: ['proto', 'undef', false],
        result: proto1
      },
      {
        label: 'should throw on a non-prototype instance value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a TestPrototype')
      },
      {
        label: [
          'should return the new prototype instance',
          'should not throw on an invalid original value'
        ],
        input: [false, 'proto', false],
        result: proto2
      }
    ]
  },
  {
    label: 'non-existent instance schema',
    schema: {
      type: 'SomethingInvalid'
    },
    data: {
      undef: undefined
    },
    newData: {
      proto: proto1
    },
    options: [{}],
    results: [
      {
        label: 'should throw if the given prototype doesn\'t exist',
        input: [false, 'proto', false],
        throws: new errors.SchemaError('Error determining type to test '
            + 'against: ReferenceError: SomethingInvalid is not defined')
      }
    ]
  }
];

buildTests('Null type tests', suites);
