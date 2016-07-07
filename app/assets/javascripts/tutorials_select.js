$(document).ready(function()
{
  // nested ready() will enforce this to be called last
  jQuery(document).ready(function(){
    // get clashes id and disable the cards
    var clashIds = Timetable().getLectureClashIds();
    for(i = 0; i < clashIds.length; i++)
    {
      $(".card[tutorialid="+ clashIds[i] +"]").addClass("disabled", 0);
    }
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

      if ($(this).data("selected") == 1)
        $(this).data("selected", 0);
      else
        $(this).data("selected", 1);

      // toggle visual elements
      $(this).stop(true, true).toggleClass("selected", 200);
      Timetable().togglePeriodStyle($(this).attr("tutorialid"), "selected", 200);
    },

    mouseenter : function() {
      Timetable().showPeriod($(this).attr("tutorialid"));
      Timetable().addPeriodStyle($(this).attr("tutorialid"), "highlight", 200);
    },
    
    mouseleave : function() {
      if ($(this).data("selected") != 1)
        Timetable().hidePeriod($(this).attr("tutorialid"));
      Timetable().removePeriodStyle($(this).attr("tutorialid"), "highlight", 200);
    }
  });
  

  $("#clash-checkbox").on("change", function() 
  {
    // hide clashing options
    $(".card.disabled").toggleClass("hidden", 0);
  });
});