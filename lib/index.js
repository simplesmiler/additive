module.exports = {
  make: make,

  animate: animate,
  render: render,
  trim: trim,

  isAnimating: isAnimating,
};

// === //

var now = require('performance-now');
var assign = require('object-assign');

var interpolate = require('./interpolate');
var lerp = require('./schema/linear').lerp;

// @TODO: extract to the factory
var provider = {
  now: now,
  keep: false,
  makeOpts: {
    schema: lerp,
    transitions: [],
    transform: identity,
  },
  animateOpts: {
    duration: 250,
    ease: easeDefault,
    delay: 0,
  },
};

// @DESCRIPTION: fill a plain object representation with default values
function make(opts) {
  // @TODO: throw if `opts.model` is not present

  return assign({}, provider.makeOpts, opts);
}

// @DESCRIPTION: append a new transition
// @CONTRACT: `target` is valid and complete
// @NOTE: mutates the `target`
// @NOTE: uses current time, unless `time` is passed
// @NOTE: trims transitions that are over at the `time`, unless `keep` is `true`
function animate(target, opts, time, keep) {
  if (time === undefined) time = provider.now();
  if (keep === undefined) keep = provider.keep;

  if (keep === false) {
    trim(target, time);
  }

  // @TODO: throw if `opts.to` is not present

  opts = assign({}, provider.animateOpts, opts);

  var transition = {
    duration: opts.duration,
    ease: opts.ease,
    end: time + opts.duration + opts.delay,
    from: recopy(opts.to, target.model),
    to: opts.to,
  };

  target.transitions.push(transition);
  assign(target.model, opts.to);
}

// @DESCRIPTION: calculate an intermediate state
// @CONTRACT: `target` is valid and complete
function render(target, time) {
  if (time === undefined) time = provider.now();

  var state = target.model; // @NOTE: should not be mutated
  var transitions = target.transitions;

  for (var i = 0, l = transitions.length; i < l; i++) {
    var transition = transitions[i];
    if (transition.end < time) continue; // @NOTE: transition is over, will not affect the value
    var remain = clamp((transition.end - time) / transition.duration, 0, 1);

    state = interpolate(target.schema, state, transition.from, transition.to, 1 - transition.ease(1 - remain));
  }

  return state;
}

// @DESCRIPTION: trim out transitions that are over
// @CONTRACT: `target` is valid and complete
// @NOTE: mutates the target
function trim(target, time) {
  if (time === undefined) time = provider.now();

  var activeTransitions = [];
  var transitions = target.transitions;
  for (var i = 0, l = transitions.length; i < l; i++) {
    var transition = transitions[i];
    if (transition.end >= time) {
      activeTransitions.push(transition);
    }
  }

  target.transitions = activeTransitions;
}

// @DESCRIPTION: test if the target has in-flight transitions
function isAnimating(target, time) {
  if (time === undefined) time = provider.now();

  var transitions = target.transitions;
  for (var i = 0, l = transitions.length; i < l; i++) {
    if (transitions[i].end >= time) return true;
  }
  return false;
}

// @DESCRIPTION: make a `from` from a `model` acording to `to`
function recopy(to, model) {
  var target, i, l;

  // @NOTE: for arrays we copy the whole array
  if (isArray(model)) {
    target = [];
    for (i = 0, l = to.length; i < l; i++) {
      target[i] = recopy(to[i], model[i]);
    }
    return target;
  }

  // @NOTE: for objects we copy only the keys that are present
  if (isObject(model)) {
    target = {};
    var keys = Object.keys(to);
    for (i = 0, l = keys.length; i < l; i++) {
      var key = keys[i];
      target[key] = recopy(to[key], model[key]);
    }
    return target;
  }

  return model;
}



// == auxiliary == //

function identity(value) {
  return value;
}

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

// @NOTE: like default css `ease`
function easeDefault(x) {
  var t = x, cs, cx;

  for (var i = 0; i < 4; ++i) {
    // @ASSERT: `cs` is never zero for the `ease`
    cs = (3.0 * t + -1.5) * t + 0.75;
    cx = ((t - 0.75) * t + 0.75) * t - x;
    t -= cx / cs;
  }

  return ((-1.7 * t + 2.4) * t + 0.3) * t;
}



// == auxiliary == //

function isArray(arr) {
  return Array.isArray(arr);
}

function isObject(val) {
  return val === Object(val);
}
