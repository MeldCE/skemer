var skemer = require('skemer');

//=include testSchema.js

skemer.validateAdd({ schema: schema }, {
});

var Schema = skemer.Skemer({ schema: schema });

Schema.validateAdd({
});
