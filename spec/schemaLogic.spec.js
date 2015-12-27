var skemerErrors = require('../src/lib/errors.js');
var skemer = require('../src/lib/skemer.js');
var clone = require('clone');

var options = {
	empty: {},
	replaceSomeVar: {
		replace: {
			'someVar': true
		}
	},
	replaceAll: {
		replace: true // So leave if no value in data, could do delete if empty value in data
	}
};

// Test Data
var suites = [
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
		data: {
			undef: undefined, // 1
			empty: {}, // 2
			XXX: { // Pretty lame with main level default values removed, what if this was sub-level?
				doThis: false
			},
			singleOtherVar: { // 4
				someVar: ['test'],
				otherVar: {
					two: {
						another: false
					}
				}
			},
			twoOtherVar: { // 5
				someVar: ['test'],
				otherVar: {
					one: {
						varUnknown: [1]
					},
					two: {
						another: false,
						varUnknown: [2]
					}
				}
			}
		},
		newData: {
			undef: undefined, // 1
			empty: {}, // 2
			singleSomeVar: { // 3
				doThis: true,
				someVar: ['string']
			},
			invalidOtherVar: { // 4 Should end up throwing as values of otherVar don't match type schema
				doThat: true,
				otherVar : {
					another: true,
					vari: 'blah'
				}
			},
			twoOtherVar: { // 5
				doThat: true,
				otherVar : {
					one: {
						another: true,
						vari: 'blah'
					},
					two:{
						varUnknown: [7]
					}
				}
			},
			invalidDoThis: { // 6 Should throw
				doThis: 'bad string'
			}
		},
		options: clone(options),
		results: [
			{
				input: [['undef','undef','empty'], ['undef','undef','replaceSomeVar']],
				comment: 'currently undefined with undefined data - should return undefined',
				result: undefined
			},
			{
				input: [['undef','empty',false],['empty','undef',false],['empty','empty',false]],
				comment: 'Currently undfined with empty object - should return an empty '
						+ 'object',
				result: {}
			},
			{
				input: [['undef','singleSomeVar',false],['empty','singleSomeVar',false]],
				comment: 'Currently undefined/empty with some new data - should return new data',
				result: {
					doThis: true,
					someVar: ['string']
				}
			},
			{
				input: [false,'invalidOtherVar',false],
				comment: 'Value for otherVar is not in an object - should throw because '
						+ 'the value otherVar.another is not an object',
				throws: new skemerErrors.DataTypeError('Value of otherVar.another should be an Object')
			},
			{
				input: [['undef','twoOtherVar',false],['empty','twoOtherVar',false]],
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
						},
						two: {
							varUnknown: [7],
							vari: 'mycool'
						}
					}
				}
			},
			{
				input: [false,'invalidDoThis',false],
				comment: 'Value for doThis is string instead of boolean, should throw error',
				throws: new skemerErrors.DataTypeError('Value of doThis should be a boolean')
			},
			{
				input: [['XXX','undef',false],['XXX','empty',false]],
				comment: 'Current value, no new data - should return current data',
				result: {
					doThis: false
				}
			},
			{
				input: ['XXX','singleSomeVar',false],
				comment: 'Current value, new data - should return merged data',
				result: {
					doThis: true,
					someVar: ['string']
				}
			},
			{
				input: ['XXX','twoOtherVar',false],
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
						},
						two: {
							vari: 'mycool',
							varUnknown: [7]
						}
					}
				}
			},
			{
				input: [['singleOtherVar','undef',false]],
				comment: [
						'Current data, no newData, data will be validated',
						'Should get default value for otherVar.*.varUnknown and otherVar.*.vari'
				],
				result: {
					someVar: ['test'],
					otherVar: {
						two: {
							another: false,
							vari: 'mycool',
							varUnknown: [3, 5]
						}
					}
				}
			},
			{
				input: [['singleOtherVar','empty',false]],
				comment: [
						'As have newData, data will be considered existing and not validated'
				],
				result: {
					someVar: ['test'],
					otherVar: {
						two: {
							another: false
						}
					}
				}
			},
			{
				input: ['singleOtherVar','singleSomeVar','empty'],
				comment: [
					'Current data and new data',
					'should not use default value for varUnknown and vari as have current value',
					'Should append new value of someVar to current value'
				],
				result: {
					doThis: true,
					someVar: ['test', 'string'],
					otherVar: {
						two: {
							another: false
						}
					}
				}
			},
			{
				input: [['singleOtherVar','singleSomeVar','replaceSomeVar'],['singleOtherVar','singleSomeVar','replaceAll']],
				comment: [
					'Current data and new data',
					'Should replace value of someVar with value in data'
				],
				result: {
					doThis: true,
					someVar: ['string'],
					otherVar: {
						two: {
							another: false
						}
					}
				}
			},
			{
				input: [['singleOtherVar','twoOtherVar','empty'],['singleOtherVar','twoOtherVar','replaceSomeVar']],
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
							vari: 'mycool',
							varUnknown: [7]
						}
					}
				}
			},
			{
				input: ['singleOtherVar','twoOtherVar','replaceAll'],
				comment: [
					'Should replace the otherVar object with the new one'
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
							varUnknown: [7],
							vari: 'mycool'
						}
					}
				}
			},
			{
				input: [['twoOtherVar','undef',false]],
				comment: [
					'no new data so existing data will be validated'
				],
				result: {
					someVar: ['test'],
					otherVar: {
						one: {
							vari: 'mycool',
							varUnknown: [1]
						},
						two: {
							another: false,
							vari: 'mycool',
							varUnknown: [2]
						}
					}
				}
			},
			{
				input: [['twoOtherVar','empty',false]],
				comment: [
					'current data will not be verified as have new (empty) data'
				],
				result: {
					someVar: ['test'],
					otherVar: {
						one: {
							varUnknown: [1]
						},
						two: {
							another: false,
							varUnknown: [2]
						}
					}
				}
			},
			{
				input: ['twoOtherVar','singleSomeVar','empty'],
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
							varUnknown: [2]
						}
					}
				}
			}
		]
	},
	{
		label: 'String schema',
		schema: {
			type: 'string'
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
		options: clone(options),
		results: [
			{
				input: ['undef', 'undef', false],
				result: undefined
			},
			{
				input: ['string', 'undef', false],
				result: 'test'
			},
			{
				input: [false, 'empty', false],
				result: ''
			},
			{
				input: [false, 'string', false],
				result: 'newString'
			}
		]
	}/*,
	{
		label: 'Required fields',
		schema: {
			type: {
				string: {
					type: 'string',
					required: true
				},
				object: {
					type: {
						bool: {
							type: 'boolean',
							required: true
						},
						number: {
							type: 'number',
							required: true
						}
					},
					required: true
				}
			}
		}
	}*/
];

var map = ['data', 'newData', 'options'];

/**
 * Function
 */
function mapFalseInputs(suite, input, p) {
	if (p === undefined) {
		p = 0;
	}

	for (p; p < input.length; p++) {
		if (input[p] === false) {
			var i, newInput = [];

			for (i in suite[map[p]]) {
				var mapped, cloned = input.slice(0);
				cloned[p] = i;
				if ((mapped = mapFalseInputs(suite, cloned, p + 1)) !== true) {
					newInput = newInput.concat(mapped);
				} else {
					newInput.push(cloned);
				}
			}

			return newInput;
		}
	}
	return true;
}


// Fix false inputs
var x;
for (x in suites) {
	var y;
	for (y in suites[x].results) {
		var res = suites[x].results[y];
		// Make input an array of arrays if it isn't
		if (!(res.input[0] instanceof Array)) {
			res.input = [res.input];
		}

		var z;
		for (z = res.input.length - 1; z >= 0; z--) {
			var mapped;
			if ((mapped = mapFalseInputs(suites[x], res.input[z])) !== true) {
				if (z + 1 < res.input.length) {
					res.input = res.input.slice(0, z).concat(mapped, res.input.slice(z + 1));
				} else {
					res.input = res.input.slice(0, z).concat(mapped);
				}
			}
		}
	}
}



// Run the tests
describe('Skemer result checks', function() {
	var s, testLabel;
	for (s in suites) {
		var o;

		if (suites[s].label) {
			testLabel = suites[s].label;
		} else {
			testLabel = 'Test Suite ' + s;
		}

		// Add the schema to each test option
		for (o in suites[s].options) {
			suites[s].options[o].schema = suites[s].schema;
		}

		describe(testLabel, function() {
			//console.log('describe', testLabel, this);
			var r;

			for (r in this.results) {
				var test = this.results[r];
				var comment;

				// Build comment
				comment = 'result';
				if (test.comment) {
					if (test.comment instanceof Array && test.comment.length) {
						if (test.comment.length > 1) {
							comment = ', and ' + test.comment.pop();
						} else {
							comment = '';
						}

						comment = test.comment.join(', ') + comment;
					}
				}

				//console.log('it', comment, r, test);

				describe(comment + ' ' + r, function(testSuite) {
					var i, message;
					//console.log('\n\nstart of it:', '\noptions: ', testSuite.options,
					//			'\ndata: ', testSuite.data, '\nnewData: ', testSuite.newData);

					for (i in this.input) {
						//console.log('input is', this.input[i]);
						if (this.throws) {
							message = 'should throw';
						} else {
							message = 'should return expected value';
						}

						message += ' (' + this.input[i] + ')';
						
						it(message, function(input) {
							//console.log('it:', testSuite, this);
							//console.log('it in', this);
							//console.log('\n\nit:', this, '\ninputs:', this, '\noptions: ', testSuite.options[this[2]],
							//			'\ndata: ', testSuite.object[this[0]], '\nnewData: ', testSuite.data[this[1]]);
							if (this.throws) {
								expect(function () {skemer.validateAddData(testSuite.options[input[2]],
										clone(testSuite.data[input[0]]), 
										clone(testSuite.newData[input[1]]));}).toThrow(this.throws);
							} else {
								var result = skemer.validateAddData(testSuite.options[input[2]],
											clone(testSuite.data[input[0]]),
											clone(testSuite.newData[input[1]]));
							
								expect(result).toEqual(this.result);
							}
						}.bind(this, this.input[i]));
					}
					//break;
				}.bind(test, this));
			}
		}.bind(suites[s]));
	}
});
