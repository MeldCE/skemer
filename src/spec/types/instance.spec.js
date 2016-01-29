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

var proto1 = new TestPrototype(1);
var proto2 = new TestPrototype(2);


// Test Data
var suites = [
  {
    pending: true,
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
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        input: ['proto', 'undef', false],
        result: proto1
      },
      {
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a null')
      },
      {
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
        input: [false, 'proto', false],
        throws: new errors.SchemaError('Error determining type to test '
            + 'against: ReferenceError: SomethingInvalid is not defined')
      }
    ]
  }
];

buildTests('Null type tests', suites);
