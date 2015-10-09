(function() {
  /* eslint-env browser */

  // @NOTE: "require" all we need
  var additive = window.additive;
  var raf = window.requestAnimationFrame;
  var caf = window.cancelAnimationFrame;
  var linear = additive.schema.linear;

  // @NOTE: cache elements for quick access
  var screen = document.querySelector('.screen');
  var buttonMove = document.querySelector('.button-move');
  var buttonToggleVisibility = document.querySelector('.button-toggle-visibility');
  var buttonToggleMove = document.querySelector('.button-toggle-move');
  var spriteModel = document.querySelector('.sprite-model');
  var spriteCss = document.querySelector('.sprite-css');
  var spriteAdditive = document.querySelector('.sprite-additive');



  // == @SECTION: state == //

  // @NOTE: viewmodel of a sprite
  var sprite = additive.make({
    schema: { x: linear.lerp, y: linear.lerp },
    model: { x: screen.offsetWidth / 2, y: screen.offsetHeight / 2 },
  });

  function applyState(el, state) {
    el.style.transform = 'translate(' + state.x + 'px, ' + state.y + 'px)';
  }

  // @NOTE: apply styles immediately
  function moveModel(x, y) {
    var state = { x: x, y: y };
    applyState(spriteModel, state);
  }

  // @NOTE: apply styles and let the browser transition to the new state
  function moveCss(x, y) {
    var state = { x: x, y: y };
    applyState(spriteCss, state);
  }

  // @NOTE: update viewmodel with a new transition, notify render about changes
  function moveAdditive(x, y) {
    var to = { x: x, y: y };
    additive.animate(sprite, { to: to, duration: 1500 });
    requestRender();
  }

  screen.addEventListener('click', moveTo);
  function moveTo(ev) {
    var x = ev.clientX - screen.offsetLeft;
    var y = ev.clientY - screen.offsetTop;
    moveModel(x, y);
    moveCss(x, y);
    moveAdditive(x, y);
  }

  buttonMove.addEventListener('click', moveRandomly);
  function moveRandomly(_ev) {
    var x = Math.floor(Math.random() * screen.offsetWidth);
    var y = Math.floor(Math.random() * screen.offsetHeight);
    moveModel(x, y);
    moveCss(x, y);
    moveAdditive(x, y);
  }

  var visibilityState = 'both';
  buttonToggleVisibility.addEventListener('click', toggleVisibility);
  function toggleVisibility(_ev) {
    if (visibilityState === 'both') {
      spriteAdditive.style.display = 'none';
      visibilityState = 'css';
    } else if (visibilityState === 'css') {
      spriteAdditive.style.display = 'block';
      spriteCss.style.display = 'none';
      visibilityState = 'js';
    } else if (visibilityState === 'js') {
      spriteCss.style.display = 'block';
      visibilityState = 'both';
    }
  }

  var moveState = 'click';
  buttonToggleMove.addEventListener('click', toggleMove);
  function toggleMove(_ev) {
    if (moveState === 'click') {
      screen.removeEventListener('click', moveTo);
      screen.addEventListener('mousemove', moveTo);
      moveState = 'move';
    } else if (moveState === 'move') {
      screen.removeEventListener('mousemove', moveTo);
      screen.addEventListener('click', moveTo);
      moveState = 'click';
    }
  }



  // == @SECTION: rendering stuff == //

  // @NOTE: queued frame handler
  var frame = null;

  // @NOTE: call this function whenever model has changed    
  function requestRender() {
    caf(frame);
    frame = raf(render);
  }

  // @NOTE: only called inside an animation frame
  function render() {
    // @NOTE: render current state, apply styles
    var state = additive.render(sprite);
    applyState(spriteAdditive, state);

    // @NOTE: requeue the render function if animation is not over yet
    if (additive.isAnimating(sprite)) {
      requestRender();
    }
  }

})();
