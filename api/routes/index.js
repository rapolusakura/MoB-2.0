require('dotenv').config()
var express = require('express');
var router = express.Router();
var db = require('../db.js'); 
const Order = require('../models/orders'); 
const User = require('../models/User');
const UserSession = require('../models/UserSession'); 
const Bikers = require('../models/bikers')
const AvailableBikers = require('../models/AvailableBikers')
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const TWILIO_NUM = 'whatsapp:+14155238886'; 
const CronJob = require('cron').CronJob;

//get home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'fuck' });
});

router.post('/', function(req, res, next) {
  res.send('Got a POST request'); 
});

router.post('/login', function(req, res, next) {
	var username = req.body.username; 
	var password = req.body.password; 
	if(username == "rapolu@usc.edu" && password == "123") {
		res.send({loginStatus: "success"});
	} else {
		res.send({loginStatus: "failure"}); 
	}
});

router.post('/createOrder', function(req, res, next) {
	var company_name = req.body.company_name; 
	var rate = req.body.rate; 
	var delivery_status = req.body.delivery_status; 

	const order = new Order({ 
		company_name: company_name, 
		rate: rate, 
		date_created: Date.now(),
		delivery_status: delivery_status
	}); 

	order.save(function (err, order) {
		if(err) return console.error(err); 
		else {
			res.send("Order has successfully been created!"); 
		}
	});
});

router.get('/getOutgoingOrders', function(req, res, next) {
	Order.find({ "delivery_status": "outgoing" }, function(err, orders) {
        if (err) {
            console.log(err);

        } else {
          res.send(orders);  
        }  
    })
}); 

router.get('/getPendingOrders', function(req, res, next) {
	Order.find({ "delivery_status": "pending" }, function(err, orders) {
        if (err) {
            console.log(err);

        } else {
          res.send(orders);  
        }  
    })
}); 

router.get('/getCompletedOrders', function(req, res, next) {
	Order.find({ "delivery_status" : "completed" }, function(err, orders) {
        if (err) {
            console.log(err);

        } else {
          res.send(orders);  
        }  
    })
}); 

router.post('/signup', (req, res, next) => {
    const { body } = req;
    const {
      password
    } = body;
    let {
      email
    } = body;
    let {
      firstName
    } = body;
    let {
      lastName
    } = body;
    
    email = email.toLowerCase();
    email = email.trim();
    // Steps:
    // 1. Verify email doesn't exist
    // 2. Save
    User.find({
      email: email
    }, (err, previousUsers) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      } else if (previousUsers.length > 0) {
        return res.send({
          success: false,
          message: 'Error: Account already exist.'
        });
      }
      // Save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName.toLowerCase().trim(); 
      newUser.lastName = lastName.toLowerCase().trim(); 
      newUser.password = newUser.generateHash(password);
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        }
        return res.send({
          success: true,
          message: 'Signed up'
        });
      });
    });
});

router.post('/signin', (req, res, next) => {
	const { body } = req;
    const {
      password
    } = body;
    let {
      email
    } = body;
    email = email.toLowerCase().trim(); 
    User.find({
      email: email
    }, (err, users) => {
      if (err) {
        return res.send({
          success: false,
          message: 'Error: server error'
        });
      }
      if (users.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }
      const user = users[0];
      if (!user.validPassword(password)) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      }
      // Otherwise correct user
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.isAdmin = user.isAdmin;
      userSession.save((err, doc) => {
        if (err) {
          console.log(err);
          return res.send({
            success: false,
            message: 'Error: server error'
          });
        }
        return res.send({
          success: true,
          message: 'Valid sign in',
          token: doc._id
        });
      });
    });
}); 

router.get('/logout', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.remove({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      return res.send({
        success: true,
        message: 'Good'
      });
    });
  });

router.get('/verify', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    // ?token=test
    // Verify the token is one of a kind and it's not deleted.
    UserSession.find({
      _id: token,
      isDeleted: false
    }, (err, sessions) => {
      if (err) {
        console.log(err);
        return res.send({
          success: false,
          message: 'Error: Server error'
        });
      }
      if (sessions.length != 1) {
        return res.send({
          success: false,
          message: 'Error: Invalid'
        });
      } else {
        // DO ACTION
        return res.send({
          success: true,
          message: 'Good', 
          isAdmin: sessions[0].isAdmin
        });
      }
    });
  });

router.get('/jobs', (req, res, next) => {
  /* 
  AT 6-7PM PERUVIAN TIME
  clear the available today database
  move the available tomorrow database to the available today database
  clear the available tomorrow database

  AT 6AM PERUVIAN TIME
  notify all the bikers to see if they are available TOMORROW, the cutoff should be 6-7pm - why? 
  */
  console.log('Before job instantiation');
  const job = new CronJob('*/4 * * * * *', function() {
    console.log("this is happening every 4 seconds"); 
  });
  console.log('After job instantiation');
  job.start();
});

router.post('/notifyBikers', function(req, res, next) {
  const twiml = new MessagingResponse();
  const { body } = req;
  const {
    numbers
  } = body;

  for(let i = 0; i<numbers.length; i++) {
    client.messages
      .create({
        from: TWILIO_NUM,
        body: "Are you available to come into work tomorrow? Reply (available/unavailable)",
        to: `whatsapp:+${numbers[i]}`
      })
      .then(message => console.log("idk"));
  }
})

router.post('/messageReceived', function(req, res) {
  var msgFrom = parseFloat(req.body.From.split('+')[1]);
  var msgBody = req.body.Body; 
  const twiml = new MessagingResponse();
  if ( msgBody == 'Unavailable' || msgBody == 'unavailable' || msgBody == 'UNAVAILABLE') {
    twiml.message('Sorry to hear that :(');
  } else if (msgBody == 'available' || msgBody == 'Available' || msgBody == 'AVAILABLE') {
    twiml.message('Fantastico! Hasta manyana! The number that sent this is ' + msgFrom);

    //backend code to add the biker to the list of available bikers for tomorrow
    Bikers.find({phone_number: msgFrom}, function(err, biker) {
      if (err) {
          console.log(err);
      } else {
          console.log(biker[0].name)
          AvailableBikers.updateOne({"tag": 1}, { $push : { availableTomorrow: biker[0]._id}}, function(err, response) {
            if(err) {
              console.log(err); 
            }
            else {
              console.log("success the available biker has just been added")
            }
          }); 
      }  
    })
  }

  if ( msgBody == 'reject' || msgBody == 'unavailable' || msgBody == 'UNAVAILABLE') {
    twiml.message('Sorry to hear that :(');
  } else if (msgBody == 'available' || msgBody == 'Available' || msgBody == 'AVAILABLE') {
    twiml.message('Fantastico! Hasta manyana! The number that sent this is ' + msgFrom);

    //backend code to add the biker to the list of available bikers for tomorrow
    Bikers.find({phone_number: msgFrom}, function(err, biker) {
      if (err) {
          console.log(err);
      } else {
          console.log(biker[0].name)
          AvailableBikers.updateOne({"tag": 1}, { $push : { availableTomorrow: biker[0]._id}}, function(err, response) {
            if(err) {
              console.log(err); 
            }
            else {
              console.log("success the available biker has just been added")
            }
          }); 
      }  
    })
  }

  res.writeHead(200, {
    'Content-Type': 'text/xml'
  });
  res.end(twiml.toString());
}); 

router.post('/assignBikers', function(req, res, next) {
  const twiml = new MessagingResponse();
  const { body } = req;
  const {
    bikerIds
  } = body;
  const {
    orderId
  } = body; 
  let messageTemplate = {
    assign: []
  }; 

  Order.find({"_id": orderId}, function(err, order) {
        if (err) {
            console.log(err);
        } else {
          const company_name = order[0].client_company_name; 
          Bikers.find({"_id": bikerIds}, function(err, bikers) {
            if (err) {
              console.log(err);
            }
            else { 
              for(let i =0; i<bikers.length; i++) {
                messageTemplate.assign.push({ 
                    "name" : bikers[i].name,
                    "phone_number"  : bikers[i].phone_number
                });
              }

              for(let i = 0; i<messageTemplate.assign.length; i++) {
                client.messages
                  .create({
                    from: TWILIO_NUM,
                    body: `Hi ${messageTemplate.assign[i].name}! Would you like to take this order from ${company_name}? Reply (si/no)`,
                    to: `whatsapp:+${messageTemplate.assign[i].phone_number}`
                  })
                  .then(message => console.log(`sent to ${i}`));
              }
              res.send(order); 
            }
          })
        }  
    })
})

router.get('/getBikersForToday', function(req, res, next) {
    AvailableBikers.find({}, function(err, record) {
    if (err) {
        console.log(err);
    } else {
        let list = record[0].availableToday; 
        console.log(list)
        Bikers.find({"_id":{"$in": list}}, {name: 1, phone_number: 1, num_current_orders: 1} , function(err, response) {
          if(err) {console.log(err)} 
          else {
            res.send(response); 
        }
      })
    }  
  })
})

router.post('/calculateDistance', (req, response, next) => {
  const { body } = req;
  const {
    start, end, mode 
  } = body;
  let distance = -1; 
  request(`https://maps.googleapis.com/maps/api/distancematrix/json?mode=walking&origins=${start}&destinations=${end}&key=${process.env.GOOGLE_MAPS_API_KEY}`, { json: true }, (err, res, body) => {
  if (err) { return console.log(err); }
    console.log(body); 
    distance = body.rows[0].elements[0].distance.value
    if (mode == 'round-trip') {distance*=2}
    let distanceInKm = distance/1000; 
    return response.send({
      success: true,
      distance: distanceInKm
    })
  });
}); 

module.exports = router;