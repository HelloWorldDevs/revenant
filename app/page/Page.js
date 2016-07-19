//Server script using url and npm modules for loading content and appending scripts to page. Currently writes as .ejs for serving.
var cheerio = require('cheerio');
var fs = require('fs');
var _  = require('lodash');
var xpath = require('xpath');
var dom  = require('xmldom').DOMParser;
var rp = require('request-promise');


//vars for testjson and cheerio
var $;
var json = [];

var fetchPage = function(){

  var options = {
    uri: 'http://www.omsi.edu/history-and-mission',
    transform: function (body) {
        return cheerio.load(body);
    }
  };

  rp(options).then(function(response){
    fs.writeFile('./views/omsi-mission-backup.ejs', response.html(), function(){
      fs.readFile('./views/omsi-mission-backup.ejs' , function(err, data){
        $ = cheerio.load(data);
        addPageScripts();
        fs.writeFile('./views/omsi-mission.ejs', $.html());
      });
    })
  })
}

//Functions called for appending scripts before load.
var addPageScripts = function() {
  if ($('head link[href="' + '/assets/style.css' + '"]').length > 0) {
      console.log('custom stylesheet already added');
  } else {
      $('head').append('<link rel="stylesheet" href="/assets/style.css">');
      console.log('appended stylesheets');
  }
  if ($('head script[src="' + '//cdn.ckeditor.com/4.5.10/standard/ckeditor.js' + '"]').length > 0) {
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
  // if( $('body script[src="' + 'https://cdn.jsdelivr.net/lodash/4.13.1/lodash.min.js' + '"]').length > 0){
  //   console.log('lodash already added!');
  // } else{
  //   $('body').append('<script src="https://cdn.jsdelivr.net/lodash/4.13.1/lodash.min.js"></script>');
  //   console.log('appended lodash');
  // }
  if ($('body script[src="' + '/scripts/page/pageData.js' + '"]').length > 0) {
      console.log('pageData.js already added!');
  } else {
      $('body').append('<script src="/scripts/page/pageData.js"></script>');
      console.log('appended script pageData.js');
      $('body').append('<script> pageDataModule.init(); </script>');
      console.log('appended pageData.js');
  }
  if ($('body script[src="' + '/scripts/page/pageController.js' + '"]').length > 0) {
      console.log('Editor.js already added!');
  } else {
      $('body').append('<script src="/scripts/page/pageEdit.js"></script>');
      console.log('appended script pageEdit.js');
      $('body').append('<script> pageEditModule.init(); </script>');
      console.log('appended pageEditInit');
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

//Testing xpath data-category to selected elements.
// var addTextClasses = function(){
//   var $pageText = $('p');
//   _.uniq($pageText);
//   $pageText.each(function(index, element) {
//       if ($(this).text().length > 1) {
//           var xPath = getXPath(element);
//           $(this).addClass('text--edit');
//           $(this).attr('data-category', xPath);
//       }
//   });
// };

//Testing getXPath and getting element by xpath
// var writeTestJson = function() {
//   var xml = $.xml();
//   var doc = new dom().parseFromString(xml);
//   var $pageText = $('p');
//   _.uniq($pageText);
//   //  store xpath in array
//   $pageText.each(function(index, element) {
//       if ($(this).text().length > 1) {
//           var xPath = getXPath(element);
//           var xPathText = xpath.select(xPath, doc)[0].toString();
//           json.push({
//               ptext: $(this).text(),
//               xpath: xPath,
//               elementByXpath: xPathText
//           });
//       }
//   });
// };


//functions called in pageInit. Next is passed through three functions.
// var loadPageFirst = function(pageFile , callback) {
//   fs.readFile(pageFile , function(err, data){
//     $ = cheerio.load(data);
//     callback();
//   });
//   console.log('inside loadPage');
// };
//
// var writeAll = function(){
//   addPageScripts();
//   writePageFile('./views/omsi-mission.ejs', 'output.json');
// };
//
// var writePageFile = function(pageFile, jsonFile) {
//   fs.writeFile(pageFile, $.html(), function(){
//     fs.writeFile(jsonFile, JSON.stringify(json, null, 4));
//   });
// };
//
// //page init middleware to handle async file writing before page render. Passes next to last function called
//  var pageInit = function(request, response){
//   loadPageFirst('./views/omsi-mission-backup.ejs', writeAll);
// }

module.exports = {
  fetchPage: fetchPage
};
