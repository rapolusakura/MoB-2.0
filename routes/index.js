var express = require('express');
var router = express.Router();

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


module.exports = router;