$(document).ready(function()
{
  // enable toggling after page has loaded
  // so that $(".card").data("periodId") is set
  $(".card").click(function() {

    // this will also update the hidden field
    // called "preferences" for submission later
    var preferences = $("#preferences").val();

    if ($(this).hasClass("card-success")) {
      TimetablePreview().hidePeriodById($(this).data("periodId"));
      preferences = preferences.replace($(this).data("periodId") + "_", "");
    } else {
      TimetablePreview().showPeriodById($(this).data("periodId"));
      preferences = preferences.concat($(this).data("periodId") + "_");
    }

    // update the hidden field
    $("#preferences").val(preferences);
    
    $(this).toggleClass("card-inverse card-success", 200);
  });
});