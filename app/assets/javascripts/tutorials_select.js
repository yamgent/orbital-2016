$(document).ready(function()
{
  // enable toggling after page has loaded
  // so that $(".card").data("periodId") is set
  $(".card").click(function() 
  {
    // this will also update the hidden field
    // called "preferences" for submission later
    var preferences = $("#preference_changes").val();
    if ($(this).data("isPreferenceChanged") == 1) 
    {
      $(this).data("isPreferenceChanged", 0);
      preferences = preferences.replace("_" + $(this).attr('id') + "_", "_");
    } 
    else 
    {
      $(this).data("isPreferenceChanged", 1);
      preferences = preferences.concat($(this).attr('id') + "_");
    }
    $("#preference_changes").val(preferences);
    
    // toggle visual elements
    $(this).toggleClass("card-inverse card-success", 100);
    Timetable().toggleShowPeriodById($(this).attr('id'));
  });
});