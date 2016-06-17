function refresh_rank()
{
  // to reset the ranks when we are done
  // sorting

  // for each item in the list
  $("#tutorial-list tr").each(function() {
      // get the rank number
      rank = $(this).parent().children().index($(this)) + 1;

      // modify the content to reflect the number
      $(this).find('[scope=row]').html(rank);
  });
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
});
