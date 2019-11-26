/**
 * Flot chart page
 */
(function($) {
  'use strict';

  var data = [],
    totalPoints = 300,
    updateInterval = 300,
    previousPoint = null,
    plot;

  // Define data points
  var browserData = [{
    label: 'IE',
    data: 15,
    color: $.constants.danger
  }, {
    label: 'Safari',
    data: 14,
    color: $.constants.info
  }, {
    label: 'Chrome',
    data: 34,
    color: $.constants.warning
  }, {
    label: 'Opera',
    data: 13,
    color: $.constants.bodyBg
  }, {
    label: 'Firefox',
    data: 24,
    color: $.constants.dark
  }];

  var getRandomArbitrary = function() {
    return Math.round(Math.random() * 100);
  };

  function showTooltip(x, y, contents) {
    $('<div id=\'tooltip\'>' + contents + '</div>').css({
      top: y - 10,
      left: x + 20
    }).appendTo('body').fadeIn(200);
  }

  var visits = [
    [0, getRandomArbitrary()],
    [1, getRandomArbitrary()],
    [2, getRandomArbitrary()],
    [3, getRandomArbitrary()],
    [4, getRandomArbitrary()],
    [5, getRandomArbitrary()],
    [6, getRandomArbitrary()],
    [7, getRandomArbitrary()],
    [8, getRandomArbitrary()]
  ];
  var visitors = [
    [0, getRandomArbitrary()],
    [1, getRandomArbitrary()],
    [2, getRandomArbitrary()],
    [3, getRandomArbitrary()],
    [4, getRandomArbitrary()],
    [5, getRandomArbitrary()],
    [6, getRandomArbitrary()],
    [7, getRandomArbitrary()],
    [8, getRandomArbitrary()]
  ];

  /******** Line chart ********/
  // var plotdata = [{
    // data: visits,
    // color: $.constants.success
  // }, {
    // data: visitors,
    // color: $.constants.default
  // }];
  // /*jshint -W030 */
  // $.plot($('.line'), plotdata, {
    // series: {
      // lines: {
        // show: true,
        // lineWidth: 0
      // },
      // splines: {
        // show: true,
        // tension: 0.5,
        // lineWidth: 1,
        // fill: 0.2
      // },
      // shadowSize: 0
    // },
    // grid: {
      // color: $.constants.border,
      // borderWidth: 1,
      // hoverable: true
    // }
  // });

  // Chart tooltip
  $('.chart, .chart-sm').bind('plothover', function(event, pos, item) {
    if (item) {
      if (previousPoint !== item.dataIndex) {
        previousPoint = item.dataIndex;
        $('#tooltip').remove();
        var x = item.datapoint[0],
          y = item.datapoint[1];
        showTooltip(item.pageX, item.pageY, y + ' at ' + x);
      }
    } else {
      $('#tooltip').remove();
      previousPoint = null;
    }
  });
})(jQuery);
