function getShowClashToggle()
{
  return (Cookies.get('showclash-toggle') == "true");
}

function setShowClashToggle(newValue)
{
  Cookies.set('showclash-toggle', newValue);
}

// if it is not defined before, the default should be true (= show)
function initDefault_ShowClashToggle()
{
  // null means this cookie is never set before
  if (Cookies.get('showclash-toggle') == null)
  {
    setShowClashToggle(true);
  }
}

// allow user to hide clashes
function updateShowClashVisibility()
{
  var show_clashes = getShowClashToggle();

  if (show_clashes)
  {
    $(".card.disabled").stop(true, true).show("fast");
  }
  else
  {
    $(".card.disabled").stop(true, true).hide("fast");
  }
}

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

    // After initializing clashes, check whether to show
    // if it is not defined before, the default should be true (= show)
    initDefault_ShowClashToggle();

    // update the checkbox to reflect cookie settings
    $("#showclash-toggle").prop( "checked", getShowClashToggle());
    updateShowClashVisibility();
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

  $("#showclash-toggle").on("change", function() 
  {
    var isChecked = $("#showclash-toggle").is(":checked");

    // make our settings permanent across the different views
    // with the help of the cookies
    setShowClashToggle(isChecked);
    updateShowClashVisibility();
  });

  $(".back-to-top").on("click", function(e) 
  {
    e.preventDefault();
    $(this).blur();
    $("html, body").stop(true, true).animate({scrollTop: 0}, 200);
  });
});