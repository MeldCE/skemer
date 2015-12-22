var skemerErrors = require('../src/lib/errors.js')

var options = [
	{},
	{
		add: true
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
							type: 'string', // NOTE using 'string' instead of 'text'
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
			undefined.
			{}.
			{ // Pretty lame with main level default values removed, what if this was sub-level?
				doThis: false
			}.
			{
				someVar: ['test'],
				otherVar: {
					two: {
						another: false
					}
				}
			}.
			{
				someVar: ['test'],
				otherVar: {
					one: {
						varUnknown: [1]
					},
					two: {
						another: false
					}
				}
			}
		],
		data: [
			undefined,
			{},
			{
				doThis: true,
				someVar: ['string']
			},
			{ // Should end up throwing as values of otherVar don't match type schema
				doThat: true,
				otherVar : {
					another: true,
					vari: 'blah'
				}
			},
			{
				doThat: true,
				otherVar : {
					one: {
						another: true,
						vari: 'blah'
					}
				}
			},
			{
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
				input: [[1,2,false],[2,1,false],[2,2,false]]
				comment: 'Currently undfined with empty object - should return an empty '
						+ 'object',
				result: {}
			},
			{
				input: [[1,3,false],[2.3.false]
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
				comment, 'Current value, no new data - should return current data',
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
				input: [3,5,*],
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
				input: [[4,1,*],[4,2,*]],
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
		]
	},
];

// resultObject should be returned. If object is not undefined, object should be modified

data1,object1,options1/2/3

// otherVar multiple = true, therefore default values only happen in a value
resultObject = undefined

data1,object2,options1/2/3

// otherVar multiple = true, therefore default values only happen in a value
resultObject = {}

data1, object3, options1/2/3


resultObject = {
	doThis: false,
	doThat: true
}

data1, object4, options1/2/3

resultObject = {
	someVar: ['test'],
	otherVar: {
		two: {
			another: false,
			var: 'mycool' // Should the default value for doThat be set? - sort of validates current object against schema, could make an option
			varUnknown: [3, 5] // Ditto
		}
	}
}

data2, object1/2, options1/2/3

resultObject = {
	doThis: true,
	someVar: ['string']
}

data2, object3, options1/2/3

resultObject = {
	doThis: true,
	someVar: ['string']
 }

data2, object4, options1/3

resultObject = {
	doThis: true,
	someVar: ['string'],
	otherVar: {
		two: {
			another: false
			var: 'mycool', // Default logic in Line 15
			varUnknown: [3, 5] // Ditto
		}
	}
}

data2, object4, options2

resultObject = {
	doThis: true,
	someVar: ['test', 'string'],
	otherVar: {
		two: {
			another: false,
			var: 'mycool', // Default logic in Line 28
			varUnknown: [3, 5] // Default logic in Line 28
		}
	}
}

data3, object1/2, options1/2/3

resultObject = {
	doThat: true,
	otherVar : {
		one: {
			another: true,
			var: 'blah',
			varUnknown: [3, 5] // Default logic in Line 28
		}
	}
}

data3, object3, options1/2/3

resultObject = {
	doThat: true,
	doThis: false,
	otherVar : {
		one: {
			another: true,
			var: 'blah',
			varUnknown: [3, 5] // Default logic in Line 28
		}
	}
}

data3, object4, options1/2

resultObject = {
	someVar: ['test'],
	otherVar: {
		two: {
			another: false,
			var: 'mycool', // Default logic in Line 28
			varUnknown: [3, 5] // Default logic in Line 28
		},
		one: {
			another: true,
			var: 'blah',
			varUnknown: [3, 5] // Default logic in Line 28
		}
	}
}

data3, object4, option3

resultObject = {
	someVar: ['test'],
	otherVar: {
		one: {
			another: true,
			var: 'blah',
			varUnknown: [3, 5] // Default logic in Line 28
		}
	}
}
