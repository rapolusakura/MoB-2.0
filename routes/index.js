require('dotenv').config()
var express = require('express');
const Pusher = require('pusher');
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
const TWILIO_SANDBOX_NUM = 'whatsapp:+14155238886'; 
const TWILIO_PROD_NUM = 'whatsapp:+5117062608'
const ANDERSONS_NUM = 'whatsapp:+51932522542';
const SOFIAS_NUM = 'whatsapp:+51967238429';
const FERNANDOS_NUM = 'whatsapp:51997253964'; 
const SAKURAS_NUM = 'whatsapp:+18082037593'
const pusher = new Pusher({
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_APP_KEY,
    secret: process.env.PUSHER_APP_SECRET,
    cluster: process.env.PUSHER_APP_CLUSTER, 
    useTLS: true
});

createMessage = (body, to) => {
  if(to.includes('whatsapp')) {
    client.messages
    .create({
      from: TWILIO_PROD_NUM,
      body: body,
      to: to
    })
  } else {
    client.messages
    .create({
      from: TWILIO_PROD_NUM,
      body: body,
      to: `whatsapp:+${to}`
    })
  }
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
    type_of_load, type_of_rate, mode, distance, rate, client_address, dest_address, 
    dest_contact_name, dest_company_name, dest_phone_number, client_company_id,
    startLat, startLng, endLat, endLng, 
    method_of_payment, RUC, money_collection, client_phone_number, client_contact_name, userId
  } = body;
  const kg_of_c02_saved = distance*0.3; 

	const newOrder = new Order({ 
		client_company_name: client_company_name,
    special_instructions: special_instructions, 
    type_of_load: type_of_load, 
    type_of_rate: type_of_rate,
    mode: mode,
    distance: distance, 
    rate: rate,
    timestamp: new Date(),
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
    kg_of_c02_saved: kg_of_c02_saved, 
    method_of_payment: method_of_payment,
    RUC: RUC, 
    money_collection: money_collection, 
    client_phone_number: client_phone_number, 
    client_contact_name: client_contact_name 
	}); 

	newOrder.save(function (err, record) {
		if(err) return console.error(err); 
		else {
      let newId = record._id; 
      User.find({ id: userId }, function(err, user) {
        if (err) {console.log(err)} 
        else {
          User.updateOne({_id: userId}, {$addToSet: {"pastOrders": newId}}, function(err, success) {
            if(err) {console.log(err)}
            else {
              
              pusher.trigger('orders', 'new_order', client_company_name);
              
              return res.send({
                success: true, 
                message: "Order has successfully been created"
              })
              }
          })
        }
      })
		}
	});
});

router.get('/getOutgoingOrders', function(req, res, next) {
	Order.find({ $query:{"delivery_status": "outgoing" }, $orderby: {'timestamp': 1} }, function(err, orders) {
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
      password, email, firstName, lastName, phone_number, companyId, company_name, RUC
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
      // Save the new user
      const newUser = new User();
      newUser.email = email;
      newUser.firstName = firstName.toLowerCase().trim(); 
      newUser.lastName = lastName.toLowerCase().trim(); 
      newUser.password = newUser.generateHash(password);
      newUser.employer = companyId; 
      newUser.save((err, user) => {
        if (err) {
          return res.send({
            success: false,
            message: 'Error: Server error'
          });
        } else {

        createMessage(`
        New account created! Please call this person to verify them to start making orders for their company. 

*Name*: ${firstName} ${lastName}
*Email*: ${email}
*Phone*: ${phone_number}
*Razon Commercial Name*: ${company_name}
*RUC*: ${RUC}
        `, ANDERSONS_NUM); 

        createMessage(`
        New account created! Please call this person to verify them to start making orders for their company. 

*Name*: ${firstName} ${lastName}
*Email*: ${email}
*Phone*: ${phone_number}
*Razon Commercial Name*: ${company_name}
*RUC*: ${RUC}
        `, SOFIAS_NUM); 

        createMessage(`
        New account created! Please call this person to verify them to start making orders for their company. 

*Name*: ${firstName} ${lastName}
*Email*: ${email}
*Phone*: ${phone_number}
*Razon Commercial Name*: ${company_name}
*RUC*: ${RUC}
        `, FERNANDOS_NUM); 

        return res.send({
          success: true,
          message: 'Signed up'
        });
      }
      })
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
          message: 'email'
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
          message: 'password'
        });
      }

      if(!user.isVerified) {
        return res.send({
          succes: false, 
          message: "unverified"
        })
      }
      
      // Otherwise correct user
      const userSession = new UserSession();
      userSession.userId = user._id;
      userSession.isAdmin = user.isAdmin;
      if(!user.isAdmin) {
        userSession.employer = user.employer;
        userSession.type_of_rate = user.typ
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
    //also verify that the user is verified like the isVerified field is true
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

router.post('/messageFailure', function(req, res) {
  //bot is not able to deliver the message
  if(req.body.EventType == 'UNDELIVERED') {
    var receipient = req.body.ChannelToAddress.substring(1); 
    Bikers.find({"phone_number" : receipient}, function(err, bikers) {
      if(err) {console.log(err)}
      else {
        AvailableBikers.updateOne({"tag": 1}, { $addToSet : { undelivered: bikers[0].name}}, function(err, response) {
          if(err) {
            console.log(err); 
          }
          else {
            console.log(`${bikers[0].name} was unable to be reached.`)
            res.end('done')
          }
        }); 
      }
    })
  }
}); 

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
  else if (msgBody.split(' ')[0] == 'Pedido') {
    let orderId = msgBody.split('*')[msgBody.split('*').length-2];
    Order.find({ "_id": orderId }, function(err, order) {
        if (err) {
            console.log(err);
            createMessage(`${orderId} no es un número de pedido válido. Por favor asegúrate de copiar y pegar el número de orden tal cual aparece en el mensaje sin modificaciones.`, msgFrom); 
        } else {
          if(order[0].assigned_messenger_id == null) {
            createMessage(`El pedido se te ha asignado correctamente Pedido: ${orderId}, por cliente ${order[0].client_company_name}`, msgFrom); 
            Bikers.find({"phone_number": msgFrom}, function(err, biker){
              if (err) { console.log(err)}
              else {
                Order.updateOne({_id: orderId}, {$set: {"assigned_messenger_id": biker[0]._id, "delivery_status": "pending"}}, function(err, success) {
                  if(err) {console.log(err)} else {
                    Bikers.updateOne({"phone_number": msgFrom}, {$inc: {"num_current_orders": 1}}, function(err, incremented) {
                      if (err) { console.log(err)}
                        else {
                          pusher.trigger('bikers', 'accepted_order', biker[i].name);
                          console.log("the order has been successfully assigned to you")
                        }
                    })
                    }
                }); 
              }
            })
          } else {
            createMessage(`Lo siento, el pedido: ${orderId}, del cliente ${order[0].client_company_name} ya fue asignado a otro mensajero. Procura responder más rápido al siguiente pedido.`, msgFrom); 
            console.log('is taken')
          }
        }  
    })
  }

  //delivery confirmation
  else if (msgBody.split(' ')[0] == 'entregado' || msgBody.split(' ')[0] == 'Entregado' || msgBody.split(' ')[0] == 'delivered' || msgBody.split(' ')[0] == 'Delivered') {
    let orderId = msgBody.split('*')[msgBody.split('*').length-2]
    Order.find({ "_id": orderId }, function(err, order) {
        if (err) {
            console.log(err);
            createMessage(`${orderId} no es un número de pedido válido. Por favor asegúrate de copiar y pegar el número de orden tal cual aparece en el mensaje sin modificaciones.`, msgFrom); 
        } else {
            createMessage('¡Excelente! El pedido se ha completado correctamente.', msgFrom);
            Bikers.updateOne({"phone_number": msgFrom}, {$inc: {"num_current_orders": -1}}, function(err, decremented){
              if (err) { console.log(err)}
              else {
                Order.updateOne({_id: orderId}, {$set: {"delivery_status": "completed"}}, function(err, success) {
                  if(err) {console.log(err)} else {
                    pusher.trigger('bikers', 'completed_order', order[0].client_company_name);
                    console.log("the order has been completed")}
                }); 
              }
            })
        }  
    })
  }

  //edge case
  else {
    createMessage("No entiendo este mensaje. Utilizar las siguientes palabras para las respuestas: \n1) (disponible/negativo) para confirmar tu disponibilidad para el día siguiente.\n2) Copiar el mensaje con todo el texto Pedido, pegarlo como respuesta y enciarlo al BOT para aceptar un pedido.\n3) Para confirmar una entrega debes poner la palabra *entregado* y pegar el 'Pedido: ' a continuación al enviar la respuesta al BOT y el pedido se da por concluido.", msgFrom)
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

  Order.find({"_id": orderId}, function(err, orders) {
        if (err) {
            console.log(err);
        } else {
          const order = orders[0]; 
          const company_name = order.client_company_name;
          const type_of_rate =  order.type_of_rate; 
          const client_address = order.client_address; 
          const client_contact_name = order.client_contact_name; 
          const dest_address = order.dest_address; 
          const dest_contact_name = order.dest_contact_name; 
          const dest_phone_number = order.dest_phone_number; 
          const type_of_load = order.type_of_load; 
          const mode = order.mode; 
          const rate = order.rate; 
          const special_instructions = order.special_instructions; 
          const mapsNavLink = `https://www.google.com/maps/dir/?api=1&origin=${order.startLat},${order.startLng}&destination=${order.endLat},${order.endLng}&travelmode=walking`
          const method_of_payment = order.method_of_payment; 
          if(method_of_payment = 'cash_on_origin') {method_of_payment = 'Efectivo en Origen';}
          if(method_of_payment = 'cash_on_destination') {method_of_payment = 'Efectivo en Destino';}
          if(method_of_payment = 'bank_transfer') {method_of_payment = 'Transferencia bancaria';}
          const order_num = order._id; 
          let money_collection = order.money_collection;
          if(money_collection == null) {money_collection = 0}

          let modeString = ''; 
          mode == 'one-way' ? modeString = 'UNA VÍA' : modeString = 'CON RETORNO'

          const messageToSend = `
          *Pedido: ${order_num}*
Tipo Envío: ${type_of_rate.toUpperCase()}
Origen: ${client_address}
Empresa: ${company_name}
Contacto: ${client_contact_name} 
Destino: ${dest_address}
Contacto: ${dest_contact_name} Fono: ${dest_phone_number}
Llevar: ${type_of_load.toUpperCase()}. ${modeString}. Tarifa: ${rate}. Pago: ${method_of_payment.toUpperCase()}. Recaudo=${money_collection}
Navigation: ${mapsNavLink}
${special_instructions}

Para aceptar un pedido, debes copiar y pegar el mensaje con el 'Pedido por ...' tal cual te ha llegado.
          `

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
                createMessage(`Pedido por ${company_name}: *${orderId}*`, messageTemplate.assign[i].phone_number); 
                createMessage(messageToSend, messageTemplate.assign[i].phone_number) 
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
        Bikers.find({"_id":{"$in": list}}, {name: 1, phone_number: 1, district: 1, num_current_orders: 1} , function(err, response) {
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
  Bikers.find({"_id": bikerId}, {name: 1, phone_number: 1, num_current_orders: 1, district: 1} , function(err, response) {
    if(err) {console.log(err)} 
    else {
      res.send(response[0]); 
    }
  })
}); 

router.post('/geocodeAddress', (req, res, next) => {
  const { body } = req;
  const {
    address 
  } = body;
  console.log('address: ', address); 
  let place_id, lat, lng; 
  let urlAddress = encodeURIComponent(address); 
  request(`https://maps.googleapis.com/maps/api/geocode/json?address=${urlAddress}&region=pe&key=AIzaSyCmiCER2zbSfCRoMZrZCrNBw2omSdKO-a0`, { json: true}, (err, response, body) => {
    if (err) {return console.log(err);}
    console.log(body); 
    place_id = body.results[0].place_id;
    lat = body.results[0].geometry.location.lat;
    lng = body.results[0].geometry.location.lng;
    return res.send({
      success: true, 
      place_id: place_id, 
      lat: lat, 
      lng: lng 
    })
  })
}); 

router.post('/searchForCompany', (req, res, next) => {
  const { body } = req; 
  let { val } = body; 
  val = val.toUpperCase(); 
  Companies.find({$or:[
        {"RUC":{$regex : val}},
        {"official_company_name":{$regex : val}}
    ]}, function(err, companies) {
    if(err) {console.log(err)}
      else {
        if(companies.length == 0) {
          return res.send({
            success: false, 
            message: 'no companies match the search criteria'
          })
        } else if (companies.length == 1) {
          return res.send({
            success: true, 
            message: 'found exactly one company',
            company: companies
          })
        } else if (companies.length > 1) {
          return res.send({
            success: true, 
            message: 'found more than one company',
            company: companies
          })
        }
        console.log(companies)
      }
  })
})

router.post('/calculateDistance', (req, response, next) => {
  const { body } = req;
  const {
    start, end, mode 
  } = body;
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
        rate: rate,
        type_of_rate: type_of_rate, 
        RUC: company[0].RUC
    })
    }
  })
}); 

router.get('/getUserDetails', (req, res, next) => {
    // Get the token
    const { query } = req;
    const { token } = query;
    let isAdmin = ''; 
    let userId = ''; 
    let employer = ''; 
    let officialName = ''; 
    let name = ''; 
    let defaultOrigin = ''; 
    let defaultDest = ''; 
    let phone_number = ''; 
    let type_of_rate = ''; 
    let address = ''; 
    let RUC = ''; 
    let district = ''; 

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
        isAdmin = sessions[0].isAdmin; 
        userId = sessions[0].userId; 
        employer = sessions[0].employer; 

        if(!isAdmin) {
        Companies.find({_id: employer}, {official_company_name: 1, type_of_rate: 1, address: 1, RUC: 1, district: 1}, function(err, company) {
          if(err) {console.log(err)}
          else {
            officialName = company[0].official_company_name; 
            type_of_rate = company[0].type_of_rate;
            address = company[0].address; 
            RUC = company[0].RUC; 
            district = company[0].district; 

            console.log("fuck", district); 

            User.find({ _id: userId}, function(err, user) {
              if(err) {console.log(err)}
              else {
                name = user[0].firstName.concat(' ').concat(user[0].lastName); 
                phone_number = user[0].phoneNumber; 
                defaultOrigin = user[0].defaultOriginAddress; 
                defaultDest = user[0].defaultDestAddress; 

                return res.send({
                  success: true, 
                  message: 'Found user details', 
                  isAdmin: isAdmin,
                  userId: userId,
                  employer: employer, 
                  name: name, 
                  phone_number: phone_number,
                  client_company_name: officialName, 
                  defaultOrigin: defaultOrigin, 
                  defaultDest: defaultDest,
                  type_of_rate: type_of_rate, 
                  address: address, 
                  RUC : RUC, 
                  district: district
                })
              }
            })
          } 

        })
      } else {
          User.find({ _id: userId}, function(err, user) {
              if(err) {console.log(err)}
              else {
                name = user[0].firstName.concat(' ').concat(user[0].lastName); 
                phone_number = user[0].phoneNumber;  

                return res.send({
                  success: true, 
                  message: 'Found user details', 
                  isAdmin: isAdmin,
                  userId: userId,
                  name: name, 
                  phone_number: phone_number
                })
              }
            })

      }

      }
    });
  });

module.exports = router;