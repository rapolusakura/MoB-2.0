var mongoose = require('mongoose');

var orderSchema = new mongoose.Schema({
	// order_num: {
	// 	type: Number,
	// }
	client_contact_name: String,
	client_company_name: String, 
	client_address: String, 
	client_district: String, 
	special_instructions: String, 
	type_of_load: String, 
	mode: {
		type: String, 
		enum: ['one-way', 'round-trip']
	}, 
	distance: Number, 
	rate: Number,
	method_of_payment: {
		type: String, 
		enum: ['cash', 'credit']
	}, 
	operator: String, 
	RUC: Number, 
	dest_contact_name: String, 
	dest_company_name: String, 
	dest_address: String, 
	dest_district: String, 
	dest_phone_number: Number, 
	timestamp: {
		type: Date,
    	default: Date.now()
	}, 
	assigned_messenger_id: String, 
	kg_of_c02_saved: Number, 
	type_of_rate: {
		type: String, 
		enum: ['e-commerce', 'enterprise', 'express', 'juntoz']
	}
	delivery_status: {
		type: String,
		enum : ['outgoing','pending','completed'],
		default: 'outgoing'
	}
});

var Order = mongoose.model("Orders", orderSchema);

module.exports = Order;

