var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
  company_name: String,
  rate: Number, 
  date_created: Date, 
  delivery_status: {
    type: String,
    enum : ['outgoing','pending','completed'],
    default: 'outgoing'
  }
});

var Order = mongoose.model("Orders", orderSchema);

module.exports = Order;

