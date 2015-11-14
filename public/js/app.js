function fetchAndRenderShow(prid, hashtag, startTime, endTime) {
  var params = {
    prid: prid,
    hashtag: hashtag,
    startTime: startTime,
    endTime: endTime
  };
  $.get('/getShow', params, function (data) {
    $('#show-activity').html(data.activity);
    $('#show-video').attr('src', data.videoUrl);

    $("#show").show();
    $("#loader").hide();
  });
}

function fetchAndRenderShows () {
  $.get('/getShows', function (data) {
    var options = data.sort(function(a, b) {
      if (a._source.title < b._source.title) {
        return -1;
      }
      if (a._source.title > b._source.title) {
        return 1;
      }
      return 0;

    }).map(function(v) {
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
  $("#show").hide();
  $("#loader").show();

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