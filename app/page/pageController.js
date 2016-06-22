var pageControllerModule = (function(){

  var pageController = {};

  pageController.editButton = function() {
    var editButton = $('<div class="btn--edit"><p>Edit<p></div>');
    $('.text--edit').append(editButton);
    $('.btn--edit').hide();
    $('.text--edit').on('mouseover', function(){
      console.log($(this).attr('data-category'));
      console.log(pageController.getElementByXpath($(this).attr('data-category')));
      $(this).find('.btn--edit').fadeIn();
    })
    .on('mouseleave', function(){
      $(this).find('.btn--edit').fadeOut();
    });
  }

  pageController.edit = function() {
    $('.btn--edit').on('click', function(){
      var $textEdit = $(this).parent('.text--edit');
      var text =  $textEdit.text();
      var dataCategory = $textEdit.attr('data-category');
      var editorTextarea = $('<form><textarea name="'+ dataCategory +'" id="editor1" rows="10" cols="80"></form>' + text + '</textarea>');
      $textEdit.after(editorTextarea);
      $textEdit.remove();
      CKEDITOR.replace(dataCategory , {
        bodyId : dataCategory
      });
    });
  };

  pageController.getXPath = function(element) {
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


  pageController.getElementByXpath = function(path) {
    return document.evaluate(path, document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
  };

  pageController.addTextClasses = function(){
    var $pageText = $('p');
    var $pageHeaders = $(':header');
    // _.uniq($pageText);
    $pageText.each(function(index, element) {
        if ($(this).text().length > 1) {
            var xPath = pageController.getXPath(element);
            $(this).addClass('text--edit');
            $(this).attr('data-category', xPath);
        }
    });
    $pageHeaders.each(function(index, element) {
        if ($(this).text().length > 1) {
            var xPath = pageController.getXPath(element);
            $(this).addClass('text--edit');
            $(this).attr('data-category', xPath);
        }
    });
  };

  pageController.init = function(){
    pageController.addTextClasses();
    pageController.editButton();
    pageController.edit();
  };

  return {
    init : pageController.init
  }

})();
