var mongoose = require('mongoose');

var bikers = new mongoose.Schema({
  company_name: String,
  rate: Number, 
  date_created: Date, 
  isDelivered: Boolean 
});

var Biker = mongoose.model("Orders", orderSchema);

module.exports = Biker;

