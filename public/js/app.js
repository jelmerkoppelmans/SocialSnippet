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

    var options = data.map(function(v) {
      return $('<option ' + 'value="' + v._source.prid + '">' + v._source.title + ' ' + v._source.published_start_time + '</option>');
    });

    $('#pick-show').html(options);
  });
}

$("#pick-show").on('change', function(ev) {
  fetchAndRenderShow(ev.target.value);
});

$(document).ready(function () {
  fetchAndRenderShows();
});