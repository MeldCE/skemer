var skemer = require('../lib/skemer.js');
var errors = require('../lib/errors.js');

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
          schema: stringSchema,
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
        func({ schema: stringSchema }, aString, aString).then(function(data) {
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

describe('Skemer prototype using promises', function() {
  var Skemer = new skemer.Skemer({
    schema: stringSchema
  });
  
  //Skemer.promiseValidateAdd(43);

  //return;

  var promiseValidators = ['promiseValidateNew', 'promiseValidateAdd'], i;

  for (i in promiseValidators) {
    describe(promiseValidators[i], function(func) {
      it('should reject on an error', function(done) {
        Skemer[func](43, 43).then(function() {
          fail('Resolved the promise');
          done();
        }, function(err) {
          expect(err).toEqual(new errors.DataTypeError('Value must be a '
              + 'string'));
          done();
        });
      });

      it('should resolve when all good', function(done) {
        Skemer[func](aString, aString).then(function(data) {
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

