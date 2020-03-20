require('dotenv').config();

const mongoose = require('mongoose');
mongoose.connect(process.env.DB_CONNECT, {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("worked!"); 
});

module.exports = mongoose; 