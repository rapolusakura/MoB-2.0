var mongoose = require('mongoose'); 

var companySchema = new mongoose.Schema({
	approved_employees: [String], 
	RUC: Number, 
	past_orders: [String], 
	type_of_rate: {
		type: String, 
		enum: ['e-commerce', 'enterprise', 'express', 'juntoz']
	}, 
	company_name: String, 
	address: String, 
	district: String
}); 

var Companies = mongoose.model("Companies", companySchema);

module.exports = Companies;