function fetchAndRenderShow(prid, hashtag, startTime, endTime) {
  var params = {
    prid: prid,
    hashtag: hashtag,
    startTime: startTime,
    endTime: endTime
  };
  $.get('/getShow', params, function (data) {
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
      return $(
        '<option ' +
          'data-hashtag="'+ v._source.twitter_hashtag +'" ' +
          'data-start="'+ v._source.published_start_time +'" ' +
          'data-end="'+ v._source.published_end_time +'" ' +
          'value="' + v._source.prid +'">' +
          v._source.title + ' ' +
          v._source.published_start_time +
        '</option>');
    });

    $('#pick-show').html(options);
  });
}

$("#pick-show").on('change', function(ev) {
  var selected = $("option:selected", ev.target);
  fetchAndRenderShow(
    selected.attr("value"),
    selected.attr("data-hashtag"),
    selected.attr("data-start"),
    selected.attr("data-end")
  );
});

$(document).ready(function () {
  fetchAndRenderShows();
});