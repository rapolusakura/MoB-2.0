var mongoose = require('mongoose');

var availableSchema = new mongoose.Schema({
  availableToday: {
  	type: [String], 
  	default: []
  }, 
  availableTomorrow: {
  	type: [String],
  	default: []
  }
});

var AvailableBikers = mongoose.model("AvailableBikers", availableSchema);

module.exports = AvailableBikers;