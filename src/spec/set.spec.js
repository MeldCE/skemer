var errors = require('../lib/errors.js');
var skemer = require('../lib/skemer.js');

var simpleSchema = {
  type: 'string'
};

var schema = {
  type: {
    array: {
      type: 'string',
      multiple: true
    },
    objectArray: {
      type: {
        string: {
          type: 'string'
        }
      },
      multiple: true,
      object: true
    },
    object: {
      type: {
        value: {
          type: 'string'
        },
        something: {
          type: 'number',
          default: 42
        }
      },
      multiple: true,
      object: true
    },
    multiple: {
      type: 'number',
      multiple: true,
      object: true
    },
    required: {
      type: {
        value: {
          type: 'string'
        },
        something: {
          type: 'number',
          required: true
        }
      },
      multiple: true,
      object: true
    }
  }
};

describe('Skemer set function', function() {
  var simple = new skemer.Skemer({
    schema: simpleSchema
  });

  var object = new skemer.Skemer({
    schema: schema
  });

  it('should set for the simplist schema', function() {
    var data = '';
    expect(simple.set(data, '', 'string')).toEqual('string');
  });

  it('should fail for the simplist schema if a bad type is given', function() {
    var data = '';
    expect(function () { simple.set(data, '', 42); })
        .toThrow(new errors.DataTypeError('Value must be a string'));
  });

  it('should create a new value in an array', function() {
    expect(object.set({}, 'array', 'string')).toEqual({
      array: [ 'string' ]
    });
  });

  it('should create a new value in an array if passed an object value',
      function() {
    expect(object.set({}, 'objectArray..string', 'string')).toEqual({
      objectArray: [ { string: 'string' } ]
    });
  });

  it('should add a new object to a multiple object', function() {
    expect(object.set({}, 'object.one.value', 'string')).toEqual({
      object: { one: { value: 'string' } }
    });
  });


  it('should throw if try to pass a new object with no key to a multiple '
      + 'object type', function() {
    expect(function() { object.set({}, 'object..value', 'string'); })
        .toThrow();
  });
});

