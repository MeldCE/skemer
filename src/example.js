var skemer = require('skemer');

//=include testSchema.js

skemer.validateNew({ schema: stringSchema }, aString);

var Schema, data;

Schema = new skemer.Skemer({ schema: schema });

console.log(data = Schema.validateNew(valid));

console.log(data = Schema.validateAdd(data, valid1));

Schema.validateAdd(data, valid2, invalid);
