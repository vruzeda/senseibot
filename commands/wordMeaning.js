(function() {

  var jisho = require('../integrations/jisho.js');

  function wordMeaning(callback, word) {
    jisho.getWordInformation(word, function(error, wordInformation) {
      if (error) {
        callback('What\'s the meaning of ' + word + '? I don\'t know it either!');
        return;
      }

      if (wordInformation.meanings.length > 0) {
        var meaning = '';

        if (word !== wordInformation.inflection) {
          meaning += word + ' looks like an inflection of ' + wordInformation.inflection + '. Its meanings are:';
        } else {
          meaning += word + '\'s meanings are:';
        }

        meaning += '\n```';
        for (var i = 0; i < wordInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + wordInformation.meanings[i];
        }
        meaning += '\n```';

        callback(meaning);
      } else {
        callback('What\'s the meaning of ' + word + '? I don\'t know it either!');
      }
    });
  }

  module.exports = {
    pattern: /^word meaning (.*)$/,
    handler: wordMeaning,
    description: '*senseibot word meaning &lt;word&gt;* : returns only the meaning of the word'
  };

}());
