var express = require('express');
var router = express.Router();
var db = require('./db.js')

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
	const Cat = db.mongoose.model('Cat', { name: String });
	const kitty = new Cat({ name: 'Zildjian' });
	kitty.save().then(() => console.log('meow'));

}); 

module.exports = router;