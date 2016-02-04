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
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original string',
        input: ['string', 'undef', false],
        result: 'test'
      },
      {
        label: 'should throw on a non-string value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a string')
      },
      {
        label: 'should return the given empty string',
        input: [false, 'empty', false],
        result: ''
      },
      {
        label: 'should return the given string',
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
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original string',
        input: ['string', 'undef', false],
        result: 'test'
      },
      {
        label: 'should return the given empty string',
        input: [false, 'empty', false],
        result: ''
      },
      {
        label: 'should return the given string',
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
        label: 'should return the default value',
        input: ['undef', 'undef', false],
        result: 'default'
      },
      {
        label: 'should return the original string',
        input: ['string', 'undef', false],
        result: 'test'
      },
      {
        label: 'should return the given empty string',
        input: [false, 'empty', false],
        result: ''
      },
      {
        label: 'should return the given string',
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
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original string',
        input: ['string', 'undef', false],
        result: 'test'
      },
      {
        label: 'should throw a minimum length required error',
        input: [false, 'empty', false],
        throws: new errors.DataRangeError('Value must be atleast 4 '
            + 'characters and no more than 9 characters')
      },
      {
        label: 'should throw a minimum length required error',
        input: [false, 'shortString', false],
        throws: new errors.DataRangeError('Value must be atleast 4 '
            + 'characters and no more than 9 characters')
      },
      {
        label: 'should return the given string',
        input: [false, 'string', false],
        result: 'more'
      },
      {
        label: 'should return the given string',
        input: [false, 'longString', false],
        result: 'newString'
      },
      {
        label: 'should throw a maximum length error',
        input: [false, 'longerString', false],
        throws: new errors.DataRangeError('Value must be atleast 4 '
            + 'characters and no more than 9 characters')
      }
    ]
  },
  {
    label: 'Simple required string variable with restricted values',
    schema: {
      type: 'string',
      required: true,
      values: ['test']
    },
    data: {
      undef: undefined,
      string: 'oldString'
    },
    newData: {
      undef: undefined,
      empty: '',
      string: 'newString',
      validString: 'test'
    },
    options: [{}],
    results: [
      {
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return original string as orginal string not validated',
        input: ['string', 'undef', false],
        result: 'oldString'
      },
      {
        label: 'should return valid new string',
        input: [false, 'validString', false],
        result: 'test'
      },
      {
        label: 'should throw as string is invalid',
        input: [false, 'empty', false],
        throws: new errors.DataInvalidError('Value of \'\' is not one of the '
            + 'allowed values (test)')
      },
      {
        label: 'should throw as string is invalid',
        input: [false, 'string', false],
        throws: new errors.DataInvalidError('Value of \'newString\' is not '
            + 'one of the allowed values (test)')
      }
    ]
  },
  {
    label: 'Simple required string variable with regex validation',
    schema: {
      type: 'string',
      required: true,
      regex: /^\w+@\w+\.\w+$/
    },
    data: {
      undef: undefined,
      string: 'oldString'
    },
    newData: {
      undef: undefined,
      empty: '',
      string: 'newString',
      validString: 'bob@bob.com'
    },
    options: [{}],
    results: [
      {
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return original string as orginal string not validated',
        input: ['string', 'undef', false],
        result: 'oldString'
      },
      {
        label: 'should return valid new string',
        input: [false, 'validString', false],
        result: 'bob@bob.com'
      },
      {
        label: 'should throw as string is invalid',
        input: [false, 'empty', false],
        throws: new errors.DataInvalidError('Value of \'\' does not meet the '
            + 'required pattern of /^\\w+@\\w+\\.\\w+$/')
      },
      {
        label: 'should throw as string is invalid',
        input: [false, 'string', false],
        throws: new errors.DataInvalidError('Value of \'newString\' does not '
            + 'meet the required pattern of /^\\w+@\\w+\\.\\w+$/')
      }
    ]
  }
];

buildTests('String type tests', suites);
