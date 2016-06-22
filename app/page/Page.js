var cheerio = require('cheerio');
var fs = require('fs');
var _  = require('lodash');
var xpath = require('xpath');
var dom  = require('xmldom').DOMParser;

//vars for testjson and cheerio
var $;
var json = [];


//Functions called for page modification before load.
var addPageScripts = function(next) {
  $('body').append('HELLO!');
  if ($('head link[href="' + '/assets/style.css' + '"]').length > 0) {
      console.log('custom stylesheet already added');
  } else {
      $('head').append('<link rel="stylesheet" href="/assets/style.css">');
      console.log('appended stylesheets');
  }
  if ($('head script[src="' + '//cdn.ckeditor.com/4.5.9/standard/ckeditor.js' + '"]').length > 0) {
      console.log('CKEditor CDN already added!');
  } else {
      $('head').append('<script src="//cdn.ckeditor.com/4.5.9/standard/ckeditor.js"></script>');
      console.log('appended CKEditor');
  }
  if ($('body script[src="' + 'https://code.jquery.com/jquery-1.12.4.min.js' + '"]').length > 0) {
      console.log('jquery already added!');
  } else {
      $('body').append('<script src="https://code.jquery.com/jquery-1.12.4.min.js"   integrity="sha256-ZosEbRLbNQzLpnKIkEdrPv7lOy9C27hHQ+Xp8a4MxAQ=" crossorigin="anonymous"></script>');
      console.log('appended jquery');
  }
  if( $('body script[src="' + 'https://cdn.jsdelivr.net/lodash/4.13.1/lodash.min.js' + '"]').length > 0){
    console.log('lodash already added!');
  } else{
    $('body').append('<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.min.js"></script>');
    console.log('appended lodash');
  }

  if ($('body script[src="' + '/scripts/page/pageController.js' + '"]').length > 0) {
      console.log('Editor.js already added!');
  } else {
      $('body').append('<script src="/scripts/page/pageController.js"></script>');
      console.log('appended scripts');
      $('body').append('<script> pageControllerModule.init(); </script>');
      console.log('appended pageControllerInit');
  }
};


var getXPath = function(element) {
  var xpath = '';
  //  loop walks up dom tree for all nodes
  for (; element && element.nodeType == 1; element = element.parentNode) {
      // gets the element node index for each element
      var id = $(element.parentNode).children(element.tagName).index(element) + 1;
      // if greateer than one puts in brackets
      id > 1 ? (id = '[' + id + ']') : (id = '');
      // prepends to the element tagname and id to the xpath
      xpath = '/' + element.tagName.toLowerCase() + id + xpath;
  }
  return xpath;
};

//add xpath data-category to selected elements.
var addTextClasses = function(){
  var $pageText = $('p');
  _.uniq($pageText);
  $pageText.each(function(index, element) {
      if ($(this).text().length > 1) {
          var xPath = getXPath(element);
          $(this).addClass('text--edit');
          $(this).attr('data-category', xPath);
      }
  });
};

//for testing getXPath and getting element by xpath
var writeTestJson = function() {
  var xml = $.xml();
  var doc = new dom().parseFromString(xml);
  var $pageText = $('p');
  _.uniq($pageText);
  //  store xpath in array
  $pageText.each(function(index, element) {
      if ($(this).text().length > 1) {
          var xPath = getXPath(element);
          var xPathText = xpath.select(xPath, doc)[0].toString();
          json.push({
              ptext: $(this).text(),
              xpath: xPath,
              elementByXpath: xPathText
          });
      }
  });
};


//functions called in pageInit. Next is passed through three functions.
var loadPageFirst = function(pageFile , callback, next) {
  fs.readFile(pageFile , function(err, data){
    $ = cheerio.load(data);
    callback(next);
  });
  console.log('inside loadPage');
};

var writeAll = function(next){
  addPageScripts();
  writeTestJson();
  // addTextClasses();
  writePageFile('./views/omsi-mission.ejs', 'output.json', next);
};

var writePageFile = function(pageFile, jsonFile, next) {
  fs.writeFile(pageFile, $.html(), function(){
    fs.writeFile(jsonFile, JSON.stringify(json, null, 4), function(){
      next();
    });
  });
};

//page init middleware to handle async file writing before page render. Passes next to last function called
 var pageInit = function(request, response, next){
  loadPageFirst('./views/omsi-mission-backup.ejs', writeAll, next);
}


module.exports = {
  pageInit: pageInit
};
