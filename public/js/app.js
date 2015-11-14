function fetchAndRenderShow(prid, hashtag, startTime, endTime) {
  var params = {
    prid: prid,
    hashtag: hashtag,
    startTime: startTime,
    endTime: endTime
  };
  $.get('/getShow', params, function (data) {
    $('#show-activity').html(data.activity.map(function(value) {
      var offset = 30;
      var diff = new Date(value[0]).getTime() - offset - new Date(startTime).getTime();
      var seconds = Math.max(0, Math.abs(diff / 1000));
      return "<li><a href='" + seconds +"'>at " + Math.round(seconds/60) + " minutes</a></li>";
    }));
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
          v._source.title + ' --- ' +
          new Date(v._source.published_start_time).toLocaleString() +
        '</option>');
    });

    $('#pick-show').html(options);
  });
}

$('#show-activity').on('click', 'a', function(ev) {
  var video= $("#show-video")[0];
  video.currentTime = ev.target.getAttribute('href');
  video.play();
  ev.preventDefault();
});

$("#pick-show").on('change', function(ev) {
  $("#show").hide();
  $("#loader").show();
  $("#show-video")[0].pause();

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