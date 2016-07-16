var express  = require('express');
var app      = express();
var fs       = require('fs');
var port     = process.env.PORT || 8080;
var mongoose = require('mongoose');
var passport = require('passport');

// var MongoClient = mongodb.MongoClient;
// var mongodb = require('mongodb');

var morgan       = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser   = require('body-parser');
var session      = require('express-session');
var flash       = require('connect-flash');
var request     = require('request');


var configDB = require('./config/database.js');

// My exports
var page = require('./app/page/page');
var myRoutes = require('./app/routes.js');
var myPassport = require('./config/passport');


mongoose.connect(configDB.url , function (error) {
  if (error){
    console.log(error);
  } else {
   console.log('Connected to Mongo');
  }
});


myPassport(passport); // pass passport for configuration

app.use(morgan('dev'));
app.use(cookieParser());


app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true}));

app.use('/assets', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/app'));
// app.use('/data', express.static(__dirname + '/data'));

app.set('view engine', 'ejs');
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());



myRoutes(app, passport, page, fs);

app.listen(port);
console.log('The magic happens on port ' + port);
