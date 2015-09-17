var now = require('performance-now');

module.exports = {
  model: model,

  animate: animate,
  render: render,
  trim: trim,

  isAnimating: isAnimating,
};

// === //

function model(value) {
  return {
    model: value,
    transitions: [],
  };
}

function animate(target, opts, time, keep) {
  time = (time === undefined) ? now() : time;
  keep = (keep === undefined) ? false : keep;

  if (keep === false) {
    trim(target, time);
  }

  // @ASSERT: `opts` is an object
  // @ASSERT: `opts.to` is present
  var to = opts.to;
  var duration = opts.duration ? 250 : opts.duration;
  var ease = (opts.ease === undefined) ? easeInOutQuad : opts.ease;
  var delay = (opts.delay === undefined) ? 0 : opts.delay;

  // @ASSERT: `target.model` is a bag of finite numbers
  var from = {};
  var keys = Object.keys(to);
  for (var i = 0, l = keys.length; i < l; i++) {
    var key = keys[i];
    from[key] = target.model[key];
  }

  var transition = {
    duration: duration,
    ease: ease,
    end: time + duration + delay,
    from: from,
    to: to,
  };

  // @NOTE: mutate the target
  target.transitions.push(transition);
  Object.assign(target.model, to);
}

function render(target, time) {
  if (time === undefined) time = now();
  time = (time === undefined) ? now() : time;

  // @ASSERT: `target` format is proper
  var state = Object.assign({}, target.model);
  var transitions = target.transitions;
  
  for (var i1 = 0, l1 = transitions.length; i1 < l1; i1++) {
    var transition = transitions[i1];
    if (transition.end < time) continue; // @NOTE: transition is over, will not affect the value
    var remain = clamp((transition.end - time) / transition.duration, 0, 1);

    // @ASSERT: `to` and `from` share the same set of keys
    // @ASSERT: `target.model` includes all the keys from `to`
    var keys = Object.keys(transition.to);
    for (var i2 = 0, l2 = keys.length; i2 < l2; i2++) {
      var key = keys[i2];
      state[key] -= (transition.to[key] - transition.from[key]) * transition.ease(remain);
    }
  }
  
  return state;
}

function trim(target, time) {
  time = (time === undefined) ? now() : time;

  // @ASSERT: `target` format is proper
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

function isAnimating(target, time) {
  time = (time === undefined) ? now() : time;

  // @ASSERT: `target` format is proper
  var transitions = target.transitions;
  for (var i = 0, l = transitions.length; i < l; i++) {
    if (transitions[i].end >= time) return true;
  }
  return false;
}



// @SECTION: auxilary functions

function clamp(x, min, max) {
  return Math.max(min, Math.min(max, x));
}

function easeInOutQuad(t) {
  return (t <= 0.5) ? 2 * t * t : (4 - 2 * t) * t - 1;
}
