var mongoose = require('mongoose');

var availableSchema = new mongoose.Schema({
  availableToday: [String], 
  availableTomorrow: [String]
});

var AvailableBikers = mongoose.model("AvailableBikers", availableSchema);

module.exports = AvailableBikers;