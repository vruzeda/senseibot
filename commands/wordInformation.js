(function() {

  var jisho = require('../integrations/jisho.js');

  function wordInformation(message, callback, word) {
    jisho.getWordInformation(word, function(error, wordInformation) {
      if (error) {
        callback('Do you want information on ' + word + '? I don\'t know that either!');
        return;
      }

      if (wordInformation.tags.length > 0 && wordInformation.meanings.length > 0 && wordInformation.reading.length > 0) {
        // Gramatical classes
        var gramaticalClass;
        if (wordInformation.tags.length == 1) {
          gramaticalClass = 'Its gramatical class is:';
        } else {
          gramaticalClass = 'Its gramatical classes are:';
        }

        gramaticalClass += '\n```\n' + wordInformation.tags.join(', ') + '\n```';

        // Meanings
        var meaning = 'Its meanings are:';

        meaning += '\n```';
        for (var i = 0; i < wordInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + wordInformation.meanings[i];
        }
        meaning += '\n```';

        // Readings
        var reading = 'Its reading is:';

        reading += '\n```\n' + wordInformation.reading + '\n```';

        // Combining the informations
        var information = '';

        if (word !== wordInformation.inflection) {
          information += word + ' looks like an inflection of ' + wordInformation.inflection + '\nHere\'s the information I got on it:';
        } else {
          information += 'Here\'s the information I got on ' + word + ':\n';
        }

        information += gramaticalClass + '\n\n';
        information += meaning + '\n\n';
        information += reading;

        callback(information);
      } else {
        callback('Do you want information on ' + word + '? I don\'t know that either!');
      }
    });
  }

  module.exports = {
    pattern: /^word info(?:rmation)? (.*)$/,
    handler: wordInformation,
    description: '*senseibot word information &lt;word&gt;* : returns the meaning and reading of the word'
  };

}());
