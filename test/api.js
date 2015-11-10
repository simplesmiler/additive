var expect = require('expect.js');

var additive = require('..');
var linear = require('../lib/schema/linear');
var spinor = require('../lib/schema/spinor');
var composite = require('../lib/schema/composite');

// === //

describe('api:', function() {

  describe('index.js:', function() {

    it('should export `make` function', function() {
      expect(additive.make).to.be.a('function');
    });

    it('should export `animate` function', function() {
      expect(additive.animate).to.be.a('function');
    });

    it('should export `render` function', function() {
      expect(additive.render).to.be.a('function');
    });

    it('should export `trim` function', function() {
      expect(additive.trim).to.be.a('function');
    });

    it('should export `isAnimating` function', function() {
      expect(additive.isAnimating).to.be.a('function');
    });

  });

  describe('schemas/linear.js:', function() {

    it('should export `schema` function', function() {
      expect(linear.schema).to.be.a('function');
    });

  });

  describe('schemas/spinor.js:', function() {

    it('should export `fromAngle` function', function() {
      expect(spinor.fromAngle).to.be.a('function');
    });

    it('should export `toAngle` function', function() {
      expect(spinor.toAngle).to.be.a('function');
    });

    it('should export `almostEqual` function', function() {
      expect(spinor.almostEqual).to.be.a('function');
    });

    it('should export `schema` function', function() {
      expect(spinor.schema).to.be.a('function');
    });

  });

  describe('schemas/composite.js:', function() {

    it('should export `bag` function', function() {
      expect(composite.bag).to.be.a('function');
    });

    it('should export `list` function', function() {
      expect(composite.list).to.be.a('function');
    });

  });

});
