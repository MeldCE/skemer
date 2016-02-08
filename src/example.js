var skemer = require('skemer');

//=include testSchema.js

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
