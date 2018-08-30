//Overrides the user command submit to refresh page
$(document).ready(function() {
  $('#command').submit(function(e){
    if ($("#userCom").val() == "") {
      e.preventDefault();
    }
    else {
      e.preventDefault();
      command($("#userCom").val());
    };
  $(document).scrollTop($(document).height()); //scroll to bottom
  $('#command').trigger("reset"); //Resets the text box
  });
});