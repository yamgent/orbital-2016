function refresh_rank()
{
  // to reset the ranks when we are done
  // sorting

  // this will also update the hidden field
  // called "preferences" for submission later

  var preferences = "";

  // for each item in the list
  $("#tutorial-list tr").each(function() {
      // get the rank number
      rank = $(this).parent().children().index($(this)) + 1;
      // modify the content to reflect the number
      $(this).find('[scope=row]').html(rank);

      // get selection_id
      selection_id = $(this).attr("selectionid");

      // append it to the hidden field
      if (selection_id)
        preferences += selection_id + "_";
  });

  // update the hidden field
  $("#preferences").val(preferences);
}

$(document).ready(function()
{
    // do this on finish loading
    // so that we don't have to do the ranking
    // ourselves
    refresh_rank();

    // make the list sortable, and refresh the rank
    // numbers after a sort
    $("#tutorial-list tbody").sortable({stop: function() {
      refresh_rank();
    }});

    $("#tutorial-list tbody tr").on({
      mouseenter : function() {
        Timetable().togglePeriodStyle($(this).attr("tutorialid"), "highlight", 200);
      },
      mouseleave : function() {
        Timetable().togglePeriodStyle($(this).attr("tutorialid"), "highlight", 200);
      }
    });

    var changesConfirmed = false;

    $("#save").click(function(){
      changesConfirmed = true;
    });

    $(window).bind('beforeunload', function(){
      if (changesConfirmed === false)
        // TODO: custom message doesn't work on Chrome??
        return 'You have not confirm your rank selection!';
    });
});
