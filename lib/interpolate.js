module.exports = interpolate;

// === //

// @NOTE: does not mutate the model
function interpolate(schema, model, from, to, remain) {
  var state, i, l;

  if (isFunction(schema)) {
    return schema(model, from, to, remain);
  }

  if (isArray(schema)) {
    state = [];
    for (i = 0, l = schema.length; i < l; i++) {
      state[i] = interpolate(schema[i], model[i], from[i], to[i], remain);
    }
    return state;
  }

  if (isObject(schema)) {
    state = {};
    var keys = Object.keys(schema);
    for (i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      if (key in from) {
        state[key] = interpolate(schema[key], model[key], from[key], to[key], remain);
      } else {
        state[key] = model[key];
      }
    }
    return state;
  }

  // @TODO: do not know how to interpolate the model

  return state;
}



// == auxiliary == //

function isFunction(fn) {
  return (Object.prototype.toString.call(fn) === '[object Function]');
}

function isArray(arr) {
  return Array.isArray(arr);
}

function isObject(obj) {
  return obj === Object(obj);
}
