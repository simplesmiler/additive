var expect = require('expect.js');

var util = require('../lib/util');
var interpolate = require('../lib/interpolate');

// === //

describe('api-internal:', function() {

  describe('interpolate.js:', function() {

    it('should export a function as `default`', function() {
      expect(interpolate).to.be.a('function');
    });

  });

  describe('util.js:', function() {

    it('should export `now` function', function() {
      expect(util.now).to.be.a('function');
    });

    it('should export `assign` function', function() {
      expect(util.assign).to.be.a('function');
    });

  });

});
