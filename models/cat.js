var mongoose = require('mongoose');

var kittySchema = new mongoose.Schema({
  name: String
});

var Cat = mongoose.model("fuck", kittySchema);

module.exports = Cat;

