> NOTE: This is a WIP (work in progress). Please refer to the [github repo](https://github.com/simplesmiler/additive)

# additive

> Additive animations the MVVM way

## Install

``` sh
$ npm install additive --save
```

## Usage

First you require the bits and bobs:

``` js
var additive = require('additive');
```

Then you make a viewmodel, specifying the initial model value:

``` js
var value = additive.make({
  model: 0,
});
```

Then you can trigger a transition with:

``` js
// @NOTE: this function mutates the viewmodel
additive.animate(value, { to: 100 });
```

And get the current state with:

``` js
var state = additive.render(value);
```

## Interpolation

Every viewmodel does contain an _interpolation schema_ alongside the model.
Note that _interpolation schema_ is different from _easing function_,
as interpolation schema is a property of the model, while easing function
is a property of transition between two model values.

By default the model is considered to be a single _linear_ number.
`additive` provides several built-in interpolation schemas
and means to compose compound schemas.

Built-in schemas:

- Linear (linear space)
- Spinor (surface of the circle, for 2D rotations)
- [@TODO] Quaternions (surface of the sphere, for 3D rotations)
- [@TODO] Color (color spaces)

Schema composition:

- Object of schemas: `{ length: linear.schema, angle: spinor.schema }`
- Array of schemas: `[ linear.schema, spinor.schema ]`
- Bag: `composite.bag(linear.schema)`
- List: `composite.list(linear.schema)`

## Easing

When applying a transition you can also specify an _easing function_ to be used
for this transition.

Default easing is a fast approximation of the default CSS easing. `additive`
does not provide any built-in easing functions except for the default one.
You can write your own easing functions or use existing modules.

## Examples

You can find examples in the `examples` folder.

## Running tests

``` sh
$ npm run lint
$ npm run test
```

## API

@TODO

## License

[ISC](http://opensource.org/licenses/ISC)
