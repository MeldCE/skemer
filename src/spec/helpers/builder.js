var skemer = require('../../lib/skemer.js');
var clone = require('clone');

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

var buildTests = module.exports = function(suiteLabel, testSuites) {
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
									expect(function () {skemer.validateAdd(testSuite.options[input[2]],
											clone(testSuite.data[input[0]]), 
											clone(testSuite.newData[input[1]]));}).toThrow(this.throws);
								} else {
									var result = skemer.validateAdd(testSuite.options[input[2]],
												clone(testSuite.data[input[0]]),
												clone(testSuite.newData[input[1]]));
								
									expect(result).toEqual(this.result);
								}
							}.bind(this, this.input[i]));
						}
						//break;
					}.bind(test, this));
				}
			}.bind(testSuites[s]));
		}
	});
};
