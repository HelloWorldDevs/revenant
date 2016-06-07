module.exports = function(app, request, cheerio, fs, _, xpath, dom) {

  var Page = {};
  var $;
  var json;

  Page.loadPage = function(pageFile){
    $ = cheerio.load(fs.readFileSync(pageFile));
  };

  Page.addScripts = function(){
    // console.log($.html());
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
    if ($('body script[src="' + '/scripts/pageController/pageView.js' + '"]').length > 0) {
      console.log('Editor.js already added!');
    } else {
      $('body').append('<script src="/scripts/pageController/pageView.js"></script>');
      console.log('appended scripts');
    }
  };

  Page.getXPath = function(element){
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

  Page.writeJson = function(){
    var xml = $.xml();
    var doc = new dom().parseFromString(xml);

    //  grab page text and use lodash uniq filter to eliminate duplicates
    var $pageText = $('p');
    _.uniq($pageText);

    //  store xpath in array
    var json = [];
    $pageText.each(function(index, element) {
      if ($(this).text().length > 1){
        var xPath = Page.getXPath(element);
        var xPathText = xpath.select(xPath, doc)[0].toString();
        json.push({
            ptext: $(this).text(),
            xpath: xPath,
            elementByXpath : xPathText
        });
        $(this).addClass('edit-text');
        $(this).attr('data-category', xPath);
      }
    });
  };

  Page.writeToPage = function(pageFile, jsonFile){
    fs.writeFileSync(pageFile, $.html());
    fs.writeFileSync(jsonFile, JSON.stringify(json, null, 4));
  };

  return Page;
};
