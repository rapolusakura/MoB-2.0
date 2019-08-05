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
const TWILIO_PROD_NUM = 'whatsapp:+5117062608'

createMessage = (body, to) => {
  client.messages
  .create({
    from: TWILIO_NUM,
    body: body,
    to: `whatsapp:+${to}`
  })
}

//get home page
router.get('/', function(req, res, next) {
  res.render('index', { title: 'fuck' });
});

router.post('/', function(req, res, next) {
  res.send('Got a POST request'); 
});

router.get('/changeDatabase', function(req, res, next) {
  Bikers.updateMany({}, {$set: {"num_current_orders":0}} , {multi: true}, function(err, success) {
    if(err) {console.log(err)}
      else { console.log("successfully did operation")}
  })
})

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
	var client_company_name = req.body.company_name; 
	var rate = req.body.rate; 
	var delivery_status = req.body.delivery_status; 

	const order = new Order({ 
		client_company_name: client_company_name, 
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

router.get('/notifyBikers', function(req, res, next) {
  Bikers.find({}, function(err, bikers) {
    if(err) {console.log(err)}
    else {
      for(let i =0; i<bikers.length; i++) {
        createMessage('Mail On Bike: ¿Estarás disponible mañana para realizar envíos? Por favor responder sólo éstas dos opciones: (si/no)', bikers[i].phone_number);
        //createMessage('Are you available to work tomorrow? Respond with (si/no)', bikers[i].phone_number);
      }
      res.send("success")
    }
  })
})

router.get('/notifyBikersTest', function(req, res, next) {
  //the actual route will have nothing in the find so it gets everyone
  Bikers.find({"phone_number" : "18082037593"}, function(err, bikers) {
    if(err) {console.log(err)}
    else {
      for(let i =0; i<bikers.length; i++) {
        createMessage('Are you available to come into work tomorrow? Reply (si/no)', bikers[i].phone_number); 
      }
      res.send("success")
    }
  })
})

router.post('/messageReceived', function(req, res) {
  var msgFrom = req.body.From.split('+')[1];
  var msgBody = req.body.Body; 
  const twiml = new MessagingResponse();
  console.log('got message from: ', msgFrom, " saying: ", msgBody)

  //initially starting the session
  if (msgBody == 'hola' || msgBody == 'Hola') {
    createMessage('Hola del Mail on Bike!', msgFrom); 
  }

  //confirming availability for next day
  else if(msgBody == 'no' || msgBody == 'No' || msgBody == 'No ' || msgBody == 'no ' || msgBody == 'NO') {
    console.log(`${msgFrom} said they are not availabe to work`)
  }
  else if (msgBody == 'si' || msgBody == 'sí' || msgBody == 'Sí' || msgBody == 'sí ' || msgBody == 'Si' || msgBody == 'SI' || msgBody == 'si ' || msgBody == 'Si ') {
    Bikers.find({"phone_number": msgFrom}, function(err, biker) {
      if (err) {
          console.log(err);
      } else {
          if (biker == 'undefined') {
            console.log('this phone number is undefined')
            res.end('not successful, number is undefined')
          }
          AvailableBikers.updateOne({"tag": 1}, { $addToSet : { availableTomorrow: biker[0]._id}}, function(err, response) {
            if(err) {
              console.log(err); 
            }
            else {
              console.log(`${biker[0].name} has just been added to the list of available bikers for tomorrow`)
            }
          }); 
      }  
    })
  }

  //accepting an order
  else if (msgBody.split(' ')[0] == 'ORDER_ID:') {
    let orderId = msgBody.split(' ')[1];
    Order.find({ "_id": orderId }, function(err, order) {
        if (err) {
            console.log(err);
            createMessage(`${orderId} is not a valid order. Make sure you copy and paste the message exactly without spaces.`, msgFrom); 
        } else {
          if(order[0].assigned_messenger_id == null) {
            createMessage(`Congrats! You've been assigned ORDER_ID: ${orderId}, for company ${order[0].client_company_name}`, msgFrom); 
            Bikers.find({"phone_number": msgFrom}, function(err, biker){
              if (err) { console.log(err)}
              else {
                Order.updateOne({_id: orderId}, {$set: {"assigned_messenger_id": biker[0]._id, "delivery_status": "pending"}}, function(err, success) {
                  if(err) {console.log(err)} else {
                    Bikers.updateOne({"phone_number": msgFrom}, {$inc: {"num_current_orders": 1}}, function(err, incremented) {
                      if (err) { console.log(err)}
                        else {
                          console.log("the order has been successfully assigned to you")
                        }
                    })
                    }
                }); 
              }
            })
          } else {
            createMessage(`Sorry, ORDER_ID: ${orderId}, for company ${order[0].client_company_name} has already been accepted by another biker. Next time, respond faster!`, msgFrom); 
            console.log('is taken')
          }
        }  
    })
  }

  //delivery confirmation
  else if (msgBody.split(' ')[0] == 'Delivered' || msgBody.split(' ')[0] == 'delivered' || msgBody.split(' ')[0] == 'DELIVERED') {
    let orderId = msgBody.split(' ')[2]; 
    Order.find({ "_id": orderId }, function(err, order) {
        if (err) {
            console.log(err);
            createMessage(`${orderId} is not a valid order. Make sure you copy and paste the message exactly without spaces.`, msgFrom); 
        } else {
            createMessage('Great! You just completed this delivery.', msgFrom);
            Bikers.updateOne({"phone_number": msgFrom}, {$inc: {"num_current_orders": -1}}, function(err, decremented){
              if (err) { console.log(err)}
              else {
                Order.updateOne({_id: orderId}, {$set: {"delivery_status": "completed"}}, function(err, success) {
                  if(err) {console.log(err)} else {
                    console.log("the order has been completed")}
                }); 
              }
            })
        }  
    })

  }

  //edge case
  else {
    createMessage("I don't understand this message. Your options are: \n1) (si/no) to confirm your availability for the next day\n2) Copy and pasting the message starting with ORDER_ID to accept an order\n 3) 'Delivered ' followed by the 'ORDER_ID: ' of the order you have just completed.", msgFrom)
  }
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
                    body: `ORDER_ID: ${orderId}`,
                    to: `whatsapp:+${messageTemplate.assign[i].phone_number}`
                  })

                client.messages
                  .create({
                    from: TWILIO_NUM,
                    body: `Hi ${messageTemplate.assign[i].name}! Would you like to take this order from ${company_name}? If you would like to accept, copy and paste EXACTLY the message with the ORDER_ID.`,
                    to: `whatsapp:+${messageTemplate.assign[i].phone_number}`
                  })
                  .then(message => console.log(`sent to: ${messageTemplate.assign[i].name}`));
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

router.post('/getBikerDetails', (req, res, next) => {
  const { body } = req;
  const {
    bikerId 
  } = body;
  Bikers.find({"_id": bikerId}, {name: 1, phone_number: 1, num_current_orders: 1} , function(err, response) {
    if(err) {console.log(err)} 
    else {
      res.send(response[0]); 
    }
  })
}); 

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