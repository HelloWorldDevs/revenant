(function(){
  var pageController = {};

  pageController.editButton = function() {
    var editButton = $('<div class="btn--edit">Edit</div>');
    $('.text--edit').append(editButton);
    $('.btn--edit').hide();
    $('.text--edit').on('mouseover', function(){
      console.log("edit?");
      $(this).find('.btn--edit').fadeIn();
    })
    .on('mouseleave', function(){
      $(this).find('.btn--edit').fadeOut();
    })
  }

  pageController.edit = function() {
    $('.text--edit').on('click' , function(){
      var text = $(this).text();
      var dataCategory = $(this).attr('data-category');
      var editorTextarea = $('<textarea name="'+ dataCategory +'" id="editor1" rows="10" cols="80">' + text + '</textarea>');
      $(this).after(editorTextarea);
      $(this).remove();
      CKEDITOR.replace(dataCategory);
    });
  };



  pageController.init = function(){
    pageController.edit();
    pageController.editButton();
  };

  pageController.init();

})()
