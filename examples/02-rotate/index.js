(function() {
  /* eslint-env browser */

  // @NOTE: "require" all we need
  var additive = window.additive;
  var raf = window.requestAnimationFrame;
  var caf = window.cancelAnimationFrame;
  var spinor = additive.schema.spinor;

  // @NOTE: cache elements for quick access
  var screen = document.querySelector('.screen');
  var buttonRotate = document.querySelector('.button-rotate');
  var buttonToggleVisibility = document.querySelector('.button-toggle-visibility');
  var buttonToggleMove = document.querySelector('.button-toggle-move');
  var spriteModel = document.querySelector('.sprite-model');
  var spriteCss = document.querySelector('.sprite-css');
  var spriteAdditive = document.querySelector('.sprite-additive');



  // == @SECTION: state == //

  // @NOTE: viewmodel of a sprite
  var sprite = additive.make({
    schema: { spin: spinor.slerp },
    model: { spin: spinor.make(0) },
  });

  function applyState(el, state) {
    var angle = spinor.vang(state.spin);
    el.style.transform = 'rotate(' + angle + 'rad)';
  }

  // @NOTE: apply styles and let the browser transition to the new state
  function rotateModel(spin) {
    var to = { spin: spin };
    applyState(spriteModel, to);
  }

  // @NOTE: apply styles and let the browser transition to the new state
  function rotateCss(spin) {
    var to = { spin: spin };
    applyState(spriteCss, to);
  }

  // @NOTE: update viewmodel with a new transition, notify render about changes
  function rotateAdditive(spin) {
    var to = { spin: spin };
    additive.animate(sprite, { to: to, duration: 1000 });
    requestRender();
  }

  screen.addEventListener('click', rotateTo);
  function rotateTo(ev) {
    var x = ev.clientX - screen.offsetLeft - screen.offsetWidth / 2;
    var y = ev.clientY - screen.offsetTop - screen.offsetHeight / 2;
    var angle = Math.atan2(y, x);
    var spin = spinor.make(angle);
    rotateModel(spin);
    rotateCss(spin);
    rotateAdditive(spin);
  }

  buttonRotate.addEventListener('click', rotateRandomly);
  function rotateRandomly(_ev) {
    var x = Math.floor(Math.random() * screen.offsetWidth) - spriteCss.offsetLeft - spriteCss.offsetWidth / 2;
    var y = Math.floor(Math.random() * screen.offsetWidth) - spriteCss.offsetTop - spriteCss.offsetHeight / 2;
    var angle = Math.atan2(y, x);
    var spin = spinor.make(angle);
    rotateModel(spin);
    rotateCss(spin);
    rotateAdditive(spin);
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
      screen.removeEventListener('click', rotateTo);
      screen.addEventListener('mousemove', rotateTo);
      moveState = 'move';
    } else if (moveState === 'move') {
      screen.removeEventListener('mousemove', rotateTo);
      screen.addEventListener('click', rotateTo);
      moveState = 'click';
    }
  }



  // == @SECTION: rendering stuff == //

  // @NOTE: queued frame handler
  var frame = null;

  // @NOTE: initial render
  // @NOTE: style to sprite-css and sprite-model are applied by css
  requestRender();

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
