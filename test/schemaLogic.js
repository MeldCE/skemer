// Eg settings
schema{ = {
  type: {
    doThis: {
      type: 'boolean'
    },
    doThat: {
      type: 'boolean'
    },
    someVar: {
      type: 'string',
      multiple: true
    },
    otherVar: {
      type: {
	another: {
	  type: 'boolean',
	},
	var: {
	  type: 'string',
	  default: 'mycool'
	},
	varUnknown: {
	  type: 'number',
	  multiple: true,
	  default: [3, 5]
	}
      },
      multiple: true,
      object: true
    },
    notDoneVar: { // TODO
      type: {
	boring: {
	  type: 'string', // NOTE using 'string' instead of 'text'
	}
      }
    },
    againNotDoneVar: { // TODO
      type: {
	boring: {
	  type: 'string',
	  default: 'interesting'
	}
      }
    }
  }
};

data1 = {}
data2 = {
  doThis: true,
  someVar: ['string']
}
data3throw = { // Should end up throwing as values of otherVar don't match type schema
  doThat: true,
  otherVar : {
    another: true,
    var: 'blah'
  }
}
data3 = {
  doThat: true,
  otherVar : {
    one: {
      another: true,
      var: 'blah'
    }
  }
}

object1 = undefined
object2 = {}
object3 = { // Pretty lame with main level default values removed, what if this was sub-level?
  doThis: false
}
object4 = {
  someVar: ['test'],
  otherVar: {
    two: {
      another: false
    }
  }
}
object5 = {
  someVar: ['test'],
  otherVar: {
    one: {
      varUnknown: [1]
    },
    two: {
      another: false
    }
  }
}

options1 = {}
options2 = {
  add: true
}
options3 = {
  replace: true // So leave if no value in data, could do delete if empty value in data
}














resultObject should be returned. If object is not undefined, object should be modified

data1,object1,options1/2/3

// otherVar multiple = true, therefore default values only happen in a value
resultObject = undefined

data1,object2,options1/2/3

// otherVar multiple = true, therefore default values only happen in a value
resultObject = {}

data1, object3, options1/2/3


resultObject = {
  doThis: false,
  doThat: true
}

data1, object4, options1/2/3

resultObject = {
  someVar: ['test'],
  otherVar: {
    two: {
      another: false,
      var: 'mycool' // Should the default value for doThat be set? - sort of validates current object against schema, could make an option
      varUnknown: [3, 5] // Ditto
    }
  }
}

data2, object1/2, options1/2/3

resultObject = {
  doThis: true,
  someVar: ['string']
}

data2, object3, options1/2/3

resultObject = {
  doThis: true,
  someVar: ['string']
 }

data2, object4, options1/3

resultObject = {
  doThis: true,
  someVar: ['string'],
  otherVar: {
    two: {
      another: false
      var: 'mycool', // Default logic in Line 15
      varUnknown: [3, 5] // Ditto
    }
  }
}

data2, object4, options2

resultObject = {
  doThis: true,
  someVar: ['test', 'string'],
  otherVar: {
    two: {
      another: false,
      var: 'mycool', // Default logic in Line 28
      varUnknown: [3, 5] // Default logic in Line 28
    }
  }
}

data3, object1/2, options1/2/3

resultObject = {
  doThat: true,
  otherVar : {
    one: {
      another: true,
      var: 'blah',
      varUnknown: [3, 5] // Default logic in Line 28
    }
  }
}

data3, object3, options1/2/3

resultObject = {
  doThat: true,
  doThis: false,
  otherVar : {
    one: {
      another: true,
      var: 'blah',
      varUnknown: [3, 5] // Default logic in Line 28
    }
  }
}

data3, object4, options1/2

resultObject = {
  someVar: ['test'],
  otherVar: {
    two: {
      another: false,
      var: 'mycool', // Default logic in Line 28
      varUnknown: [3, 5] // Default logic in Line 28
    },
    one: {
      another: true,
      var: 'blah',
      varUnknown: [3, 5] // Default logic in Line 28
    }
  }
}

data3, object4, option3

resultObject = {
  someVar: ['test'],
  otherVar: {
    one: {
      another: true,
      var: 'blah',
      varUnknown: [3, 5] // Default logic in Line 28
    }
  }
}