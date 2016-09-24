(function() {

  var jisho = require('../integrations/jisho.js');

  function wordMeaning(callback, word) {
    jisho.getWordInformation(word, function(error, wordInformation) {
      if (error) {
        callback('What\'s the reading of ' + word + '? I don\'t know it either!');
        return;
      }

      if (wordInformation.reading.length > 0) {
        var reading = '';

        if (word !== wordInformation.inflection) {
          reading += word + ' looks like an inflection of ' + wordInformation.inflection + '\nIts reading is:';
        } else {
          reading += word + '\'s reading is:';
        }

        reading += '\n```\n' + wordInformation.reading + '\n```';

        callback(reading);
      } else {
        callback('What\'s the reading of ' + word + '? I don\'t know it either!');
      }
    });
  }

  module.exports = {
    pattern: /^word reading (.*)$/,
    handler: wordMeaning,
    description: '*senseibot word reading &lt;word&gt;* : returns only the reading of the word'
  };

}());
