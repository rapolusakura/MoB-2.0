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
  let rawList = record[0].undelivered; 
  let undelivered = ''; 
  for(var i = 0; i<rawList.length; i++) {
  	undelivered += rawList[i] + '\n'; 
  }
	client.messages
		.create({
		from: TWILIO_PROD_NUM,
		body: `Was not able to contact: \n${undelivered}`,
		to: ANDERSONS_NUM
	})

	client.messages
		.create({
		from: TWILIO_PROD_NUM,
		body: `Was not able to contact: \n${undelivered}`,
		to: SOFIAS_NUM
	})

    AvailableBikers.updateOne({"tag": 1}, { $set : { undelivered: []}}, function(err, response) {
      if(err) {
        console.log(err); 
      }
      else {
        console.log(`Undelivered names reset.`)
      }
    }); 
}  
})