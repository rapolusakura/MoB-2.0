const CronJob = require('cron').CronJob;
const fetch = require("node-fetch");
const AvailableBikers = require('./models/AvailableBikers')
var db = require('./db.js'); 


shiftAvailableList = () => {
  AvailableBikers.find({}, function(err, record) {
  if (err) {
      console.log(err);
  } else {
      let availableToday = record[0].availableToday; 
      let availableTomorrow = record[0].availableTomorrow; 
      AvailableBikers.updateOne({"tag":1}, {$set: {"availableToday": availableTomorrow, "availableTomorrow": []}}, function(err, success) {
        if(err) {console.log(err)} 
          else {console.log("succesfully shifted lists")}
      })
  }  
})
}

// notifyBikers = () => {
// fetch("http://localhost:9000/notifyBikers")
// }

//00 02 17 * * 1-5
//the above will execute every 5:02 pm from Mon-Fri, what we want is sunday - thursday?? 
console.log('Before job instantiation');

const job = new CronJob('*/15 * * * * *', function() {
shiftAvailableList(); 
// notifyBikers(); 
console.log("this happened just now oh my gosh!"); 
}, 'America/Lima');
console.log('After job instantiation');

job.start();
