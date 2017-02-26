var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var GiffSchema = new mongoose.Schema({
  keyword: String,
  url: String,
  description: String,
});

module.exports = mongoose.model('Giff', GiffSchema);
