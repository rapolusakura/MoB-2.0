var express = require('express');
var router = express.Router();
var mongoose = require('../db.js');
var Order = require('../models/orders.js'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'fuck' });
});

router.get('/about', function(req, res, next) {
  res.send('hi this is sakura :D'); 
});

router.post('/', function(req, res, next) {
  res.send('Got a POST request'); 
});

router.post('/login', function(req, res, next) {
	var username = req.body.username; 
	var password = req.body.password; 
	if(username == "Sakura" && password == "123") {
		res.send({loginStatus: "success"});
	} else {
		res.send({loginStatus: "failure"}); 
	}
});

router.post('/createOrder', function(req, res, next) {
	var company_name = req.body.company_name; 
	var rate = req.body.rate; 
	var isDelivered = req.body.isDelivered; 

	const order = new Order({ 
		company_name: company_name, 
		rate: rate, 
		date_created: Date.now(),
		isDelivered: isDelivered
	}); 

	order.save(function (err, order) {
		if(err) return console.error(err); 
		else {
			res.send("Order has successfully been created!"); 
		}
	});
});

router.get('/getOrders', function(req, res, next) {
	Order.find({}, function(err, orders) {
        if (err) {
            console.log(err);

        } else {
          res.send(orders);  
        }  
    })
}); 

module.exports = router;