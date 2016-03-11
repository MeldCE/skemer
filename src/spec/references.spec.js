var skemer = require('../lib/skemer.js');

var schema = {
  type: {
    aString: {
      type: 'string'
    },
    goodRef: { '$ref': 'type/aString' },
    goodSlashRef: { '$ref': '/type/aString' },
    goodHashRef: { '$ref': '#/type/aString' }
  }
};

var badRefSchema = {
  type: {
    badRef: { '$ref': 'type/aString' }
  }
};

describe('Schema References', function() {
  it('should replace good schema references with the correct values',
      function() {
    var Skemer = new skemer.Skemer({
      schema: schema
    });

    expect(Skemer.options.schema).toEqual({
      type: {
        aString: {
          type: 'string'
        },
        goodRef: {
          type: 'string'
        },
        goodSlashRef: {
          type: 'string'
        },
        goodHashRef: {
          type: 'string'
        }
      }
    });
  });

  it('should throw on a bad reference', function() {
  });
});

