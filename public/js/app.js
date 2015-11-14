function fetchAndRenderShow(showId) {
  $.get('/getShow', { showId: showId }, function (data) {
    console.log(data);
    $('#show-title').text('Activity for ' + data.title);
    $('#show-activity').html(data.activity);
    $('#show-video').attr('src', data.videoUrl);
  });
}

function fetchAndRenderShows () {
  $.get('/getShows', function (data) {
    console.log('items: ' + data.length);

    data.forEach(function(v) {
      console.log(v._source.twitter_hashtag);
    });
  });
}

$("#pick-show").on('change', function(ev) {
  fetchAndRenderShow(ev.target.value);
});

$(document).ready(function () {
  fetchAndRenderShows();
});