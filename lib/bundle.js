var assign = require('object-assign');

var util = require('./util');
var additive = require('./index');
var schema = require('./schema');

module.exports = assign({}, additive, {
  schema: schema,
  util: util,
});
