(function() {

  var jisho = require('../integrations/jisho.js');
  var utils = require('./utils.js');

  function wordInformation(slackRequest, slackResponse, word) {
    jisho.getWordInformation(word, function(error, wordInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'Do you want information on ' + word + '? I don\'t know that either!');
        return;
      }

      if (wordInformation.meanings.length > 0 && wordInformation.reading.length > 0) {
        var information = '';

        if (word !== wordInformation.inflection) {
          information += word + ' looks like an inflection of ' + wordInformation.inflection + '\nHere\'s the information I got on it:';
        } else {
          information += 'Here\'s the information I got on ' + word + ':\n';
        }

        if (wordInformation.tags.length > 0) {
          var gramaticalClass;
          if (wordInformation.tags.length == 1) {
            gramaticalClass = 'Its gramatical class is: ' + wordInformation.tags[0];
          } else {
            gramaticalClass = 'Its gramatical classes are: ' + wordInformation.tags.join(', ');
          }
          information += gramaticalClass + '\n\n';
        }

        var meaning = 'Its meanings are:';
        for (var i = 0; i < wordInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + wordInformation.meanings[i];
        }
        information += meaning + '\n\n';

        var reading = 'Its reading is ' + wordInformation.reading;
        information += reading;

        utils.postToSlack(slackResponse, information);
      } else {
        utils.postToSlack(slackResponse, 'Do you want information on ' + word + '? I don\'t know that either!');
      }
    });
  }

  module.exports = {
    pattern: /^word info(?:rmation)? (.*)$/,
    handler: wordInformation,
    description: '*senseibot word information &lt;word&gt;* : returns the meaning and reading of the word'
  };

}());
