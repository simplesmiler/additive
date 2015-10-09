module.exports = {
  slerp: slerp,

  vsame: vsame,

  // @NOTE: scalar to vector
  make: make,
  makeraw: makeraw,
  makeuraw: makeuraw,

  // @NOTE: vector to scalar
  vlen: vlen,
  vang: vang,

  // @NOTE: vector to vector
  vnorm: vnorm,
  vinv: vinv,
  vmul: vmul,
  vdiv: vdiv,
  vudiv: vudiv,
  vsum: vsum,
  vwsum: vwsum,

  // @NOTE: parts to scalar
  mre: mre,
  mim: mim,
  dot: dot,
  ang: ang,
  len: len,
  lensq: lensq,
};

// === //

var TAU = Math.PI * 2;
var IDENTITY = make(0);

// @NOTE: complex spherical linear interpolation
// @CONTRACT: `from` and `to` are unit
function slerp(model, from, to, remain) {
  // @TODO: in debug mode complain if input vectors are not unit
  var cosom = dot(from.re, from.im, to.re, to.im); // @NOTE: cos of omega, [-1 .. 1]

  // @TODO: in debug mode complain if `cosom` does not fit the interval
  cosom = clamp(cosom, -1, 1);

  // @NOTE: rotating to the same point
  if (cosom === 1) return model;
  if (cosom === -1) return model;

  if (cosom < 0) {
    cosom = -cosom;
    to = vinv(to);
  }

  // @NOTE: rotating arbitrarily
  var omega = Math.acos(cosom); // @NOTE: [0 .. Math.PI]
  var sinom = Math.sin(omega); // @NOTE: sin of omega
  var a = Math.sin(remain * omega) / sinom;
  var b = Math.sin((1 - remain) * omega) / sinom;

  var diff = vudiv(from, to);
  var middle = vwsum(diff, IDENTITY, a, b);
  var state = vmul(model, middle);

  // @TODO: in debug mode complain if result vector is not unit

  return state;
}


function vsame(v1, v2, epsilon) {
  var da = vang(v2) - vang(v1);
  return (Math.abs(da % TAU) < epsilon);
}



// == scalar to vector == //

// @NOTE: vector from angle and length
function make(ang, norm) {
  if (norm === undefined) norm = 1;
  return {
    re: norm * Math.cos(ang / 2),
    im: norm * Math.sin(ang / 2),
  };
}

// @NOTE: vector from parts
function makeraw(re, im) {
  return {
    re: re,
    im: im,
  };
}

// @NOTE: vector from parts
function makeuraw(re, im) {
  var norm = len(re, im);
  return {
    re: re / norm,
    im: im / norm,
  };
}



// == vector to scalar == //

function vlen(a) {
  return len(a.re, a.im);
}

function vang(a) {
  return 2 * ang(a.re, a.im);
}



// == vector to vector == //

// @NOTE: vector normalization
// @CONTRACT: `a` is a non-zero vector
function vnorm(a) {
  var norm = len(a.re, a.im);
  return {
    re: a.re / norm,
    im: a.im / norm,
  };
}

// @NOTE: vector invertion
function vinv(a) {
  return {
    re: -a.re,
    im: -a.im,
  };
}

// @NOTE: vector multiplication
function vmul(a, b) {
  return {
    re: mre(a.re, a.im, b.re, b.im),
    im: mim(a.re, a.im, b.re, b.im),
  };
}

// @NOTE: vector division
// @CONTRACT: `b` is a non-zero vector
function vdiv(a, b) {
  var lsq = lensq(a.re, a.im, b.re, b.im);
  return {
    re: mre(a.re, a.im, b.re, -b.im) / lsq,
    im: mim(a.re, a.im, b.re, -b.im) / lsq,
  };
}

// @NOTE: unit vector division
function vudiv(a, b) {
  return {
    re: mre(a.re, a.im, b.re, -b.im),
    im: mim(a.re, a.im, b.re, -b.im),
  };
}

// @NOTE: vector sum
function vsum(a, b) {
  return {
    re: a.re + b.re,
    im: a.im + b.im,
  };
}

// @NOTE: weighted vector sum
function vwsum(a, b, ac, bc) {
  return {
    re: ac * a.re + bc * b.re,
    im: ac * a.im + bc * b.im,
  };
}



// == parts to scalar == //

// @NOTE: real part of multiplication
function mre(are, aim, bre, bim) {
  return are * bre - aim * bim;
}

// @NOTE: imaginary part of multiplication
function mim(are, aim, bre, bim) {
  return aim * bre + are * bim;
}

// @NOTE: dot product
function dot(are, aim, bre, bim) {
  return are * bre + aim * bim;
}

// @NOTE: angle of vector
function ang(are, aim) {
  return Math.atan2(aim, are);
}

// NOTE: length of vector
function len(are, aim) {
  return Math.sqrt(are * are + aim * aim);
}

// @NOTE: sqared length of a vector
function lensq(are, aim) {
  return are * are + aim * aim;
}



// == auxiliary == //

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}
