var errors = require('../lib/errors.js');
var skemer = require('../lib/skemer.js');

var schema = {
  doc: 'Test object comment',
  type: {
    string: {
      doc: 'Some string',
      type: 'string'
    },
    any: {
      doc: 'Some variable that can be anything',
      type: 'any'
    },
    requiredNumber: {
      doc: 'Required number',
      type: 'number',
      required: true
    },
    defaultString: {
      doc: 'a string with a default and a really long description',
      type: 'string',
      default: 'string'
    },
    defaultNumber: {
      doc: 'a number with a default',
      type: 'number',
      default: 34
    },
    defaultBoolean: {
      doc: 'a boolean with a default',
      type: 'boolean',
      default: true
    },
    defaultObject: {
      doc: 'a object with a default',
      type: 'object',
      default: {}
    },
    //aFunction: {
    //  type: 'function',
    //  doc: 
    types: {
      doc: 'a string or a number',
      types: [
        {
          type: 'string'
        },
        {
          type: 'number'
        }
      ]
    },
    arr: {
      type: 'string',
      multiple: true
    },
    coord: {
      type: 'number',
      multiple: true,
      object: true
    },
    arrcoord: {
      types: {
        arr: {
          type: 'string',
          multiple: true
        },
        coord: {
          type: 'number',
          multiple: true,
          object: true
        }
      }
    }
  }
};

var stringSchema = {
  doc: 'just a string',
  type: 'string'
};

/** @private
 * JSDoc validator
 *
 * @param {string} lines Doc to validate
 *
 * @returns {undefined} 
 */
function validateDoc(lines) {
  expect(lines.length).toBe(16);

  // First line should be overall comment with preamble
  expect(lines[0]).toBe('\t * Test object comment');

  // Second line should be a newline with preamble
  expect(lines[1]).toBe('\t * ');

  /* Third line should be first parameter definition with preamble, correct
   * type, objectName. parameter name and the description
   */
  expect(lines[2]).toBe('\t * @param {string} [objectName.string] Some '
      + 'string');
  
  // Fourth line should be an anything parameter
  expect(lines[3]).toBe('\t * @param {*} [objectName.any] Some '
      + 'variable that can be anything');

  // '\t * @param {number} objectName.requiredNumber Required number',
  // Long line should be wrapped
  expect(lines[5]).toBe('\t * @param {string} [objectName.defaultString='
      + '\'string\'] a string with a');
  
  // Line continuation should aligned with after the jsdoc word
  expect(lines[6]).toBe('\t *        default and a really long description');
  
  // Default values
  expect(lines[7]).toBe('\t * @param {number} [objectName.defaultNumber=34] '
      + 'a number with a default');
  expect(lines[8]).toBe('\t * @param {boolean} [objectName.'
      + 'defaultBoolean=true] a boolean with a');
  //'\t *        default',

  // Types
  expect(lines[11]).toBe('\t * @param {(string|number)} [objectName.types] '
      + 'a string or a number');

  // Array of strings
  expect(lines[12]).toBe('\t * @param {string[]} [objectName.arr]');
  
  // Object of numbers
  expect(lines[13]).toBe('\t * @param {number[]} [objectName.coord]');
  
  // Either Array of strings or an object of numbers
  expect(lines[14]).toBe('\t * @param {(string[]|number[])} '
      + '[objectName.arrcoord]');
}

describe('JSDoc functionality', function() {
  it('should return documentation', function() {
    var doc = skemer.buildJsDocs(stringSchema);
    var lines = doc.split('\n');
    doc = skemer.buildJsDocs(schema, {
      lineup: true,
      wrap: 80,
      preLine: '\t * ',
      name: 'objectName',
      type: 'param'
    });
    lines = doc.split('\n');

    validateDoc(lines);
  });
});

describe('JSDoc Promise functionality' ,function() {
  it('should reject on something bad', function(done) {
    skemer.promiseBuildJsDocs(schema, {
      lineup: true,
      wrap: 'wrong',
      preLine: '\t * ',
      name: 'objectName',
      type: 'param'
    }).then(function(doc) {
      fail('should reject');
      done();
    }, function(err) {
      expect(err).toEqual(new errors.DataTypeError('Value for wrap '
          + 'must be a number'));
      done();
    });
  });

  it('should eventually return documentation', function(done) {
    skemer.promiseBuildJsDocs(schema, {
      lineup: true,
      wrap: 80,
      preLine: '\t * ',
      name: 'objectName',
      type: 'param'
    }).then(function(doc) {
      var lines = doc.split('\n');

      validateDoc(lines);
      done();
    }, function(err) {
      fail(err);
      done();
    });
  });
});
