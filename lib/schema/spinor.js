var TAU = Math.PI * 2;
var IDENTITY = fromAngle(0);

module.exports = {
  schema: schema,
  fromAngle: fromAngle,
  toAngle: toAngle,
  almostEqual: almostEqual,
  IDENTITY: IDENTITY,
};

// === //

// @NOTE: complex spherical linear interpolation
// @CONTRACT: `from` and `to` are unit
function schema(model, from, to, remain) {
  // @TODO: in debug mode complain if input vectors are not unit
  var cosom = _dot(from.re, from.im, to.re, to.im); // @NOTE: cos of omega, [-1 .. 1]

  // @TODO: in debug mode complain if `cosom` does not fit the interval
  cosom = clamp(cosom, -1, 1);

  // @NOTE: rotating to the same point
  if (cosom === 1) return model;
  if (cosom === -1) return model;

  if (cosom < 0) {
    cosom = -cosom;
    to = inv(to);
  }

  // @NOTE: rotating arbitrarily
  var omega = Math.acos(cosom); // @NOTE: [0 .. Math.PI]
  var sinom = Math.sin(omega); // @NOTE: sin of omega
  var a = Math.sin(remain * omega) / sinom;
  var b = Math.sin((1 - remain) * omega) / sinom;

  var diff = udiv(from, to);
  var middle = wsum(diff, IDENTITY, a, b);
  var state = mul(model, middle);

  // @TODO: in debug mode complain if result vector is not unit

  return state;
}



// @NOTE: spinor from angle
function fromAngle(a) {
  return {
    re: Math.cos(a / 2),
    im: Math.sin(a / 2),
  };
}

// @NOTE: compare two spinors
function almostEqual(s1, s2, epsilon) {
  var da = toAngle(s2) - toAngle(s1);
  return (Math.abs(da % TAU) < epsilon);
}

// @NOTE: angle from spinor
function toAngle(s) {
  return 2 * _ang(s.re, s.im);
}



// == vector to vector == //

// @NOTE: vector normalization
// @CONTRACT: `a` is a non-zero vector
function norm(s) {
  var norm = _len(s.re, s.im);
  return {
    re: s.re / norm,
    im: s.im / norm,
  };
}

// @NOTE: vector invertion
function inv(s) {
  return {
    re: -s.re,
    im: -s.im,
  };
}

// @NOTE: vector multiplication
function mul(s1, s2) {
  return {
    re: _mre(s1.re, s1.im, s2.re, s2.im),
    im: _mim(s1.re, s1.im, s2.re, s2.im),
  };
}

// @NOTE: vector division
// @CONTRACT: `b` is a non-zero vector
function div(s1, s2) {
  var lsq = _lensq(s1.re, s1.im, s2.re, s2.im);
  return {
    re: _mre(s1.re, s1.im, s2.re, -s2.im) / lsq,
    im: _mim(s1.re, s1.im, s2.re, -s2.im) / lsq,
  };
}

// @NOTE: unit vector division
function udiv(s1, s2) {
  return {
    re: _mre(s1.re, s1.im, s2.re, -s2.im),
    im: _mim(s1.re, s1.im, s2.re, -s2.im),
  };
}

// @NOTE: vector sum
function sum(s1, s2) {
  return {
    re: s1.re + s2.re,
    im: s1.im + s2.im,
  };
}

// @NOTE: weighted vector sum
function wsum(s1, s2, w1, w2) {
  return {
    re: w1 * s1.re + w2 * s2.re,
    im: w1 * s1.im + w2 * s2.im,
  };
}



// == parts to scalar == //

// @NOTE: real part of multiplication
function _mre(are, aim, bre, bim) {
  return are * bre - aim * bim;
}

// @NOTE: imaginary part of multiplication
function _mim(are, aim, bre, bim) {
  return aim * bre + are * bim;
}

// @NOTE: dot product
function _dot(are, aim, bre, bim) {
  return are * bre + aim * bim;
}

// @NOTE: angle of vector
function _ang(are, aim) {
  return Math.atan2(aim, are);
}

// NOTE: length of vector
function _len(are, aim) {
  return Math.sqrt(are * are + aim * aim);
}

// @NOTE: sqared length of a vector
function _lensq(are, aim) {
  return are * are + aim * aim;
}



// == auxiliary == //

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}
