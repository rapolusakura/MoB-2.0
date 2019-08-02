var mongoose = require('mongoose');

var bikerSchema = new mongoose.Schema({
  name: String, 
  phone_number: String, 
  num_current_orders: {
    type: Number, 
    default: 0
  },
  gender: {
  	type: String, 
  	enum: ['female', 'male', 'other']
  }, 
  ecommerce_earn_rate: Number, 
  express_earn_rate: Number, 
  other_earn_rate: Number
});

var Bikers = mongoose.model("Bikers", bikerSchema);

module.exports = Bikers;

