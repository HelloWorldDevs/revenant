var express  = require('express');
var app      = express();
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');

// var MongoClient = mongodb.MongoClient;
// var mongodb = require('mongodb');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');

var configDB = require('./config/database.js');

mongoose.connect(configDB.url , function (error) {
  if (error){
    console.log(error);
  } else {
   console.log('Connected to Mongo');
  }
});

// require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.set('view engine', 'ejs');
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));

app.use(passport.initialize());
app.use(passport.session());

require('./app/routes.js')(app, passport);

app.listen(port);
console.log('The magic happens on port ' + port);
