function refresh_rank()
{
  $("#tutorial-list tr").each(function() {
      rank = $(this).parent().children().index($(this)) + 1;
      $(this).find('[scope=row]').html(rank);
  });
}

$(document).ready(function()
{
    // do this on finish loading
    // so that we don't have to do the ranking
    // ourselves
    refresh_rank();

    $("#tutorial-list tbody").sortable({stop: function(){
      refresh_rank();
    }});
});
