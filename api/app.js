const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var indexRouter = require('./routes/index');
var testAPIRouter = require('./routes/testAPI'); 

const app = express();

// Serve static files from the React app
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(bodyParser.urlencoded({
  extended: false
}));
app.use(cookieParser());
app.set('view engine', 'jade');
//route separation
app.use('/', indexRouter);
app.use('/testAPI', testAPIRouter); 

const port = process.env.PORT || 9000;
app.listen(port);

console.log(`listening on ${port}`);
