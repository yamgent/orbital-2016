$(document).ready(function()
{
  // enable toggling after page has loaded
  // so that $(".card").data("periodId") is set
  $(".card").click(function() {
    if ($(this).hasClass("card-success")) {
      TimetablePreview().hidePeriodById($(this).data("periodId"));
    } else {
      TimetablePreview().showPeriodById($(this).data("periodId"));
    }
    
    $(this).toggleClass("card-inverse card-success", 200);
  });
});