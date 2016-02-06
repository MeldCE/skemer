var skemer = require('../lib/skemer.js');
var errors = require('../lib/errors.js');
var merge  = require('merge');

/**
 * This spec is designed to test the objects and functions in the Skemer
 * module
 */


var schema = {
  doc: 'A basic schema',
  type: {
    value: {
      doc: 'Some string value',
      type: 'string'
    },
    figure: {
      doc: 'A number value',
      type: 'number',
      min: 20,
      max: 50
    }
  }
};

var valid = {
  value: 'a string',
  figure: 30
};

var valid1 = {
  figure: 35
};

var valid2 = {
  value: 'a different string'
};

var invalid = false;

var stringSchema = {
  type: 'string'
};

var aString = 'string';


describe('Skemer module using promises', function() {
  var promiseValidators = {
    validateNew: skemer.promiseValidateNew,
    validateAdd: skemer.promiseValidateAdd
  }, i;

  for (i in promiseValidators) {
    describe(i, function(func) {
      it('should reject on an error', function(done) {
        func({
          schema: schema,
          replace: 'bad'
        }, {}).then(function() {
          fail('Resolved the promise');
          done();
        }, function(err) {
          expect(err).toEqual(new errors.OptionsError('string value is not '
              + 'allowed for options.replace'));
          done();
        });
      });

      it('should resolve when all good', function(done) {
        func({ schema: stringSchema }, aString).then(function(data) {
          expect(data).toEqual(aString);
          done();
        }, function(err) {
          fail(err);
          done();
        });
      });
    }.bind(this, promiseValidators[i]));
  }
});

