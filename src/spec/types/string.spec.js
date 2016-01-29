var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Test Data
var suites = [
  {
    label: 'Simple string variable',
    schema: {
      type: 'string'
    },
    data: {
      undef: undefined,
      string: 'test'
    },
    newData: {
      undef: undefined,
      invalid: 54,
      empty: '',
      string: 'newString'
    },
    options: [{}],
    results: [
      {
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        input: ['string', 'undef', false],
        result: 'test'
      },
      {
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a string')
      },
      {
        input: [false, 'empty', false],
        result: ''
      },
      {
        input: [false, 'string', false],
        result: 'newString'
      }
    ]
  },
  {
    label: 'Simple required string variable',
    schema: {
      type: 'string',
      required: true
    },
    data: {
      undef: undefined,
      string: 'test'
    },
    newData: {
      undef: undefined,
      empty: '',
      string: 'newString'
    },
    options: [{}],
    results: [
      {
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        input: ['string', 'undef', false],
        result: 'test'
      },
      {
        input: [false, 'empty', false],
        result: ''
      },
      {
        input: [false, 'string', false],
        result: 'newString'
      }
    ]
  },
  {
    label: 'Simple required string variable with default',
    schema: {
      type: 'string',
      required: true,
      default: 'default'
    },
    data: {
      undef: undefined,
      string: 'test'
    },
    newData: {
      undef: undefined,
      empty: '',
      string: 'newString'
    },
    options: [{}],
    results: [
      {
        input: ['undef', 'undef', false],
        result: 'default'
      },
      {
        input: ['string', 'undef', false],
        result: 'test'
      },
      {
        input: [false, 'empty', false],
        result: ''
      },
      {
        input: [false, 'string', false],
        result: 'newString'
      }
    ]
  },
  {
    label: 'Simple require string with min/max length requirements',
    schema: {
      type: 'string',
      required: true,
      min: 4,
      max: 9
    },
    data: {
      undef: undefined,
      string: 'test'
    },
    newData: {
      undef: undefined,
      empty: '',
      shortString: 'and',
      string: 'more',
      longString: 'newString',
      longerString: 'newString1'
    },
    options: [{}],
    results: [
      {
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        input: ['string', 'undef', false],
        result: 'test'
      },
      {
        input: [false, 'empty', false],
        throws: new errors.DataRangeError('Value must be atleast 4 '
            + 'characters and no more than 9 characters')
      },
      {
        input: [false, 'shortString', false],
        throws: new errors.DataRangeError('Value must be atleast 4 '
            + 'characters and no more than 9 characters')
      },
      {
        input: [false, 'string', false],
        result: 'more'
      },
      {
        input: [false, 'longString', false],
        result: 'newString'
      },
      {
        input: [false, 'longerString', false],
        throws: new errors.DataRangeError('Value must be atleast 4 '
            + 'characters and no more than 9 characters')
      }
    ]
  }
];

buildTests('String type tests', suites);
