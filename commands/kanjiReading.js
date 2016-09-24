(function() {

  var jisho = require('../integrations/jisho.js');
  var utils = require('./utils.js');

  function kanjiReading(slackRequest, slackResponse, kanji) {
    jisho.getKanjiInformation(kanji, function(error, kanjiInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + kanji + '? I don\'t know it either!');
        return;
      }

      if (kanjiInformation.readings.kunYomi.length > 0 || kanjiInformation.readings.onYomi.length > 0) {
        var readings = kanji + '\'s readings are:';

        if (kanjiInformation.readings.kunYomi.length > 0) {
          readings += '\n- Kun-yomi: ' + kanjiInformation.readings.kunYomi.join(', ');
        }

        if (kanjiInformation.readings.onYomi.length > 0) {
          readings += '\n- On-yomi: ' + kanjiInformation.readings.onYomi.join(', ');
        }

        utils.postToSlack(slackResponse, readings);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  module.exports = {
    pattern: /^kanji reading (.)$/,
    handler: kanjiReading,
    description: '*senseibot kanji reading &lt;kanji&gt;* : returns only the reading of the kanji'
  };

}());
