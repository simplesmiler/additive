var assign = require('object-assign');

module.exports = {
  bag: bag,
  list: list,
};

// === //

// @NOTE: transform from a schema to a bag of this schemas
// @CONTRACT: schema is a function
function bag(schema) {
  return function(model, from, to, remain) {
    var state = assign({}, model); // @NOTE: otherwise not all model keys will be present in state
    var keys = Object.keys(to);
    for (var i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      state[key] = schema(model[key], from[key], to[key], remain);
    }
    return state;
  };
}

// @NOTE: transform from a schema to a list of this schemas
// @CONTRACT: schema is a function
function list(schema) {
  return function(model, from, to, remain) {
    var state = [];
    for (var i = 0, l = model.length; i < l; i++) {
      state[i] = schema(model[i], from[i], to[i], remain);
    }
    return state;
  };
}
