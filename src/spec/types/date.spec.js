var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Test Data
var suites = [
  {
    label: 'simple date variable',
    schema: {
      type: 'Date'
    },
    data: {
      undef: undefined,
      date: new Date('2015-11-01')
    },
    newData: {
      undef: undefined,
      invalid: 'string',
      date: new Date('2014-11-12')
    },
    options: [{}],
    results: [
      {
        label: 'should return an undefined value',
        input: ['undef', 'undef', false],
        result: undefined
      },
      {
        label: 'should return the original date',
        input: ['date', 'undef', false],
        result: new Date('2015-11-01')
      },
      {
        label: 'should throw on a non-date value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a Date')
      },
      {
        label: [
          'should return the new date',
          'should not throw on an invalid original value'
        ],
        input: [false, 'date', false],
        result: new Date('2014-11-12')
      }
    ]
  },
  {
    label: 'simple required date variable',
    schema: {
      type: 'Date',
      required: true
    },
    data: {
      undef: undefined,
      date: new Date('2015-11-01')
    },
    newData: {
      undef: undefined,
      invalid: 'string',
      date: new Date('2014-11-12')
    },
    options: [{}],
    results: [
      {
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original date',
        input: ['date', 'undef', false],
        result: new Date('2015-11-01')
      },
      {
        label: 'should throw on a non-date value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a Date')
      },
      {
        label: [
          'should return the new date',
          'should not throw on an invalid original value'
        ],
        input: [false, 'date', false],
        result: new Date('2014-11-12')
      }
    ]
  },
  {
    pending: true,
    label: 'simple required date variable with min/max requirements',
    schema: {
      type: 'Date',
      required: true,
      min: new Date('2015-12-31'),
      max: new Date('2016-01-01')
    },
    data: {
      undef: undefined,
      date: new Date('2015-11-01')
    },
    newData: {
      undef: undefined,
      invalid: 'string',
      before: new Date('2015-11-30'),
      during: new Date('2015-11-31'),
      after: new Date('2016-01-02')
    },
    options: [{}],
    results: [
      {
        label: 'should throw a value required error',
        input: ['undef', 'undef', false],
        throws: new errors.DataRequiredError('Value required')
      },
      {
        label: 'should return the original date',
        input: ['date', 'undef', false],
        result: new Date('2015-11-1')
      },
      {
        label: 'should throw on a non-date value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a Date')
      },
      {
        label: 'should throw an error when date is before minimum date',
        input: [false, 'before', false],
        throws: new errors.DataRangeError('Value must be greater than or '
            + 'equal to 4 and less than 9')
      },
      {
        label: 'should return date when within range',
        input: [false, 'during', false],
        result: new Date('2014-11-12')
      },
      {
        label: 'should throw an error when date is after maximum date',
        input: [false, 'after', false],
        throws: new errors.DataRangeError('Value must be greater than or '
            + 'equal to 4 and less than 9')
      }
    ]
  }
];

buildTests('Date type tests', suites);
