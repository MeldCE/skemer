"use strict"
let skemer = require('./src/lib/skemer.js');
let skemerSchemas = require('./src/lib/schema.js');

let schema = {
	type: {
		doc: {
			type: 'string'
		},
		/**
		 * type can be:
		 * - a string value
		 * - an object containing a schema
		 * - null - meaning the data value will contain a value that should be
		 *   validated by the schema
		 */
		type: {
			types: [
				{
					type: 'string',
				},
				{
					type: null // type can be an object containing a schema
				},
			],
			//required: true
		},
		types: {
			type: null, // null is a magical value to represent the schema (schema within the schema)
			multiple: true
		},
		max: {
			type: 'number'
		},
		min: {
			type: 'number'
		},
		multiple: {
			types: [
				{
					type: 'boolean'
				},
				{
					type: 'number',
					multiple: [1, 2]
				}
			]
		}
	}
};



skemer.validateAddData({schema: schema}, schema);
//Skemer(object, skemerSchemas.schemaSchema, skemerSchemas.buildDocOptions);

console.log(object);





function hello2(id, blah) {
		console.log('hello2', id, blah);
}

function generator(test) {
	var test2 = 'peanuts';

	var fn = function() {
		console.log('fn', test, test2);
	};

	fn.hello = function() {
		console.log('hello');
	}

	fn.hello2 = hello2.bind(this, test);

	return fn;
}

var func = generator('bob');
func();
func.hello();
func.hello2('sdfsdf');