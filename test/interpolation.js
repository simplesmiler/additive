var expect = require('expect.js');

var interpolate = require('../lib/interpolate');
var linear = require('../lib/schema/linear');
var spinor = require('../lib/schema/spinor');
var composite = require('../lib/schema/composite');

var EPSILON = 1e-15;

// === //

describe('interpolation:', function() {

  describe('linear:', function() {

    it('should interpolate to a different point', function() {
      var model = 100, from = 0, to = 100;
      expect(linear.schema(model, from, to, 4/4)).to.be.equal(0);
      expect(linear.schema(model, from, to, 3/4)).to.be.equal(25);
      expect(linear.schema(model, from, to, 2/4)).to.be.equal(50);
      expect(linear.schema(model, from, to, 1/4)).to.be.equal(75);
      expect(linear.schema(model, from, to, 0/4)).to.be.equal(100);
    });

    it('should interpolate to the same point', function() {
      var model = 0, from = 0, to = 0;
      expect(linear.schema(model, from, to, 4/4)).to.be.equal(0);
      expect(linear.schema(model, from, to, 3/4)).to.be.equal(0);
      expect(linear.schema(model, from, to, 2/4)).to.be.equal(0);
      expect(linear.schema(model, from, to, 1/4)).to.be.equal(0);
      expect(linear.schema(model, from, to, 0/4)).to.be.equal(0);
    });

    it('should interpolate with overshooting', function() {
      var model = 200, from = 0, to = 100;
      expect(linear.schema(model, from, to, 4/4)).to.be.equal(100);
      expect(linear.schema(model, from, to, 3/4)).to.be.equal(125);
      expect(linear.schema(model, from, to, 2/4)).to.be.equal(150);
      expect(linear.schema(model, from, to, 1/4)).to.be.equal(175);
      expect(linear.schema(model, from, to, 0/4)).to.be.equal(200);
    });

    it('should interpolate additively', function() {
      var model = 200, from = 0, to = 100;
      expect(linear.schema(model, from, to, 4/4)).to.be.equal(100);
      expect(linear.schema(model, from, to, 3/4)).to.be.equal(125);
      expect(linear.schema(model, from, to, 2/4)).to.be.equal(150);
      expect(linear.schema(model, from, to, 1/4)).to.be.equal(175);
      expect(linear.schema(model, from, to, 0/4)).to.be.equal(200);
    });

  });

  describe('spinor:', function() {

    var suites = [
      {
        subtitle: 'from 0 to pi/2',
        model: spinor.fromAngle(+4/8 * Math.PI),
        from: spinor.fromAngle(+0/8 * Math.PI),
        to: spinor.fromAngle(+4/8 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(+0/8 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(+1/8 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(+2/8 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(+3/8 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(+4/8 * Math.PI) },
        ],
      },
      {
        subtitle: 'from pi/2 to pi',
        model: spinor.fromAngle(+8/8 * Math.PI),
        from: spinor.fromAngle(+4/8 * Math.PI),
        to: spinor.fromAngle(+8/8 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(+4/8 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(+5/8 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(+6/8 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(+7/8 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(+8/8 * Math.PI) },
        ],
      },
      {
        subtitle: 'from -pi to -pi/2',
        model: spinor.fromAngle(-4/8 * Math.PI),
        from: spinor.fromAngle(-8/8 * Math.PI),
        to: spinor.fromAngle(-4/8 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(-8/8 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(-7/8 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(-6/8 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(-5/8 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(-4/8 * Math.PI) },
        ],
      },
      {
        subtitle: 'from -pi/2 to -0',
        model: spinor.fromAngle(-0/8 * Math.PI),
        from: spinor.fromAngle(-4/8 * Math.PI),
        to: spinor.fromAngle(-0/8 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(-4/8 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(-3/8 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(-2/8 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(-1/8 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(-0/8 * Math.PI) },
        ],
      },
      {
        subtitle: 'from 0 to very close to pi',
        model: spinor.fromAngle(+4/4 * 0.999 * Math.PI),
        from: spinor.fromAngle(+0/4 * 0.999 * Math.PI),
        to: spinor.fromAngle(+4/4 * 0.999 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(+0/4 * 0.999 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(+1/4 * 0.999 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(+2/4 * 0.999 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(+3/4 * 0.999 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(+4/4 * 0.999 * Math.PI) },
        ],
      },
      {
        subtitle: 'from -0 to very close to -pi',
        model: spinor.fromAngle(-4/4 * 0.999 * Math.PI),
        from: spinor.fromAngle(-0/4 * 0.999 * Math.PI),
        to: spinor.fromAngle(-4/4 * 0.999 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(-0/4 * 0.999 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(-1/4 * 0.999 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(-2/4 * 0.999 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(-3/4 * 0.999 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(-4/4 * 0.999 * Math.PI) },
        ],
      },
      {
        subtitle: 'from 0 to pi (only start and finish)',
        model: spinor.fromAngle(+4/4 * Math.PI),
        from: spinor.fromAngle(+0/4 * Math.PI),
        to: spinor.fromAngle(+4/4 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(+0/4 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(+4/4 * Math.PI) },
        ],
      },
      {
        subtitle: 'from -pi to -0 (only start and finish)',
        model: spinor.fromAngle(-0/4 * Math.PI),
        from: spinor.fromAngle(-4/4 * Math.PI),
        to: spinor.fromAngle(-0/4 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(-4/4 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(-0/4 * Math.PI) },
        ],
      },
      {
        subtitle: 'from 0 to 3*pi/4 (minimum torque)',
        model: spinor.fromAngle(+12/8 * Math.PI),
        from: spinor.fromAngle(+0/8 * Math.PI),
        to: spinor.fromAngle(+12/8 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(-0/8 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(-1/8 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(-2/8 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(-3/8 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(-4/8 * Math.PI) },
        ],
      },
      {
        subtitle: 'from -pi to pi (minimum torque)',
        model: spinor.fromAngle(+4/4 * Math.PI),
        from: spinor.fromAngle(-4/4 * Math.PI),
        to: spinor.fromAngle(+4/4 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(-4/4 * Math.PI) },
          { remain: +4/4, result: spinor.fromAngle(+4/4 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(-4/4 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(+4/4 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(-4/4 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(+4/4 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(-4/4 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(+4/4 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(-4/4 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(+4/4 * Math.PI) },
        ],
      },
      {
        subtitle: 'from -2*pi to 2*pi (minimum torque)',
        model: spinor.fromAngle(+8/4 * Math.PI),
        from: spinor.fromAngle(-8/4 * Math.PI),
        to: spinor.fromAngle(+8/4 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(-8/4 * Math.PI) },
          { remain: +4/4, result: spinor.fromAngle(+8/4 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(-8/4 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(+8/4 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(-8/4 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(+8/4 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(-8/4 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(+8/4 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(-8/4 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(+8/4 * Math.PI) },
        ],
      },
      {
        subtitle: 'with overshooting',
        model: spinor.fromAngle(+4/8 * Math.PI),
        from: spinor.fromAngle(+0/8 * Math.PI),
        to: spinor.fromAngle(+4/8 * Math.PI),
        tests: [
          { remain: +6/4, result: spinor.fromAngle(-2/8 * Math.PI) },
          { remain: +5/4, result: spinor.fromAngle(-1/8 * Math.PI) },
          { remain: +4/4, result: spinor.fromAngle(-0/8 * Math.PI) },
          { remain: +4/4, result: spinor.fromAngle(+0/8 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(+1/8 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(+2/8 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(+3/8 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(+4/8 * Math.PI) },
          { remain: -0/4, result: spinor.fromAngle(+4/8 * Math.PI) },
          { remain: -1/4, result: spinor.fromAngle(+5/8 * Math.PI) },
          { remain: -2/4, result: spinor.fromAngle(+6/8 * Math.PI) },
        ],
      },
      {
        subtitle: 'additively',
        model: spinor.fromAngle(+8/8 * Math.PI),
        from: spinor.fromAngle(+0/8 * Math.PI),
        to: spinor.fromAngle(+4/8 * Math.PI),
        tests: [
          { remain: +4/4, result: spinor.fromAngle(+4/8 * Math.PI) },
          { remain: +3/4, result: spinor.fromAngle(+5/8 * Math.PI) },
          { remain: +2/4, result: spinor.fromAngle(+6/8 * Math.PI) },
          { remain: +1/4, result: spinor.fromAngle(+7/8 * Math.PI) },
          { remain: +0/4, result: spinor.fromAngle(+8/8 * Math.PI) },
        ],
      },
    ];

    suites.forEach(function(suite) {
      it('should interpolate ' + suite.subtitle, function() {
        suite.tests.forEach(function(test) {
          var result = spinor.schema(suite.model, suite.from, suite.to, test.remain);
          if (!spinor.almostEqual(result, test.result, EPSILON)) {
            console.log(suite, test, result);
            throw new Error('expected ' + spinor.toAngle(result) + ' to be close to ' + spinor.toAngle(test.result));
          }
        });
      });
    });

  });

  describe('composite.bag:', function() {

    it('should interpolate a bag of values', function() {
      var schema = composite.bag(linear.schema);
      var model = { a: +1.00, b: -1.00, c: +1.00 };
      var from =  { a: +0.00, b: -0.00, c: -1.00 };
      var to =    { a: +1.00, b: -1.00, c: +1.00 };
      var tests  = [
        { remain: +4/4, result: { a: +0.00, b: -0.00, c: -1.00 } },
        { remain: +3/4, result: { a: +0.25, b: -0.25, c: -0.50 } },
        { remain: +2/4, result: { a: +0.50, b: -0.50, c: -0.00 } },
        { remain: +1/4, result: { a: +0.75, b: -0.75, c: +0.50 } },
        { remain: +0/4, result: { a: +1.00, b: -1.00, c: +1.00 } },
      ];
      tests.forEach(function(test) {
        var result = interpolate(schema, model, from, to, test.remain);
        expect(result).to.be.eql(test.result);
      });
    });

    it('should interpolate a bag of values partially', function() {
      var schema = composite.bag(linear.schema);
      var model = { a: +1.00, b: -1.00, c: +1.00 };
      var from =  { a: +0.00 };
      var to =    { a: +1.00 };
      var tests  = [
        { remain: +4/4, result: { a: +0.00, b: -1.00, c: +1.00 } },
        { remain: +3/4, result: { a: +0.25, b: -1.00, c: +1.00 } },
        { remain: +2/4, result: { a: +0.50, b: -1.00, c: +1.00 } },
        { remain: +1/4, result: { a: +0.75, b: -1.00, c: +1.00 } },
        { remain: +0/4, result: { a: +1.00, b: -1.00, c: +1.00 } },
      ];
      tests.forEach(function(test) {
        var result = interpolate(schema, model, from, to, test.remain);
        expect(result).to.be.eql(test.result);
      });
    });

    it('should interpolate a bag of bags of values', function() {
      var schema = composite.bag(composite.bag(linear.schema));
      var model = { a: { aa: 2.0 }, b: { bb: 0.0 } };
      var from = { a: { aa: 0.0 }, b: { bb: 2.0 } };
      var to = { a: { aa: 2.0 }, b: { bb: 0.0 } };
      var tests  = [
        { remain: +4/4, result: { a: { aa: 0.0 }, b: { bb: 2.0 } } },
        { remain: +3/4, result: { a: { aa: 0.5 }, b: { bb: 1.5 } } },
        { remain: +2/4, result: { a: { aa: 1.0 }, b: { bb: 1.0 } } },
        { remain: +1/4, result: { a: { aa: 1.5 }, b: { bb: 0.5 } } },
        { remain: +0/4, result: { a: { aa: 2.0 }, b: { bb: 0.0 } } },
      ];
      tests.forEach(function(test) {
        var result = interpolate(schema, model, from, to, test.remain);
        expect(result).to.be.eql(test.result);
      });
    });

  });

  describe('composite.list:', function() {

    it('should interpolate a list of values', function() {
      var schema = composite.list(linear.schema);
      var model = [ +1.00, -1.00, +1.00 ];
      var from =  [ +0.00, -0.00, -1.00 ];
      var to =    [ +1.00, -1.00, +1.00 ];
      var tests  = [
        { remain: +4/4, result: [ +0.00, -0.00, -1.00 ] },
        { remain: +3/4, result: [ +0.25, -0.25, -0.50 ] },
        { remain: +2/4, result: [ +0.50, -0.50, -0.00 ] },
        { remain: +1/4, result: [ +0.75, -0.75, +0.50 ] },
        { remain: +0/4, result: [ +1.00, -1.00, +1.00 ] },
      ];
      tests.forEach(function(test) {
        var result = interpolate(schema, model, from, to, test.remain);
        expect(result).to.be.eql(test.result);
      });
    });

    it('should interpolate a list of lists of values', function() {
      var schema = composite.list(composite.list(linear.schema));
      var model = [ [ 2.0 ], [ 0.0 ] ];
      var from = [ [ 0.0 ], [ 2.0 ] ];
      var to = [ [ 2.0 ], [ 0.0 ] ];
      var tests  = [
        { remain: +4/4, result: [ [ 0.0 ], [ 2.0 ] ] },
        { remain: +3/4, result: [ [ 0.5 ], [ 1.5 ] ] },
        { remain: +2/4, result: [ [ 1.0 ], [ 1.0 ] ] },
        { remain: +1/4, result: [ [ 1.5 ], [ 0.5 ] ] },
        { remain: +0/4, result: [ [ 2.0 ], [ 0.0 ] ] },
      ];
      tests.forEach(function(test) {
        var result = interpolate(schema, model, from, to, test.remain);
        expect(result).to.be.eql(test.result);
      });
    });

  });

  describe('plain:', function() {

    it('should interpolate plain object', function() {
      var schema = { a: linear.schema, b: spinor.schema };
      var model = { a: 2.0, b: spinor.fromAngle(0/8 * Math.PI) };
      var from = { a: 0.0, b: spinor.fromAngle(4/8 * Math.PI) };
      var to = { a: 2.0, b: spinor.fromAngle(0/8 * Math.PI) };
      var tests  = [
        { remain: +4/4, result: { a: 0.0, b: spinor.fromAngle(4/8 * Math.PI) } },
        { remain: +3/4, result: { a: 0.5, b: spinor.fromAngle(3/8 * Math.PI) } },
        { remain: +2/4, result: { a: 1.0, b: spinor.fromAngle(2/8 * Math.PI) } },
        { remain: +1/4, result: { a: 1.5, b: spinor.fromAngle(1/8 * Math.PI) } },
        { remain: +0/4, result: { a: 2.0, b: spinor.fromAngle(0/8 * Math.PI) } },
      ];
      tests.forEach(function(test) {
        var result = interpolate(schema, model, from, to, test.remain);
        expect(result.a).to.be.equal(test.result.a);
        if (!spinor.almostEqual(result.b, test.result.b, EPSILON)) {
          throw new Error('expected ' + spinor.toAngle(result.b) + ' to be close to ' + spinor.toAngle(test.result.b));
        }
      });
    });

    it('should interpolate plain object partially', function() {
      var schema = { a: linear.schema, b: linear.schema };
      var model = { a: 2.0, b: 0.0 };
      var from = { a: 0.0 };
      var to = { a: 2.0 };
      var tests  = [
        { remain: +4/4, result: { a: 0.0, b: 0.0 } },
        { remain: +3/4, result: { a: 0.5, b: 0.0 } },
        { remain: +2/4, result: { a: 1.0, b: 0.0 } },
        { remain: +1/4, result: { a: 1.5, b: 0.0 } },
        { remain: +0/4, result: { a: 2.0, b: 0.0 } },
      ];
      tests.forEach(function(test) {
        var result = interpolate(schema, model, from, to, test.remain);
        expect(result).to.be.eql(test.result);
      });
    });

    it('should interpolate plain array', function() {
      var schema = [ linear.schema, spinor.schema ];
      var model = [ 2.0, spinor.fromAngle(0/8 * Math.PI) ];
      var from = [ 0.0, spinor.fromAngle(4/8 * Math.PI) ];
      var to = [ 2.0, spinor.fromAngle(0/8 * Math.PI) ];
      var tests  = [
        { remain: +4/4, result: [ 0.0, spinor.fromAngle(4/8 * Math.PI) ] },
        { remain: +3/4, result: [ 0.5, spinor.fromAngle(3/8 * Math.PI) ] },
        { remain: +2/4, result: [ 1.0, spinor.fromAngle(2/8 * Math.PI) ] },
        { remain: +1/4, result: [ 1.5, spinor.fromAngle(1/8 * Math.PI) ] },
        { remain: +0/4, result: [ 2.0, spinor.fromAngle(0/8 * Math.PI) ] },
      ];
      tests.forEach(function(test) {
        var result = interpolate(schema, model, from, to, test.remain);
        expect(result[0]).to.be.equal(test.result[0]);
        if (!spinor.almostEqual(result[1], test.result[1], EPSILON)) {
          throw new Error('expected ' + spinor.toAngle(result[1]) + ' to be close to ' + spinor.toAngle(test.result[1]));
        }
      });
    });

  });


});
