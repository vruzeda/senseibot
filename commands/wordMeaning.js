(function() {

  var jisho = require('../integrations/jisho.js');
  var utils = require('./utils.js');

  function wordMeaning(slackRequest, slackResponse, word) {
    jisho.getWordInformation(word, function(error, wordInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
        return;
      }

      if (wordInformation.meanings.length > 0) {
        var meaning = '';

        if (word !== wordInformation.inflection) {
          meaning += word + ' looks like an inflection of ' + wordInformation.inflection + '. Its meanings are:';
        } else {
          meaning += word + '\'s meanings are:';
        }

        for (var i = 0; i < wordInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + wordInformation.meanings[i];
        }

        utils.postToSlack(slackResponse, meaning);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
      }
    });
  }

  module.exports = {
    pattern: /^word meaning (.*)$/,
    handler: wordMeaning,
    description: '*senseibot word meaning &lt;word&gt;* : returns only the meaning of the word'
  };

}());
