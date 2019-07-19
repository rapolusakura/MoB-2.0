var express = require('express');
var router = express.Router();
var db = require('../db.js'); 
const Order = require('../models/orders.js'); 
const User = require('../models/User');
const UserSession = require('../models/UserSession'); 

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
    UserSession.findAndModify({
      _id: token,
      isDeleted: false
    }, {
      $set: {
        isDeleted:true
      }
    }, null, (err, sessions) => {
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

module.exports = router;