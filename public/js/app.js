function fetchAndRenderShow(showId) {
  $.get('/getShow', { showId: showId }, function (data) {
    console.log(data);
    $('#show-title').text('Activity for ' + data.title);
    $('#show-activity').html(data.activity);
    $('#show-video').attr('src', data.videoUrl);
  });
}

$("#pick-show").on('change', function(ev) {
  fetchAndRenderShow(ev.target.value);
});