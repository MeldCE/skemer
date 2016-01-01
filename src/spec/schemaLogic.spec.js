var skemerErrors = require('../lib/errors.js');
var buildTests = require('./lib/builder.js');
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
	}
];


