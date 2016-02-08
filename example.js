var skemer = require('skemer');


var schema = {
  doc: 'A basic schema',
  type: {
    value: {
      doc: 'Some string value',
      type: 'string'
    },
    figure: {
      doc: 'A number value',
      type: 'number',
      min: 20,
      max: 50
    }
  }
};

var valid = {
  value: 'a string',
  figure: 30
};

var valid1 = {
  figure: 35
};

var valid2 = {
  value: 'a different string'
};

var invalid = false;

var stringSchema = {
  type: 'string'
};

var aString = 'string';


skemer.validateNew({ schema: stringSchema }, aString);

var Schema, data;

console.log(data = skemer.buildJsDocs(schema, {
  wrap: 80,
  preLine: ' * ',
  lineup: true
}));

Schema = new skemer.Skemer({ schema: schema });

console.log(data = Schema.validateNew(valid));

console.log(data = Schema.validateAdd(data, valid1));

Schema.validateAdd(data, valid2, invalid);
