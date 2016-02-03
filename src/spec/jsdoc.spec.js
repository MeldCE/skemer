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
    }
  }
};

var stringSchema = {
  doc: 'just a string',
  type: 'string'
};

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
  });
});
