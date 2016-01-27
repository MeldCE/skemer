var errors = require('../lib/errors.js');
var skemer = require('../lib/skemer.js');

var schema = {
  doc: 'Test object comment',
  type: {
    string: {
      doc: 'Some string',
      type: 'string'
    },
    requiredNumber: {
      doc: 'Required number',
      type: 'number',
      required: true
    }
  }
};

describe('JSDoc functionality', function() {
  it('should return documentation', function() {
    var doc = skemer.buildJsDocs(schema);
    var lines = doc.split('\n');
    console.log(lines);
  });
});
