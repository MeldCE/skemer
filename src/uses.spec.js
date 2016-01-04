var skemer = require('../lib/skemer.js');
var errors = require('../lib/errors.js');

/**
 * This spec is designed to test the objects and functions in the Skemer
 * module
 */

//=include testSchema.js

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
		});
	});
});
