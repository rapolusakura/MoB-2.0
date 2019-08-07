const Bikers = require('./models/bikers')
var db = require('./db.js'); 
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const TWILIO_TEST_NUM = 'whatsapp:+14155238886'; 
const TWILIO_PROD_NUM = 'whatsapp:+5117062608';
const ANDERSONS_NUM = 'whatsapp:+51932522542';

//conditional message based on day of the week
var d = new Date();
var n = d.getDay();
var msgBody = ''; 

if(n == 6) {
	msgBody = "Que tengas un lindo fin de semana, por favor responde con un emoji 😄"
} else {
	msgBody = "Mail On Bike: ¿Estarás disponible mañana para realizar envíos? Por favor responder sólo éstas dos opciones: (disponible/negativo)"
}

Bikers.find({}, function(err, bikers) {
	if(err) {console.log(err)}
		else {
		  for(let i =0; i<bikers.length; i++) {
		  	client.messages
				  .create({
				    from: TWILIO_PROD_NUM,
				    body: msgBody,
				    to: `whatsapp:+${bikers[i].phone_number}`
		  	})
		  }
		}
})

//