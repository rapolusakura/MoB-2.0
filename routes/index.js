var express = require('express');
var router = express.Router();
var mongoose = require('../db.js').mongoose;
var Cat = require('../models/cat.js'); 

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