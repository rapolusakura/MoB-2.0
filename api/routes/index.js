require('dotenv').config()
var express = require('express');
var router = express.Router();
var db = require('../db.js'); 
const Order = require('../models/orders'); 
const User = require('../models/User');
const UserSession = require('../models/UserSession'); 
const Bikers = require('../models/bikers')
const AvailableBikers = require('../models/AvailableBikers')
const Companies = require('../models/Companies')
const request = require('request');
const MessagingResponse = require('twilio').twiml.MessagingResponse;
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);
const TWILIO_NUM = 'whatsapp:+14155238886'; 
const TWILIO_PROD_NUM = 'whatsapp:+5117062608'
const ANDERSONS_NUM = 'whatsapp:+51932522542';

createMessage = (body, to) => {
  client.messages
  .create({
    from: TWILIO_PROD_NUM,
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

router.post('/createOrder', function(req, res, next) {
  //keep in mind the companyId can be null espeically since you havent implemented the other componenet rendering based off of admin status
  const { body } = req;
  const {
    client_company_name, special_instructions, 
    type_of_load, mode, distance, rate, client_address, dest_address, 
    dest_contact_name, dest_company_name, dest_phone_number, client_company_id,
    startLat, startLng, endLat, endLng
  } = body;

	const order = new Order({ 
		client_company_name: client_company_name,
    special_instructions: special_instructions, 
    type_of_load: type_of_load, 
    mode: mode,
    distance: distance, 
    rate: rate,
    client_address: client_address, 
    dest_address: dest_address, 
    dest_contact_name: dest_contact_name, 
    dest_company_name: dest_company_name, 
    dest_phone_number: dest_phone_number, 
    client_company_id: client_company_id,
    startLat: startLat, 
    startLng: startLng, 
    endLat: endLat,
    endLng: endLng,
		date_created: Date.now()
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
    var {
      password, email, firstName, lastName, phone_number, employer
    } = body;
    
    email = email.toLowerCase();
    email = email.trim();
    phone_number = phone_number.trim(); 

    //add area code
    if(phone_number.length == 9) {
      phone_number = '51' + phone_number; 
    }

    // Steps: 1. Verify email doesn't exist 2. Save
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
      } else {
        // Companies.find({'RUC': employer}, function (err, companies) {
        //   if (err) {
        //   return res.send({
        //     success: false,
        //     message: 'Error: Server error'
        //   });
        //   } else if (companies.length > 1) {
        //     console.log('this is not unique!')
        //   } else if (companies.length == 1) {
        //       console.log('fuck ya found one')
        //   }
        // })
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
      })

      /*
      // Save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName.toLowerCase().trim(); 
      newUser.lastName = lastName.toLowerCase().trim(); 
      newUser.phone_number = phone_number; 

      //um idk what to do here
      newUser.employer = employer; 
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

        */
      }});
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
      if(!user.isAdmin) {
        userSession.employer = user.employer; 
      }
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
    UserSession.deleteOne({
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

// router.get('/notifyBikers', function(req, res, next) {
//   Bikers.find({}, function(err, bikers) {
//     if(err) {console.log(err)}
//     else {
//       for(let i =0; i<bikers.length; i++) {
//         createMessage('Mail On Bike: ¿Estarás disponible mañana para realizar envíos? Por favor responder sólo éstas dos opciones: (disponible/negativo)', bikers[i].phone_number);
//         //createMessage('Are you available to work tomorrow? Respond with (si/no)', bikers[i].phone_number);
//       }
//       res.send("success")
//     }
//   })
// })

router.get('/notifyBikersTest', function(req, res, next) {
  //the actual route will have nothing in the find so it gets everyone
  Bikers.find({"phone_number" : "18082037593"}, function(err, bikers) {
    if(err) {console.log(err)}
    else {
      for(let i =0; i<bikers.length; i++) {
        createMessage('Mail On Bike: ¿Estarás disponible mañana para realizar envíos? Por favor responder sólo éstas dos opciones: (disponible/negativo)', bikers[i].phone_number); 
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
  var ranges = /(?:[\u2700-\u27bf]|(?:\ud83c[\udde6-\uddff]){2}|[\ud800-\udbff][\udc00-\udfff]|[\u0023-\u0039]\ufe0f?\u20e3|\u3299|\u3297|\u303d|\u3030|\u24c2|\ud83c[\udd70-\udd71]|\ud83c[\udd7e-\udd7f]|\ud83c\udd8e|\ud83c[\udd91-\udd9a]|\ud83c[\udde6-\uddff]|\ud83c[\ude01-\ude02]|\ud83c\ude1a|\ud83c\ude2f|\ud83c[\ude32-\ude3a]|\ud83c[\ude50-\ude51]|\u203c|\u2049|[\u25aa-\u25ab]|\u25b6|\u25c0|[\u25fb-\u25fe]|\u00a9|\u00ae|\u2122|\u2139|\ud83c\udc04|[\u2600-\u26FF]|\u2b05|\u2b06|\u2b07|\u2b1b|\u2b1c|\u2b50|\u2b55|\u231a|\u231b|\u2328|\u23cf|[\u23e9-\u23f3]|[\u23f8-\u23fa]|\ud83c\udccf|\u2934|\u2935|[\u2190-\u21ff])/g
  
  //initially starting the session
  if (msgBody == 'hola' || msgBody == 'Hola') {
    createMessage('Hola del Mail on Bike!', msgFrom); 
  }
  //responding on saturday with emoji
  else if (msgBody.match(ranges)) {console.log('just received an emoji'); res.end(200)}

  //admin's key word to get list of bikers who are available tomorrow
  else if (msgBody == 'list' || msgBody == 'List') {
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
              createMessage(`This is the list for bikers available tomorrow: ${list}`, msgFrom); 
        }
      })
    }  
    })
  }
  //confirming availability for next day
  else if(msgBody == 'negativo' || msgBody == 'Negativo' || msgBody == 'negativo ' || msgBody == 'Negativo ') {
    console.log(`${msgFrom} said they are not availabe to work`)
    res.end('done')
  }
  else if (msgBody == 'disponible' || msgBody == 'Disponible' || msgBody == 'Disponible ' || msgBody == 'disponible ') {
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
              res.end('done')
            }
          }); 
      }  
    })
  }

  //accepting an order
  else if (msgBody.split(' ')[0] == 'ORDER_ID') {
    let orderId = msgBody.split(' ')[3];
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
    let orderId = msgBody.split(' ')[4]; 
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
    createMessage("No entiendo esta mensaje. Your options are: \n1) (disponible/negativo) to confirm your availability for the next day\n2) Copy and pasting the message starting with ORDER_ID to accept an order\n 3) 'Delivered ' followed by the 'ORDER_ID: ' of the order you have just completed.", msgFrom)
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
                createMessage(`ORDER_ID FOR ${company_name}: ${orderId}`, messageTemplate.assign[i].phone_number); 
                createMessage(`Hi ${messageTemplate.assign[i].name}! Would you like to take this order from ${company_name}? If you would like to accept, copy and paste EXACTLY the message with the ORDER_ID.`, messageTemplate.assign[i].phone_number) 
                console.log(`just asked if ${messageTemplate.assign[i].name} wants to take the order`)
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
  console.log(body); 
  const {
    bikerId 
  } = body;
  Bikers.find({"_id": bikerId}, {name: 1, phone_number: 1, num_current_orders: 1, district: 1} , function(err, response) {
    if(err) {console.log(err)} 
    else {
      res.send(response[0]); 
    }
  })
}); 

router.get('/getCompanyNames', (req, res, next) => {
  Companies.find({}, {'official_company_name': 1}, function(err, companies) {
    if(err) {console.log(err)}
      else {
        res.send(companies); 
      }
  })
})

router.post('/calculateDistance', (req, response, next) => {
  const { body } = req;
  const {
    start, end, mode 
  } = body;

  //check if either are empty

  //call the distance matrix API
  let distance = -1; 
  request(`https://maps.googleapis.com/maps/api/distancematrix/json?mode=walking&origins=place_id:${start}&destinations=place_id:${end}&key=${process.env.GOOGLE_MAPS_API_KEY}`, { json: true }, (err, res, body) => {
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

router.post('/calculateRate', (req, response, next) => {
  const { body } = req;
  const {
    distance, companyId
  } = body;
  let type_of_rate = ''; 
  let rate = -1.0; 
  const solPerKm = 1.3333; 
  const baseDistance = 3.75; 
  const fee = 7; 

  //get the type of rate for the company by finding their record through the ID
  //then CP the function from the orders schema 
  Companies.find({_id: companyId}, function(err, company){
    if(err) {console.log(err)} 
    else {
      type_of_rate = company[0].type_of_rate; 
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
      return response.send({
        success: true,
        rate: rate
    })
    }
  })
}); 

router.get('/getUserSessionDetails', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;

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
          isAdmin: sessions[0].isAdmin,
          userId: sessions[0]._id,
          employer: sessions[0].employer
        });
      }
    });
  });

module.exports = router;