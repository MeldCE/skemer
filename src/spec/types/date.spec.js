var errors = require('../../lib/errors.js');
var buildTests = require('../lib/builder.js');

// Min/max dates used in min/max tests
var minDate = new Date('2015-12-31');
var maxDate = new Date('2016-01-01');

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
        throws: new errors.DataTypeError('Value must be a date')
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
        throws: new errors.DataTypeError('Value must be a date')
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
    label: 'simple required date variable with min/max requirements',
    schema: {
      type: 'Date',
      required: true,
      min: minDate,
      max: maxDate
    },
    data: {
      undef: undefined,
      date: new Date('2015-12-01')
    },
    newData: {
      undef: undefined,
      invalid: 'string',
      before: new Date('2015-12-30'),
      during: new Date('2015-12-31'),
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
        result: new Date('2015-12-1')
      },
      {
        label: 'should throw on a non-date value',
        input: [false, 'invalid', false],
        throws: new errors.DataTypeError('Value must be a date')
      },
      {
        label: 'should throw when date is before min date',
        input: [false, 'before', false],
        throws: new errors.DataRangeError('Value must be at or after '
            + minDate.toString() + ' and before ' + maxDate.toString())
      },
      {
        label: 'should return new date'
        input: [false, 'during', false],
        result: new Date('2015-12-31')
      },
      {
        label: 'should throw when date is after max date',
        input: [false, 'after', false],
        throws: new errors.DataRangeError('Value must be at or after '
            + minDate.toString() + ' and before ' + maxDate.toString())
      }
    ]
  }
];

buildTests('Date type tests', suites);
