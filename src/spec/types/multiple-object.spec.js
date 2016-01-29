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
  }
};

var suites = [
  {
    label: 'Simple multiple of strings variable stored in an object',
    schema: {
      type: 'string',
      multiple: true,
      object:  true
    },
    data: {
      undef: undefined,
      empty: {},
      single: {
        one: 'test'
      },
      double: {
        one: 'test1',
        two: 'test2'
      },
      invalid: 'string'
    },
    newData: {
      undef: undefined,
      invalid: 'notinarray',
      empty: {},
      array: ['string'],
      double: {
        one: 'newString',
        three: 'test3'
      }
    },
    options: clone(options),
    results: [
      {
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        input: ['single', 'undef', false],
        result: {
          one: 'test'
        }
      },
      {
        input: [
          ['undef', 'invalid', 'empty'],
          ['empty', 'invalid', 'empty'],
          ['single', 'invalid', 'empty'],
          ['double', 'invalid', 'empty']
        ],
        throws: new errors.DataTypeError('Value must be an object of values (string given)')
      },
      {
        input: [
          ['invalid', 'undef', 'empty'],
          ['invalid', 'empty', 'empty'],
          ['invalid', 'double', 'empty']
        ],
        throws: new errors.DataTypeError('Existing data is not an object as it should be')
      },
      {
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
        result: {}
      },
      {
        label: 'should work with arrays',
        input: [['undef', 'array', false], ['empty', 'array', false]],
        result: {
          0: 'string'
        }
      },
      {
        input: [['empty', 'undef', false], ['empty', 'empty', false]],
        result: {}
      },
      {
        input: [['single', 'undef', 'empty'], ['single', 'empty', 'empty'],['single', 'undef', 'dont'], ['single', 'empty', 'dont']],
        result: {
          one: 'test'
        }
      },
      {
        label: 'should merge array into existing object',
        input: [
          ['single', 'array', 'empty'],
          ['single', 'array', 'dont']
        ],
        result: {
          one: 'test',
          0: 'string'
        }
      },
      {
        input: [
          ['double', 'double', 'empty'],
          ['double', 'double', 'dont']
        ],
        result: {
          one: 'newString',
          two: 'test2',
          three: 'test3'
        }
      },
      {
        label: 'should replace existing object',
        input: [
          ['double', 'double', 'global'],
          ['double', 'double', 'specific'] 
        ],
        result: {
          one: 'newString',
          three: 'test3'
        }
      }
    ]
  },
  {
    label: 'Simple multiple of strings variable stored in an object',
    schema: {
      type: 'string',
      multiple: true,
      object:  true,
      required: true
    },
    data: {
      undef: undefined,
      empty: {},
      single: {
        one: 'test'
      },
      double: {
        one: 'test1',
        two: 'test2'
      },
      invalid: 'string'
    },
    newData: {
      undef: undefined,
      invalid: 'notinarray',
      empty: {},
      array: ['string'],
      double: {
        one: 'newString',
        three: 'test3'
      }
    },
    options: clone(options),
    results: [
      {
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        input: ['single', 'undef', false],
        result: {
          one: 'test'
        }
      },
      {
        input: [
          ['undef', 'invalid', 'empty'],
          ['empty', 'invalid', 'empty'],
          ['single', 'invalid', 'empty'],
          ['double', 'invalid', 'empty']
        ],
        throws: new errors.DataTypeError('Value must be an object of values (string given)')
      },
      {
        input: ['invalid', false, false],
        throws: new errors.DataTypeError('Existing data is not an object as it should be')
      },
      {
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
        result: {}
      },
      {
        label: 'should work with arrays',
        input: [['undef', 'array', false], ['empty', 'array', false]],
        result: {
          0: 'string'
        }
      },
      {
        input: [['empty', 'undef', false], ['empty', 'empty', false]],
        result: {}
      },
      {
        input: [['single', 'undef', 'empty'], ['single', 'empty', 'empty'],['single', 'undef', 'dont'], ['single', 'empty', 'dont']],
        result: {
          one: 'test'
        }
      },
      {
        label: 'should merge array into existing object',
        input: [
          ['single', 'array', 'empty'],
          ['single', 'array', 'dont']
        ],
        result: {
          one: 'test',
          0: 'string'
        }
      },
      {
        input: [
          ['double', 'double', 'empty'],
          ['double', 'double', 'dont']
        ],
        result: {
          one: 'newString',
          two: 'test2',
          three: 'test3'
        }
      },
      {
        label: 'should replace existing object',
        input: [
          ['double', 'double', 'global'],
          ['double', 'double', 'specific'] 
        ],
        result: {
          one: 'newString',
          three: 'test3'
        }
      }
    ]
  },
  {
    label: 'Simple multiple of strings variable stored in an object with a '
        + 'default value',
    schema: {
      type: 'string',
      multiple: true,
      object:  true,
      default: { default: 'string' }
    },
    data: {
      undef: undefined,
      empty: {},
      single: {
        one: 'test'
      },
      double: {
        one: 'test1',
        two: 'test2'
      },
      invalid: 'string'
    },
    newData: {
      undef: undefined,
      invalid: 'notinarray',
      empty: {},
      array: ['string'],
      double: {
        one: 'newString',
        three: 'test3'
      }
    },
    options: clone(options),
    results: [
      {
        input: ['undef', 'undef', false],
        result: { default: 'string' }
      },
      {
        input: ['single', 'undef', false],
        result: {
          one: 'test'
        }
      },
      {
        input: [
          ['undef', 'invalid', 'empty'],
          ['empty', 'invalid', 'empty'],
          ['single', 'invalid', 'empty'],
          ['double', 'invalid', 'empty']
        ],
        throws: new errors.DataTypeError('Value must be an object of values (string given)')
      },
      {
        input: ['invalid', false, false],
        throws: new errors.DataTypeError('Existing data is not an object as it should be')
      },
      {
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
        result: {}
      },
      {
        label: 'should work with arrays',
        input: [['undef', 'array', false], ['empty', 'array', false]],
        result: {
          0: 'string'
        }
      },
      {
        input: [['empty', 'undef', false], ['empty', 'empty', false]],
        result: {}
      },
      {
        input: [['single', 'undef', 'empty'], ['single', 'empty', 'empty'],['single', 'undef', 'dont'], ['single', 'empty', 'dont']],
        result: {
          one: 'test'
        }
      },
      {
        label: 'should merge array into existing object',
        input: [
          ['single', 'array', 'empty'],
          ['single', 'array', 'dont']
        ],
        result: {
          one: 'test',
          0: 'string'
        }
      },
      {
        input: [
          ['double', 'double', 'empty'],
          ['double', 'double', 'dont']
        ],
        result: {
          one: 'newString',
          two: 'test2',
          three: 'test3'
        }
      },
      {
        label: 'should replace existing object',
        input: [
          ['double', 'double', 'global'],
          ['double', 'double', 'specific'] 
        ],
        result: {
          one: 'newString',
          three: 'test3'
        }
      }
    ]
  }
];

buildTests('Multiple (Object) type tests', suites);
