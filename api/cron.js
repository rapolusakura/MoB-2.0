const CronJob = require('cron').CronJob;
const fetch = require("node-fetch");
const AvailableBikers = require('./models/AvailableBikers')
var db = require('./db.js'); 
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const TWILIO_TEST_NUM = 'whatsapp:+14155238886'; 
const TWILIO_PROD_NUM = 'whatsapp:+'

shiftAvailableList = () => {
  AvailableBikers.find({}, function(err, record) {
  if (err) {
      console.log(err);
  } else {
      let availableToday = record[0].availableToday; 
      let availableTomorrow = record[0].availableTomorrow; 
      AvailableBikers.updateOne({"tag":1}, {$set: {"availableToday": availableTomorrow, "availableTomorrow": []}}, function(err, success) {
        if(err) {console.log(err)} 
          else {
          	console.log("succesfully shifted lists")
          	//message the list to anderson
          	client.messages
			  .create({
			    from: TWILIO_TEST_NUM,
			    body: `Hi Sakura, this is the list for people availableTomorrow: ${availableTomorrow}!`,
			    to: `whatsapp:+18082037593`
			  })
          }
      })
  }  
})
}

notifyBikers = () => {
 fetch("http://localhost:9000/notifyBikersTest")
}

//00 05 18 * * 0-4
//the above will execute every 5:02 pm from Mon-Fri, what we want is sunday - thursday?? 
console.log('Before job instantiation');

const shiftLists = new CronJob('*/15 * * * * *', function() {
	shiftAvailableList(); 
console.log("this happened just now oh my gosh!"); 
}, 'America/Lima');



	const job = new CronJob('*/15 * * * * *', function() {
	shiftAvailableList(); 
	// notifyBikers(); 
	console.log("this happened just now oh my gosh!"); 
	}, 'America/Lima');


	
console.log('After job instantiation');

shiftLists.start();
