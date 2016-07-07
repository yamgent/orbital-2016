function add_timetable_ranklabel()
{
  $(".table tbody tr").each(function() {
    $("#timetable .period#" + $(this).attr("tutorialid")).prepend(
      $("<span/>")
      .addClass("label label-pill label-primary")
      .html($(this).find("th").html())
    );
  });
}

$(document).ready(function()
{
    // do this on finish loading
    add_timetable_ranklabel();
});