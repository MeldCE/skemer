var skemer = require('../lib/skemer.js');
var schemas = require('../lib/schema.js');


describe('Skemer schemas', function() {
  var s;

  for (s in schemas) {
    it(s + ' should be a valid schema', (function(name, schema) {
      return function() {
        expect(skemer.validateAdd.bind(this, {
          schema: schema,
          parameterName: name
        }, undefined)).not.toThrow();
      };
    })(s, schemas[s]));
  }
});
