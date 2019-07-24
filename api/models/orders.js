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
	},
	delivery_status: {
		type: String,
		enum : ['outgoing','pending','completed'],
		default: 'outgoing'
	}
});

orderSchema.methods.calculateRate = function(distance, type_of_rate) {
	let rate = -1.0; 
	const solPerKm = 1.3333; 
	const baseDistance = 3.75; 
	const fee = 7; 

	if(type_of_rate == 'express') {
		rate = Math.ceil(fee + (distance - baseDistance)*solPerKm); 
	} else if (type_of_rate == 'enterprise') {
		rate = Math.ceil(3 + fee + (distance - baseDistance)*solPerKm); 
	} else if (type_of_rate == 'e-commerce' || type_of_rate == 'juntoz') {
		if (distance <= 3*baseDistance) { rate = fee }
		else if (distance > 3*baseDistance && distance<=baseDistance*3.5) {rate = 9}
		else if (distance > 3.5*baseDistance && distance<=baseDistance*4) {rate = 12}
		else if (distance > 4*baseDistance && distance<=baseDistance*4.5) {rate = 14}
		else if (distance > 4.5*baseDistance) {rate = 14 + (distance - (baseDistance*4.5))*solPerKm}
	}
	return rate;  
};

var Order = mongoose.model("Orders", orderSchema);

module.exports = Order;

