module.exports = { 
  schema: schema,
};

// === //

function schema(model, from, to, remain) {
  return model - (to - from) * remain;
}
