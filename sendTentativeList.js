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
const SOFIAS_NUM = 'whatsapp:+51967238429';

AvailableBikers.find({}, function(err, record) {
if (err) {
  console.log(err);
} else {
  let availableTomorrow = record[0].availableTomorrow; 
	//get the bikers names and phone numbers
  var list = '';
	Bikers.find({"_id": availableTomorrow}, {name: 1, district: 1, _id: 0}, function(err, bikers) {
		if (err) {console.log(err)}
		else {
          for(let i =0; i<bikers.length; i++) {
            var biker = JSON.stringify(bikers[i]);
            var district = biker.split('"')[7]
          	list += `\n${bikers[i].name}: ${district}`; 
          }
      	//message the list to anderson and sofia
  		client.messages
	  .create({
	    from: TWILIO_PROD_NUM,
	    body: `Hola, this is the tentative list for bikers available tomorrow: ${list}`,
	    to: ANDERSONS_NUM
	  })

	  client.messages
	  .create({
	    from: TWILIO_PROD_NUM,
	    body: `Hola, this is the tentative list for bikers available tomorrow: ${list}`,
	    to: SOFIAS_NUM
	  })
		}
	})
}  
})