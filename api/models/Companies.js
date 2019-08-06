var mongoose = require('mongoose'); 

var companySchema = new mongoose.Schema({
	approved_employees: [String], 
	RUC: Number, 
	past_orders: [String], 
	type_of_rate: {
		type: String, 
		enum: ['e-commerce', 'enterprise', 'express', 'juntoz']
	}, 
	official_company_name: String,
	company_name: String, 
	address: String, 
	district: String, 
	phone_number: String, 
	department: String, 
	province: String, 
	contact_first_name: String, 
	contact_last_name: String, 
	contact_phone_number: String, 
	email: String, 
	salesperson: String, 
	payment_method: String,
	payment_receipt: String, 
	bank: String,
	bank_account_type: String,
	bank_account_number: String
}); 

var Companies = mongoose.model("Companies", companySchema);

module.exports = Companies;