/**
 * Skema
 *
 * A Object schema validator and scheme JSDoc generator
 *
 * @author The Electric Wiz
 */
var Skema = function(schema, options) {
}

function buildLines(pre, schema) {
	var lines = [], line, subLines, name, s;

	for (s in schema) {
		line = '@param ';
		if (schema[s].types) {
		} else if (schema[s].type) {
		} else {
		}
		name = pre + '.' + s;
		if (schema[s].required !== true) {
			name = '[' + name + ']';
		}

		// Add parameter to lines
		lines.push(line);
		
		// Add sub parameters to lines
		if (subLines) {
			lines = lines.concat(subLines);
			subLines = false;
		}
	}

	return lines;
}

/**
 */
function validateValue() {
}

/**
 * Performs the object merge
 *
 * @param {Object} object Object to merge into existing object
 * @param {boolean} [silent] If true, if a parameter is invalid, it will
 *        be ignored rather than raising an Error
 */
function merge(object, silent) {
	var o;

	for (o in object) {
		if (!this.schema[o]) {[
			if (this.options.strict) {
				if (!silent) {
					throw ValueError('Uknown parameter ' + o + ' for strict schema');
				} else {
					continue;
				}
			} else {
				this.value[o] = object[o];
			}
		} else {
			if (validateValues.call(this, object, o)) {
				this.value[o] = object[o];
			}
		}

}

Skema.prototype = {
	/**
	 * Merge object values into the existing object verifying each before
	 * merging
	 *
	 * @param {Object} object Object to merge into existing object
	 * @param {boolean} [silent] If true, if a parameter is invalid, it will
	 *        be ignored rather than raising an Error
	 */
	load: function(object, silent) {

	},

	/**
	 * Generates a JSDoc comment for the given schema.
	 *
	 * @param {string} pre The string to prepend to the start of each parameter
	 * @param {Object} [options] Generation options
	 * @param {string} [options.preLine] String to include before each line
	 * @param {number} [options.wrap] Wrap the lines at the given number of
	 *        characters
	 * @param {number} [options.tabWidth] Your favourite tab width used to
	 *        calculate 80 characters
	 * @param {boolean} [options.lineup] Line up broken lines with the start of
	 *        the parameter details
	 */
	jsDoc: function(pre, options) {
		if (!options) {
			options = {};
		}

		var doc = '';

		var tw = (options.tabWidth ? options.tabWidth : 4);
		var c, s, w, line, l, lines = buildLines(options.pre, this.schema);

		if (options.wrap) {
			// Go through and build the lines
			for (l in lines) {
				line = options.preLine + lines[l];

				c = 0;
				s = 0;

				while (c < line.length) {
					if (line[c] === ' ') {
						s = c;
					} else if (line[c] === "\t") {
						w += tw - 1;
						s = c;
					}
					w++;
					if (w > options.wrap) {
						doc += line.slice(0, s) + "\n";
						line = options.preLine + (options.lineup ? '       ' : '');
						c = 0;
						s = 0;
						w = 0;
					} else {
						c++;
					}
				}
				if (line) {
					doc += line + "\n";
				}
			}
		} else {
			doc = lines.join("\n");
		}
	}
};

module.exports = {

