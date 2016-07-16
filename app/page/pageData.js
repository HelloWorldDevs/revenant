var pageDataModule = (function(){

  var pageData = {};
  pageData.all = []

  pageData.getXPath = function(element) {
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

  pageData.getCompletePath = function(e){
      var url = window.location.href;
      var xpath = pageData.getXPath(e.parentNode);
      var title = encodeURIComponent(document.title.trim());
      var completePath = url + ']][[' + xpath + ']][[' + title;
      return completePath;
  }

  pageData.getText = function(e){
    var text = e.parentNode.textContent;
    return text;
  };

  pageData.getElementByXpath = function(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };

  pageData.writeToJson = function(data){
    // var json = JSON.stringify(data);
    console.log(data);
    $.ajax({
      type: 'POST',
      url : '/data',
      contentType : 'application/json',
      data: JSON.stringify(data)
    }).then(function(data , error){
      if(error){
        console.log(error);
      }
    })
  }

  pageData.writePageData = function(){
    var body = document.getElementsByTagName('body')[0];

    function recurse(element){
      if (element.childNodes.length > 0){
          for (var i = 0; i < element.childNodes.length; i++)
              recurse(element.childNodes[i]);
      }
      if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() != '' && element.parentNode.nodeName != 'SCRIPT' && element.parentNode.nodeName != 'NOSCRIPT'){
          var completePath = pageData.getCompletePath(element)
          var oldText = pageData.getText(element)
          pageData.all.push({
            completePath : completePath,
            oldText : oldText
          })
      }
    }
    recurse(body);
    pageData.writeToJson(pageData.all);
  };

  pageData.init = function(){
    pageData.writePageData();
  };

  return {
    getXPath : pageData.getXPath,
    init : pageData.init
  }
})();
