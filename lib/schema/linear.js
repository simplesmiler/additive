module.exports = { 
  lerp: lerp,
};

// === //

// @NOTE: linear interpolation
function lerp(model, from, to, remain) {
  return model - (to - from) * remain;
}
