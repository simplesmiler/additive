var expect = require('expect.js');

var util = require('../lib/util');
var interpolate = require('../lib/interpolate');
var linear = require('../lib/schema/linear');
var spinor = require('../lib/schema/spinor');
var composite = require('../lib/schema/composite');

// === //

describe('api:', function() {

  describe('interpolate.js:', function() {

    it('should export a function as `default`', function() {
      expect(interpolate).to.be.a('function');
    });

  });

  describe('util.js:', function() {

    it('should export a `now` function', function() {
      expect(util.now).to.be.a('function');
    });

    it('should export a `assign` function', function() {
      expect(util.assign).to.be.a('function');
    });

  });

  describe('schemas/linear.js:', function() {

    it('should export a `lerp` function', function() {
      expect(linear.lerp).to.be.a('function');
    });

  });

  describe('schemas/spinor.js:', function() {

    it('should export a `make` function', function() {
      expect(spinor.make).to.be.a('function');
    });

    it('should export a `slerp` function', function() {
      expect(spinor.slerp).to.be.a('function');
    });

  });

  describe('schemas/composite.js:', function() {

    it('should export a `bag` function', function() {
      expect(composite.bag).to.be.a('function');
    });

    it('should export a `list` function', function() {
      expect(composite.list).to.be.a('function');
    });

  });

});
