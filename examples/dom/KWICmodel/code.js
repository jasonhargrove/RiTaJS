const LEFT = "LEFT", CENTER = "CENTER",
  RIGHT = "RIGHT", WIDTH = 800, HEIGHT = 600;

var fillColor, kafkaString, textAlignment = LEFT,
  $container, word = 'window', kwic, opts;

$(document).ready(function () {

  assignButton();
  setup();
});

function assignButton() {

  $("#textInput").focus();

  $("#button").click(function () {
    buttonClicked();
  });

  $("#textInput").keypress(function (e) {

    if (e.which == 13) // enter key code
      return buttonClicked();
  })
}

function buttonClicked() {

  var $textInput = $("#textInput");
  word = $textInput.val();
  $("#textInput").val("").attr("placeholder", word);
  kwic = RiTa.kwic(kafkaString, word, opts);
  drawText();
}

function setup() {

  $container = $("#container");
  $container.width(WIDTH).height(HEIGHT)
    .css("background-color", "rgb(250, 250, 250)");
  $("#textInput").attr("placeholder", word);

  RiTa.loadString('../../data/kafka.txt', function (data) {

    kafkaString = data;
    kwic = RiTa.kwic(kafkaString, word, {
      ignorePunctuation: true,
      ignoreStopWords: true,
      wordCount: 6
    });

    drawText();
  });
}

function drawText() {

  $("#container").empty();
  $("#container").css('background-color', 'rgb(250, 250, 250)');

  if (kwic.length == 0) {

    textAlign(CENTER);
    text("Word not found", WIDTH / 2, HEIGHT / 2);

  } else {

    var tw = textWidth(word) / 2;

    for (var i = 0; i < kwic.length; i++) {

      var parts = kwic[i].split(word);
      var x = WIDTH / 2,
        y = i * 20 + 25;

      if (y > HEIGHT - 20) return;

      fill(0);
      textAlign(RIGHT);
      text(parts[0], x - tw, y);

      fill(200, 0, 0);
      textAlign(CENTER);
      text(word, x, y);

      fill(0);
      textAlign(LEFT);
      text(parts[1], x + tw, y);
    }
  }
}

function textWidth(s) {

  var $span = $('<span>', {
    html: s + '&nbsp;',
    css: {
      position: "absolute",
      top: "-100px",
      left: "-100px",
    }
  }).appendTo($('body'));

  var width = $span.width();
  $span.remove();

  return width;
}

function fill(a, b, c) {

  fillColor = (arguments.length == 1) ? toHex(a) :
    "rgb(" + a + "," + b + "," + c + ")";

  function toHex(color) {
    var intValue = Math.floor(color);
    return "rgb(" + intValue + "," + intValue + "," + intValue + ")";
  }
}

function textAlign(direction) {

  textAlignment = direction;
}

function text(s, x, y) {

  function convertPosition(innerX) {

    // position the strings according to alignment
    if (textAlignment == LEFT) {

      var ONLY_PUNCT = /^[^0-9A-Za-z\s]/;
      var regex = new RegExp(ONLY_PUNCT);
      if (regex.test(s))
        x = innerX - textWidth("");

    } else if (textAlignment == CENTER) {
      x = innerX - textWidth(s) / 2;

    } else if (textAlignment == RIGHT) {
      x = innerX - textWidth(s);
    }
  }

  convertPosition(x);

  var $span = $('<span/>', {
    html: s,
    css: {
      position: 'absolute',
      left: x, top: y,
      color: fillColor
    }
  }).appendTo($container);
}
