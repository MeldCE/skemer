var skemer = require('../lib/skemer.js');
var errors = require('../lib/errors.js');

/**
 * This spec is designed to test the objects and functions in the Skemer
 * module
 */


var schema = {
	type: 'string'
};

var valid = 'a string';
var valid1 = 'another string';
var valid2 = 'a different string';

var invalid = false;


describe('Skemer module', function() {
	describe('Skemer prototype', function() {
		it('should throw on an invalid options', function() {
			expect(function() { 
				skemer.Skemer({
					schema: schema,
					replace: 'bad'
				});
			}).toThrow(new errors.OptionsError('Invalid value for options.replace'));
		});

		it('should throw on no schema', function() {
			expect(function() { 
				skemer.Skemer({});
			}).toThrow(new errors.SchemaError('Value for options.schema required'));
		});

		it('should throw on invalid schema', function() {
			expect(function() {
				skemer.Skemer({
					schema: {
						type: true
					}
				});
			}).toThrow(new errors.SchemaError('Invalid value for options.schema.type'));
		});

		it('should return a working Skemer when valid', function() {
			var Skemer = new skemer.Skemer({
				schema: schema
			});

			expect(Skemer).toEqual(jasmine.any(skemer.Skemer));
			expect(function() {
				Skemer.validateAdd(invalid);
			}).toThrow(new errors.DataTypeError('Value must be a string'));
			expect(Skemer.validateAdd(valid)).toEqual(valid);
			expect(Skemer.validateAdd(valid, valid1, valid2)).toEqual(valid2);
			expect(Skemer.validateNew(valid)).toEqual(valid);
		});

		it('should validate new data', function() {
			expect(function() {
				skemer.validateAdd({ schema: schema }, invalid);
			}).toThrow(new errors.DataTypeError('Value must be a string'));
			expect(function() {
				skemer.validateNew({ schema: schema }, invalid);
			}).toThrow(new errors.DataTypeError('Value must be a string'));
		});

		xit('should not validate existing data', function() {
			expect(skemer.validateAdd({ schema: schema }, invalid)).toEqual(invalid);
		});
	});
});
