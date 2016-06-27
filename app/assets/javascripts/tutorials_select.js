$(document).ready(function()
{
  // nested ready() will enforce this to be called last
  jQuery(document).ready(function(){
    // get clashes id and disable the cards
    $(".period.lecture-clash").each(function() {
      var id = $(this).attr("id");
      $(".card[tutorialid="+ id +"]").addClass("disabled");
    });
  });

  $(".card").on({
    click : function() 
    {
      if ($(this).hasClass("disabled"))
        return;

      // this will also update the hidden field
      // called "preferences" for submission later
      var preferences = $("#preference_changes").val();
      if ($(this).data("isPreferenceChanged") == 1) 
      {
        $(this).data("isPreferenceChanged", 0);
        preferences = preferences.replace("_" + $(this).attr("tutorialid") + "_", "_");
      } 
      else 
      {
        $(this).data("isPreferenceChanged", 1);
        preferences = preferences.concat($(this).attr('tutorialid') + "_");
      }
      $("#preference_changes").val(preferences);
      
      // toggle visual elements
      $(this).stop(true, true).toggleClass("selected", 200);
      Timetable().togglePeriodStyle($(this).attr("tutorialid"), "selected", 200);
    },

    mouseenter : function() {
      Timetable().togglePeriodStyle($(this).attr("tutorialid"), "highlight", 200);
    },
    
    mouseleave : function() {
      Timetable().togglePeriodStyle($(this).attr("tutorialid"), "highlight", 200);
    }
  });

  $("#clash-checkbox").on("change", function() {
    Timetable().toggleShowLectureClashes();
  });
});