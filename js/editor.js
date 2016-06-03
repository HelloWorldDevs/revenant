$('.edit-text').on('click' , function(){
  var text = $(this).text();
  var editorTextarea = $('<form><textarea name="editor1" id="editor1" rows="10" cols="80"></textarea><form>');
  $(this).after('editorTextarea');
  // $(this).remove();
  CKEDITOR.replace( 'editor1' );
})
