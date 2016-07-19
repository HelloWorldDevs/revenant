var pageEditModule = (function(){
  console.log('edit init!')
  var pageEdit = {};


  pageEdit.getText = function($element){
    return $element
    .clone()	//clone the element
    .children()	//select all the children
    .remove()	//remove all the children
    .end()	//again go back to selected element
    .text();	//get the html of element
  }


  // pageEdit.editButton = function() {
  //   var editButton = $('<div class="btn--edit"></div>');
  //   $('.text--edit').append(editButton);
  //   $('.btn--edit').hide();
  //   $('.text--edit').on('mouseover', function(){
  //     console.log($(this).find('.btn--edit'))
  //     $(this).find('.btn--edit').fadeIn();
  //   })
  //   .on('mouseleave', function(){
  //     $(this).find('.btn--edit').fadeOut();
  //   });
  // }

  // CKEDITOR.plugins.addExternal('save', '/ckeditor/save/', 'plugin.js' );
  CKEDITOR.plugins.addExternal('inlinesave', '/ckeditor/inlinesave/', 'plugin.js' );
  CKEDITOR.disableAutoInline = true;
  CKEDITOR.config.inlinesave = {
  postUrl: '/dataUpdate',
  postData: {test: true},
  onSave: function(editor){
    return true;
  },
  onSuccess: function(editor, data) { console.log('save successful', editor, data); },
  onFailure: function(editor, status, request) { console.log('save failed', editor, status, request); },
  useJSON: true,
  useColorIcon: false
};
  // CKEDITOR.plugins.addExternal('autogrow', '/ckeditor/autogrow/', 'plugin.js' );
  // CKEDITOR.config.autoGrow_onStartup = true;
  //
  // CKEDITOR.config.startupFocus = true;
  // CKEDITOR.config.onSave = function(){
  //   console.log('save?')
  // };

  pageEdit.edit = function() {
    $('.text--edit').on('click', function(){
      var dataCategory = $(this).attr('data-category');
      var el = document.querySelector('[data-category="'+ dataCategory +'"');
      el.setAttribute('id', dataCategory);
      CKEDITOR.inline(el, {
        bodyId: dataCategory,
        extraPlugins : 'inlinesave'
      });
    });

    // $('.btn--edit').on('click', function(){
    //   var $textEdit = $(this).parent('.text--edit');
    //   var text =  pageEdit.getHTML($textEdit);
    //   console.log(text);
    //   var dataCategory = $textEdit.attr('data-category');
    //   var editorTextarea = $('<form><textarea name="'+ dataCategory +'"></form>' + text + '</textarea>');
    //   $textEdit.after(editorTextarea);
    //   $textEdit.remove();
    //   CKEDITOR.replace(dataCategory , {
    //     extraPlugins : 'save,autogrow',
    //     bodyId : dataCategory
    //     // autoGrow_onStartup = true
    //   });
    // });
  };

  pageEdit.addEditClass = function(){
    var body = document.getElementsByTagName('body')[0];
    function recurse(element){
      if (element.childNodes.length > 0){
          for (var i = 0; i < element.childNodes.length; i++)
              recurse(element.childNodes[i]);
      }
      if (element.nodeType == Node.TEXT_NODE && element.nodeValue.trim() != '' && element.parentNode.nodeName != 'SCRIPT' && element.parentNode.nodeName != 'NOSCRIPT'){
        var completePath = pageDataModule.getCompletePath(element);
        element.parentNode.className += ' text--edit';
        element.parentNode.setAttribute('data-category', completePath);
        element.parentNode.setAttribute('contenteditable','true');

        if(element.parentNode.nodeName === 'A'){
          element.parentNode.onclick = function(e){
            e.preventDefault();
          }
        }
      }
    }
    recurse(body);
  };

  pageEdit.sendData = function(){
    // console.log($('.text--edit'));
    // $('.btn--edit').on('click', function(){
    //   var $element = $(this).parent('.text--edit');
    //   console.log(pageEdit.getText($element));
    // });

    //
    // $.ajax({
    //   type: 'update'
    //   url: '/data'
    // })
}

  pageEdit.init = function(){
    pageEdit.addEditClass();
    // pageEdit.editButton();
    pageEdit.edit();
    pageEdit.sendData();
  };

  return {
    init : pageEdit.init
  }

})();
