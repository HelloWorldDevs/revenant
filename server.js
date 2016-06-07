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
var cheerio     = require('cheerio');
var _           = require('lodash');
var xpath       = require('xpath');
var dom         = require('xmldom').DOMParser;



var configDB = require('./config/database.js');




mongoose.connect(configDB.url , function (error) {
  if (error){
    console.log(error);
  } else {
   console.log('Connected to Mongo');
  }
});

require('./config/passport')(passport); // pass passport for configuration

app.use(morgan('dev'));
app.use(cookieParser());
app.use(bodyParser());

app.use('/assets', express.static(__dirname + '/public'));
app.use('/scripts', express.static(__dirname + '/app'));

app.set('view engine', 'ejs');
app.use(session({ secret: 'ilovescotchscotchyscotchscotch' }));

app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

var Page = require('./app/pageController/Page')(app, request, cheerio, fs, _, xpath, dom);
require('./app/routes.js')(app, passport, Page);

app.listen(port);
console.log('The magic happens on port ' + port);
