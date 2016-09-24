(function() {

  var jisho = require('../integrations/jisho.js');
  var utils = require('./utils.js');

  function kanjiInformation(slackRequest, slackResponse, kanji) {
    jisho.getKanjiInformation(kanji, function(error, kanjiInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'Do you want information on ' + kanji + '? I don\'t know that either!');
        return;
      }

      if (kanjiInformation.meanings.length > 0 && (kanjiInformation.readings.kunYomi.length > 0 || kanjiInformation.readings.onYomi.length > 0)) {
        var information = 'Here\'s the information I got on ' + kanji + ':\n';

        var meaning = 'Its meanings are:';
        for (var i = 0; i < kanjiInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + kanjiInformation.meanings[i];
        }
        information += meaning + '\n\n';

        var readings = 'Its readings are:';
        if (kanjiInformation.readings.kunYomi.length > 0) {
          readings += '\n- Kun-yomi: ' + kanjiInformation.readings.kunYomi.join(', ');
        }
        if (kanjiInformation.readings.onYomi.length > 0) {
          readings += '\n- On-yomi: ' + kanjiInformation.readings.onYomi.join(', ');
        }
        information += readings;

        utils.postToSlack(slackResponse, information);
      } else {
        utils.postToSlack(slackResponse, 'Do you want information on ' + kanji + '? I don\'t know that either!');
      }
    });
  }

  module.exports = {
    pattern: /^kanji info(?:rmation)? (.)$/,
    handler: kanjiInformation,
    description: '*senseibot kanji information &lt;kanji&gt;* : returns the meaning and the reading of the kanji'
  };

}());
