var express = require('express');
var router = express.Router();
var mongoose = require('../db.js').mongoose;
var Cat = require('../models/cat.js');
var Order = require('../models/orders.js'); 

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
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

router.get('/getKitty', function(req, res, next) {
	Cat.find({}, function(err, cats) {
        if (err) {
            console.log(err);

        } else {
          res.send(cats);  
        }  
    })
}); 

router.get('/addKitty', function(req, res, next) {
	const kitty = new Cat({ name: 'aileen' });
	kitty.save(function (err, kitty) {
		if(err) return console.error(err);
		res.send(kitty.name + " has just been created!"); 
	});
});

module.exports = router;