(function(){
  var pageView = {};

  pageView.editorAdd = function(){
    $('.edit-text').on('click' , function(){
      var text = $(this).text();
      var dataCategory = $(this).attr('data-category');
      var editorTextarea = $('<textarea name="'+ dataCategory +'" id="editor1" rows="10" cols="80">' + text + '</textarea>');
      $(this).after(editorTextarea);
      $(this).remove();
      CKEDITOR.replace(dataCategory);
    });
  };

  pageView.init = function(){
    pageView.editorAdd();
  };

return pageView;
})().init();
