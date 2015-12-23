var skemerErrors = require('../src/lib/errors.js');
var skemer = require('../src/lib/skemer.js');

var options = [
	{},
	{
		replace: {
			'someVar': true
		}
	},
	{
		replace: true // So leave if no value in data, could do delete if empty value in data
	}
];

// Test Data
var tests = [
	{
		schema: {
			type: {
				doThis: {
					type: 'boolean'
				},
				doThat: {
					type: 'boolean'
				},
				someVar: {
					type: 'string',
					multiple: true
				},
				otherVar: {
					type: {
						another: {
							type: 'boolean'
						},
						vari: {
							type: 'string',
							default: 'mycool'
						},
						varUnknown: {
							type: 'number',
							multiple: true,
							default: [3, 5]
						}
					},
					multiple: true,
					object: true
				},
				notDoneVar: { // TODO
					type: {
						boring: {
							type: 'string' // NOTE using 'string' instead of 'text'
						}
					}
				},
				againNotDoneVar: { // TODO
					type: {
						boring: {
							type: 'string',
							default: 'interesting'
						}
					},
					multiple: true
				}
			}
		},
		object: [
			undefined, // 1
			{}, // 2
			{ // Pretty lame with main level default values removed, what if this was sub-level?
				doThis: false
			},
			{ // 4
				someVar: ['test'],
				otherVar: {
					two: {
						another: false
					}
				}
			},
			{ // 5
				someVar: ['test'],
				otherVar: {
					one: {
						varUnknown: [1]
					},
					two: {
						another: false,
						varUknown: [2]
					}
				}
			}
		],
		data: [
			undefined, // 1
			{}, // 2
			{ // 3
				doThis: true,
				someVar: ['string']
			},
			{ // 4 Should end up throwing as values of otherVar don't match type schema
				doThat: true,
				otherVar : {
					another: true,
					vari: 'blah'
				}
			},
			{ // 5
				doThat: true,
				otherVar : {
					one: {
						another: true,
						vari: 'blah'
					},
					two:{
						varUknown: [7]
					}
				}
			},
			{ // 6 Should throw
				doThis: 'bad string'
			}
		],
		options: options,
		results: [
			{
				input: [[1, 1, 1], [1, 1, 2]],
				comment: 'currently undefined with undefined data - should return undefined',
				result: undefined
			},
			{
				input: [[1,2,false],[2,1,false],[2,2,false]],
				comment: 'Currently undfined with empty object - should return an empty '
						+ 'object',
				result: {}
			},
			{
				input: [[1,3,false],[2.3.false]],
				comment: 'Currently undefined/empty with some new data - should return new data',
				result: {
					doThis: true,
					someVar: ['string']
				}
			},
			{
				input: [false,4,false],
				comment: 'Value for otherVar is not in an object - should throw because '
						+ 'the value otherVar.another is not an object',
				throws: skemerErrors.DataTypeError /// @TODO Change to schema error
			},
			{
				input: [[1,5,false],[2,5,false]],
				comment: [
					'Currently undefined/empty with new data - should return new data',
					'Should return default value for otherVar.*.varUnknown as not set in data'
				],
				result: {
					doThat: true,
					otherVar: {
						one: {
							another: true,
							vari: 'blah',
							varUnknown: [3,5]
						}
					}
				}
			},
			{
				input: [false,6,false],
				comment: 'Value for doThis is string instead of boolean, should throw error',
				throws: skemerErrors.DataTypeError
			},
			{
				input: [[3,1,false],[3,2,false]],
				comment: 'Current value, no new data - should return current data',
				result: {
					doThis: false
				}
			},
			{
				input: [3,3,false],
				comment: 'Current value, new data - should return merged data',
				result: {
					doThis: true,
					someVar: ['string']
				}
			},
			{
				input: [3,5,false],
				comment: [
					'Current value, new data - should return merged data',
					'Should get default value for otherVar.*.varUnknown'
				],
				result: {
					doThat: true,
					doThis: false,
					otherVar: {
						one: {
							another: true,
							vari: 'blah',
							varUnknown: [3, 5]
						}
					}
				}
			},
			{
				input: [[4,1,false],[4,2,false]],
				comment: [
						'Current data, no new data',
						'Should get default value for otherVar.*.varUnknown'
				],
				result: {
					someVar: ['test'],
					otherVar: {
						two: {
							another: false,
							varUnknown: [3, 5]
						}
					}
				}
			},
			{
				input: [4,3,1],
				comment: [
					'Current data and new data',
					'Should append new value of someVar to current value'
				],
				result: {
					doThat: true,
					someVar: ['test', 'string'],
					otherVar: {
						two: {
							another: false
						}
					}
				}
			},
			{
				input: [[4,3,2],[4,3,3]],
				comment: [
					'Current data and new data',
					'Should replace value of someVar with value in data'
				],
				result: {
					doThat: true,
					someVar: ['string'],
					otherVar: {
						two: {
							another: false,
							varUnknown: [3, 5]
						}
					}
				}
			},
			{
				input: [[4,5,1],[4,5,2]],
				comment: [
					'Should merge values for otherVar',
					'As there is not current value for otherVar.two.varUknown, should just '
							+ 'use value from data',
					'Should merge otherVar.two values'
				],
				result: {
					doThat: true,
					someVar: ['test'],
					otherVar: {
						one: {
							another: true,
							varUnknown: [3, 5],
							vari: 'blah'
						},
						two: {
							another: false,
							varUknown: [7]
						}
					}
				}
			},
			{
				input: [4,5,3],
				comment: [
					'Should replace the otherVar object with the new one'
				],
				result: {
					doThat: true,
					someVar: ['test'],
					otherVar: {
						one: {
							another: true,
							varUknown: [3, 5],
							vari: 'blah'
						},
						two: {
							varUnknown: [7]
						}
					}
				}
			},
			{
				input: [[5,1,false],[5,2,false]],
				comment: 'No new data',
				result: {
					someVar: ['test'],
					otherVar: {
						one: {
							varUnknown: [1]
						},
						two: {
							another: false,
							varUknown: [2]
						}
					}
				}
			},
			{
				input: [5,3,1],
				comments: [
					'should append values for someVar'
				],
				result: {
					doThis: true,
					someVar: ['test','string'],
					otherVar: {
						one: {
							varUnknown: [1]
						},
						two: {
							another: false,
							varUknown: [2]
						}
					}
				}
			}
		]
	}
];

// Run the tests
describe('Skemer functionality checks', function() {
	var t, testLabel;
	for (t in tests) {
		var o;

		if (tests[t].label) {
			testLabel = tests[t].label;
		} else {
			testLabel = 'Test ' + t;
		}

		// Add the schema to each test option
		for (o in tests[t].options) {
			tests[t].options.schema = tests[t].schema;
		}

		describe(testLabel, function() {
			var r;

			for (r in this.results) {
				var i;
				var test = this.results[r];
				var comment;

				// Build comment
				comment = 'should return the expected result';
				if (test.comment) {
					if (test.comment instanceof Array && test.comment.length) {
						if (test.comment.length > 1) {
							comment = test.comment.pop();
						} else {
							comment = '';
						}

						comment = test.comment.join(', ') + comment;
					}
				}

				// Make input an array of arrays if it isn't
				if (!(test.input[0] instanceof Array)) {
					test.input = [test.input];
				}

				for (i in test.input) {
					it(comment + ' ' + i, function() {
						var result = skemer.validateAddData(test.options[this[2]],
									test.object[this[0]], test.data[this[1]]);

						expect(result).toEqual(test.result);
					}.bind(this.input[i]));
				}
			}
		}.bind(tests[t]));
	}
});
