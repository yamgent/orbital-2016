function add_timetable_ranklabel()
{
  $("#tutorial-list tr").each(function() {
    $("#timetable .period#" + $(this).attr("tutorialid")).prepend(
      $("<span/>").addClass("label label-pill label-primary")
    );
  });
}

function refresh_rank()
{
  // to reset the ranks when we are done
  // sorting

  // this will also update the hidden field
  // called "preferences" for submission later

  var preferences = "";

  // for each item in the list
  $("#tutorial-list > tbody > tr").each(function() {
      // get the rank number
      rank = $(this).parent().children().index($(this)) + 1;

      // modify the content to reflect the number
      $("#timetable .period#" + $(this).attr("tutorialid") + " .label").html(rank);
      $(this).find('[class=rank_num]').html(rank);

      // get selection_id
      selection_id = $(this).attr("selectionid");

      // append it to the hidden field
      if (selection_id)
        preferences += selection_id + "_";
  });

  // update the hidden field
  $("#preferences").val(preferences);
}

// find row with the given selection_id
function find_row(selection_id)
{
  return $("#tutorial-list tr[selectionid=" + selection_id + "]");
}

// move the selected row up by one
function move_up(selection_id)
{
  // find the corresponding row
  var current_row = find_row(selection_id);
  var row_idx = current_row.parent().children().index(current_row);

  if (row_idx <= 0)
    // can't move up, already the first row!
    return;

  // swap!
  var prev_row = current_row.parent().children().eq(row_idx - 1);
  prev_row.insertAfter(current_row);

  refresh_rank();
}

// move the selected row down by one
function move_down(selection_id)
{
  // find the corresponding row
  var current_row = find_row(selection_id);
  var row_idx = current_row.parent().children().index(current_row);
  var total_rows = current_row.parent().children().length;

  if (row_idx >= total_rows - 1)
    // can't move down, already the last row!
    return;

  // swap!
  var next_row = current_row.parent().children().eq(row_idx + 1);
  current_row.insertAfter(next_row);

  refresh_rank();
}

// only direct child of #tutorial-list is sortable, exclude nested tables
var tutorial_list_sortable_selector = "#tutorial-list > tbody";

function tutorial_rank_windowResized()
{
  var mobile = isMobile();
  $(tutorial_list_sortable_selector).sortable("option", "disabled", mobile);
}

$(document).ready(function()
{
    // do this on finish loading
    // so that we don't have to do the ranking
    // ourselves
    add_timetable_ranklabel();
    refresh_rank();

    // make the list sortable, and refresh the rank
    // numbers after a sort
    $(tutorial_list_sortable_selector).sortable({
      stop: function() {
        refresh_rank();
      }
    });

    // add functionality to the move-up / move-down
    // buttons so that mobile users can just press
    // up / down instead of having to drag
    $("#tutorial-list tr .move-up").each(function() {
      var selectionid = $(this).parent().parent().attr("selectionid");
      $(this).click(function() {
        move_up(selectionid);
      });
    });
    $("#tutorial-list tr .move-down").each(function() {
      var selectionid = $(this).parent().parent().attr("selectionid");
      $(this).click(function() {
        move_down(selectionid);
      });
    });

    // Only triggers direct child, exclude nested table rows
    $("#tutorial-list > tbody > tr").on({
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

    windowResized();
    $(window).resize(function() {
      tutorial_rank_windowResized();
    });

    // completely broken, sometimes message will
    // appear, sometime it doesn't. :(
    /*
    $(window).on('beforeunload', function(){
      if (changesConfirmed == false)
        // custom messages no longer work. however,
        // we still have to return non-null so that
        // the browser will ask the user before leaving
        return 'You have not confirm your rank selection!';
      else {
        return null;
      }
    });
    */
});
