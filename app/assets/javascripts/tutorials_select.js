$(document).ready(function()
{
  // enable toggling after page has loaded
  // so that $(".card").data("periodId") is set
  $(".card").click(function() {

    // this will also update the hidden field
    // called "preferences" for submission later
    var preferences = $("#preferences_select").val();

    if ($(this).data("selected") == 1) {
      $(this).data("selected", 0);
      TimetablePreview().hidePeriodById($(this).data("periodId"));
      preferences = preferences.replace("_" + $(this).data("periodId") + "_", "_");
    } else {
      $(this).data("selected", 1);
      TimetablePreview().showPeriodById($(this).data("periodId"));
      preferences = preferences.concat($(this).data("periodId") + "_");
    }

    // update the hidden field
    $("#preferences_select").val(preferences);
    
    $(this).toggleClass("card-inverse card-success", 200);
  });
});