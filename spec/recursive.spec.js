var skemer = require('../lib/skemer.js');

var schema = {
  type: {
    number: {
      types: {
        number: {
          type: 'number'
        },
        recurse: {
          type: null
        }
      }
    }
  }
};

describe('recursive schemas', function() {
  it('should parse to the same schema', function() {
    var Skemer = new skemer.Skemer({
      schema: schema
    });

    expect(Skemer.options.schema).toEqual(schema);
  });

  it('should allow the normal value', function() {
    expect(skemer.validateNew({
      schema: schema
    }, { number: 42 })).toEqual({ number: 42 });
  });

  it('should allow a single recursion', function() {
    expect(skemer.validateNew({
      schema: schema
    }, { number: { number: 42 } })).toEqual({ number: { number: 42 } });
  });

  it('should allow multiple recursion', function() {
    expect(skemer.validateNew({
      schema: schema
    }, { number: { number: { number: { number: {number: 42 } } } } }))
        .toEqual({ number: { number: { number: { number: {number: 42 } } } } });
  });
});
