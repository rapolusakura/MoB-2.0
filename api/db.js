const mongoose = require('mongoose');
mongoose.connect("mongodb+srv://srapolu:mailOnBike2019%21@mailonbike-ddwms.mongodb.net/test?retryWrites=true&w=majority", {useNewUrlParser: true});

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  // we're connected!
  console.log("worked!"); 
});

module.exports = mongoose; 