var pageEditModule = (function(){
  console.log('edit init!')
  var pageEdit = {};

  pageEdit.editButton = function() {
    var editButton = $('<div class="btn--edit"><p>Edit<p></div>');
    $('.text--edit').append(editButton);
    $('.btn--edit').hide();
    $('.text--edit').on('mouseover', function(){
      // console.log($(this).attr('data-category'));
      // console.log(pageController.getElementByXpath($(this).attr('data-category')));
      $(this).find('.btn--edit').fadeIn();
    })
    .on('mouseleave', function(){
      $(this).find('.btn--edit').fadeOut();
    });
  }

  pageEdit.edit = function() {
    $('.btn--edit').on('click', function(){
      var $textEdit = $(this).parent('.text--edit');
      var text =  $textEdit.text();
      var dataCategory = $textEdit.attr('data-category');
      var editorTextarea = $('<form><textarea name="'+ dataCategory +'" id="editor1" rows="10" cols="80"></form>' + text + '</textarea>');
      $textEdit.after(editorTextarea);
      $textEdit.remove();
      CKEDITOR.replace(dataCategory , {
        bodyId : dataCategory,
        // extraPlugins : 'autogrow'
        // autoGrow_minHeight : 250,
        // autoGrow_maxHeight : 600
      });
    });
  };


  pageEdit.addEditClass = function(){
    var body = document.getElementsByTagName('body')[0];

    function recurse(element){
      if (element.childNodes.length > 0){
          for (var i = 0; i < element.childNodes.length; i++)
              recurse(element.childNodes[i]);
      }
      if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() != '' && element.parentNode.nodeName != 'SCRIPT' && element.parentNode.nodeName != 'NOSCRIPT'){
        var xPath = pageDataModule.getXPath(element.parentNode);
        console.log(xPath)
        element.parentNode.classname += 'text--edit';
        element.parentNode.setAttribute('data-category', xPath);
      }
    }
    recurse(body);
    // var $pageText = $('p');
    // var $pageHeaders = $(':header');
    // // _.uniq($pageText);
    // $pageText.each(function(index, element) {
    //     if ($(this).text().length > 1) {
    //
    //         // pageController.writeToJson(xPath , $(this).text());
    //     }
    // });
    // $pageHeaders.each(function(index, element) {
    //     if ($(this).text().length > 1) {
    //         var xPath = pageController.getXPath(element);
    //         $(this).addClass('text--edit');
    //         $(this).attr('data-category', xPath);
    //         // pageController.writeToJson(xPath , $(this).text());
    //     }
    // });
  };

  pageEdit.init = function(){
    pageEdit.addEditClass();
    pageEdit.editButton();
    pageEdit.edit();
  };

  return {
    init : pageEdit.init
  }

})();
