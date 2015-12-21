//"use strict";

var skemer = require('../src/lib/skemer.js');
var skemerSchemas = require('../src/lib/schema.js');

describe('Internal schema check', function() {
	it('validates schema schema', function() {
		var object = skemer.addData(skemerSchemas.schema, {
			type: skemerSchemas.schema[0].type,
			types: skemerSchemas.schema[0].types
		});
		console.log('validated object', object);
		console.log('should be', skemerSchemas.schema[0]);
		expect(object).toEqual(skemerSchemas.schema[0]);
	});
});
