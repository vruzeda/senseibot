(function() {

  var jisho = require('../integrations/jisho.js');

  function kanjiReading(callback, kanji) {
    jisho.getKanjiInformation(kanji, function(error, kanjiInformation) {
      if (error) {
        callback('What\'s the reading of ' + kanji + '? I don\'t know it either!');
        return;
      }

      if (kanjiInformation.readings.kunYomi.length > 0 || kanjiInformation.readings.onYomi.length > 0) {
        var readings = kanji + '\'s readings are:';

        readings += '\n```';
        if (kanjiInformation.readings.kunYomi.length > 0) {
          readings += '\n- Kun-yomi: ' + kanjiInformation.readings.kunYomi.join(', ');
        }
        if (kanjiInformation.readings.onYomi.length > 0) {
          readings += '\n- On-yomi: ' + kanjiInformation.readings.onYomi.join(', ');
        }
        readings += '\n```';

        callback(readings);
      } else {
        callback('What\'s the reading of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  module.exports = {
    pattern: /^kanji reading (.)$/,
    handler: kanjiReading,
    description: '*senseibot kanji reading &lt;kanji&gt;* : returns only the reading of the kanji'
  };

}());
