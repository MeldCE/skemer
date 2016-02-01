var skemer = require('../../lib/skemer.js');
var clone = require('clone');

var map = ['data', 'newData', 'options'];

/**
 * Expands tests containing false to repeat over all the available values
 *
 * @param {Obect} suite Test suite of test array to expand
 * @param {Array} input Test to expand
 * @param {number} p Last test element expanded
 *
 * @returns {Array|true} New expanded array or true if no expansion required
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

/**
 * Build tests out of a test suite
 *
 * @param {string} suiteLabel Test suite label
 * @param {Array} testSuites Array of tests and their test suite data
 * @param {string} testSuites[].label Test suite label
 * @param {Object} testSuites[].schema Test suite schema
 * @param {Object} testSuites[].data Named array of test suite data values 
 * @param {Object} testSuites[].newData Named array of test suite new data
 *        values
 * @param {Object} testSuites[].options Name array of test suite options
 * @param {Array} testSuites[].results Array of Test suite expected results
 *
 * @returns {undefined}
 */
function buildTests(suiteLabel, testSuites) {
	// Fix false inputs
	var x;
	for (x in testSuites) {
		var y;
		for (y in testSuites[x].results) {
			var res = testSuites[x].results[y];
			// Make input an array of arrays if it isn't
			if (!(res.input[0] instanceof Array)) {
				res.input = [res.input];
			}

			var z;
			for (z = res.input.length - 1; z >= 0; z--) {
				var mapped;
				if ((mapped = mapFalseInputs(testSuites[x], res.input[z])) !== true) {
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
	describe(suiteLabel, function() {
		var s, testLabel;
		for (s in testSuites) {
			var o;

			if (testSuites[s].label) {
				testLabel = testSuites[s].label;
			} else {
				testLabel = 'Test Suite ' + s;
			}

			// Add the schema to each test option
			for (o in testSuites[s].options) {
				testSuites[s].options[o].schema = testSuites[s].schema;
			}

			describe(testLabel, function() {
				//console.log('describe', testLabel, this);
				var r;

				for (r in this.results) {
					var ttest = this.results[r];

					//describe(comment + ' ' + r, function(testSuite) {
					var i, message;
					//console.log('\n\nstart of it:', '\noptions: ', testSuite.options,
					//			'\ndata: ', testSuite.data, '\nnewData: ', testSuite.newData);

					if (ttest.label) {
						if (ttest.label instanceof Array) {
							if (ttest.label.length === 1) {
								message = ttest.label[0];
							} else {
								var end = ttest.label.pop();
								message = ttest.label.join(', ') + ' and ' + end;
							}
						} else {
							message = ttest.label;
						}
					} else {
						if (ttest.throws) {
							message = 'should throw';
						} else {
							message = 'should return expected value';
						}
					}

					for (i in ttest.input) {
						//console.log('input is', this.input[i]);
						var func = function(test, input) {
							//console.log('it:', testSuite, this);
							//console.log('it in', this);
							//console.log('\n\nit:', '\ninputs:', input, '\nsuite:', this, '\noptions: ', this.options[input[2]],
							//		'\ndata: ', this.data[input[0]], '\nnewData: ', this.newData[input[1]]);
							if (test.throws) {
								expect(function (options, data, newData) {
									if (!this.options) {
										console.log('\n\nno options\n', test, '\n', this);
									}
									skemer.validateAdd(options, data, newData);
								}.bind(this, this.options[input[2]],
										clone(this.data[input[0]]),
										clone(this.newData[input[1]]))).toThrow(test.throws);
							} else {
								var result = skemer.validateAdd(this.options[input[2]],
											clone(this.data[input[0]]),
											clone(this.newData[input[1]]));
							
								expect(result).toEqual(test.result);
							}
						}.bind(this, ttest, ttest.input[i]);
						var desc = '(' + ttest.input[i] + ') ' + message;
						
						if (this.pending || ttest.pending) {
							xit(desc, func);
						} else {
							it(desc, func);
						}
					}
					//}.bind(test, this));
				}
			}.bind(testSuites[s]));
		}
	});
}

module.exports = buildTests; 
