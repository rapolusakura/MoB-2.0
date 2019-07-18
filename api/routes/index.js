var express = require('express');
var router = express.Router();
var Order = require('../models/orders.js'); 

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


module.exports = router;