
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
