const AvailableBikers = require('./models/AvailableBikers')
const Bikers = require('./models/bikers')
var db = require('./db.js'); 
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const TWILIO_TEST_NUM = 'whatsapp:+14155238886'; 
const TWILIO_PROD_NUM = 'whatsapp:+5117062608';
const ANDERSONS_NUM = 'whatsapp:+51932522542';

AvailableBikers.find({}, function(err, record) {
if (err) {
  console.log(err);
} else {
  let availableToday = record[0].availableToday; 
  let availableTomorrow = record[0].availableTomorrow; 
  AvailableBikers.updateOne({"tag":1}, {$set: {"availableToday": availableToday, "availableTomorrow": availableTomorrow}}, function(err, success) {
    if(err) {console.log(err)} 
      else {
      	console.log("succesfully shifted lists")
      	//get the bikers names and phone numbers
		var list = '';
      	Bikers.find({"_id": availableTomorrow}, {name: 1, district: 1, _id: 0}, function(err, bikers) {
      		if (err) {console.log(err)}
  			else {
              for(let i =0; i<bikers.length; i++) {
              	list += `\n${bikers[i]}`; 
              	console.log(bikers[i].district)
              }
          	//message the list to anderson
          	client.messages
			  .create({
			    from: TWILIO_PROD_NUM,
			    body: `Hola, this is the tentative list for bikers available tomorrow: ${list}`,
			    to: 'whatsapp:+18082037593'
			  })
  			}
      	})
      }
  })
}  
})