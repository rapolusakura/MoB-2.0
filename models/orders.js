var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  company_name: String,
  rate: Number, 
  date_created: Date, 
  isDelivered: Boolean 
});

var Order = mongoose.model("Orders", orderSchema);

module.exports = Order;

