(function() {

  var jisho = require('../integrations/jisho.js');
  var async = require('async');

  function kanjiStroke(callback, kanji) {
    var kanjiList = kanji.split(' ');
    var calls = [];

    for (var i = 0; i < kanjiList.length; ++i) {

      // encapsulating all this into a function so the jisho search calls keep the word value of this iteration
      // particle needs a specific search or else it's confused with simple kanjis
      (function(currentKanji) {

        // adding all separate word calls to an array to be called later
        calls.push(function(callback) {
          var strokeResult = '';

          var jishoCallbackFunction = function(error, kanjiInformation) {
            if (error) {
              callback(error, '');
              return;
            }

            if (kanjiInformation.stroke != undefined) {
              strokeResult = currentKanji + ' has ' + kanjiInformation.stroke + ' strokes';
            }

            callback(null, strokeResult);
          };

          // obtaining kanji information
          jisho.getKanjiInformation(currentKanji, jishoCallbackFunction);
        });
      })(kanjiList[i]);
    }

    strokes = '';

    async.parallel(calls, function(error, result) {
      // if there was an error in any of the async requests
      if (error) {
        callback('What\'s the stroke count of ' + kanji + '? I don\'t know it either!');
        return;
      }

      for (var i = 0; i < result.length; i++) {
        strokes += result[i];
        strokes += '\n';
      }

      callback(strokes);
    });

  }

  module.exports = {
    pattern: /^kanji stroke (.*)$/,
    handler: kanjiStroke,
    description: '*senseibot kanji stroke &lt;kanji1&gt; [&lt;kanji2&gt;] [&lt;kanji3&gt;]...* : returns only the stroke count of the kanji or list of kanjis'
  };

}());
