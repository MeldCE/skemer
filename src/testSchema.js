
var schema = {
	type: {
		value: {
			type: 'string'
		},
		figure: {
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
