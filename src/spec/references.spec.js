var skemer = require('../lib/skemer.js');
var errors = require('../lib/errors.js');


var schema = {
  type: {
    aString: {
      type: 'string'
    },
    stringOrNum : {
      types: {
        string: {
          type: 'string'
        },
        num: {
          type: 'number'
        }
      }
    },
    goodRef: { '$ref': 'type/aString' },
    goodSlashRef: { '$ref': '/type/aString' },
    goodHashRef: { '$ref': '#/type/aString' },
    typeRef: {
      type: { '$ref': '/type/aString/type' }
    },
    typesRef: {
      types: { '$ref': '/type/stringOrNum/types' }
    }
  }
};

var badRefSchema = {
  type: {
    badRef: { '$ref': 'type/aString' }
  }
};

var recursiveSchema = {
  type: {
    name: {
      type: 'string'
    },
    children: { '$ref': '/' },
    namedChildren: {
      type: { '$ref': '/type' },
      multiple: true,
      object: true
    },
    parent: {
      type: { '$ref': '/type' }
    }
  },
  multiple: true
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
        stringOrNum : {
          types: {
            string: {
              type: 'string'
            },
            num: {
              type: 'number'
            }
          }
        },
        goodRef: {
          type: 'string'
        },
        goodSlashRef: {
          type: 'string'
        },
        goodHashRef: {
          type: 'string'
        },
        typeRef: {
          type: 'string'
        },
        typesRef: {
          types: {
            string: {
              type: 'string'
            },
            num: {
              type: 'number'
            }
          }
        }
      }
    });
  });

  it('should throw on a bad reference', function() {
    expect(function() {
      new skemer.Skemer({
        schema: badRefSchema
      });
    }).toThrow(new errors.ReferenceError('Reference `type/aString` could not be resolved'));
  });

  it('should not freak out on recursive references', function() {
    var Skemer = new skemer.Skemer({
      schema: recursiveSchema
    });

    expect(Skemer.options.schema.type.children).toBe(Skemer.options.schema);
  });

  it('should allow references in data when allowReferences is set',
      function() {
    expect(skemer.validateNew({
      schema: recursiveSchema,
      allowReferences: true
    }, [
      {
        name: 'root',
        children: [
          {
            name: 'child1'
          },
          {
            name: 'child2',
            children: [
              { '$ref': '/0/children/0' }
            ]
          }
        ]
      }
    ])).toEqual([
      {
        name: 'root',
        children: [
          {
            name: 'child1'
          },
          {
            name: 'child2',
            children: [
              {
                name: 'child1'
              }
            ]
          }
        ]
      }
    ]);
  });
});

