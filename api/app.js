const express = require('express');
const path = require('path');
var indexRouter = require('./routes/index');
var testAPIRouter = require('./routes/testAPI'); 

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'jade');
//route separation
app.use('/', indexRouter);
app.use('/testAPI', testAPIRouter); 

const port = process.env.PORT || 9000;
app.listen(port);

console.log(`listening on ${port}`);
