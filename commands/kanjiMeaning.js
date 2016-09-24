(function() {

  var jisho = require('../integrations/jisho.js');
  var utils = require('./utils.js');

  function kanjiMeaning(slackRequest, slackResponse, kanji) {
    jisho.getKanjiInformation(kanji, function(error, kanjiInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + kanji + '? I don\'t know it either!');
        return;
      }

      if (kanjiInformation.meanings.length > 0) {
        var meaning = kanji + '\'s meanings are:';

        meaning += '\n```';
        for (var i = 0; i < kanjiInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + kanjiInformation.meanings[i];
        }
        meaning += '\n```';

        utils.postToSlack(slackResponse, meaning);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  module.exports = {
    pattern: /^kanji meaning (.)$/,
    handler: kanjiMeaning,
    description: '*senseibot kanji meaning &lt;kanji&gt;* : returns only the meaning of the kanji'
  };

}());
