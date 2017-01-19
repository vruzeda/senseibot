(function() {

  var select = require('xpath.js');
  var async = require('async');

  var jisho = require('../integrations/jisho');

  function sentence(message, callback, sentence) {
    jisho.getSentenceBreakdown(sentence, function(error, sentenceInformation) {
      if (error) {
        callback(`What\'s the meaning of ${sentence}? I don\'t know it either!`);
        return;
      }

      if (sentenceInformation.words.length > 0) {

        var words = `\'${sentence}\' breakdown: \n`;

        var calls = [];

        //array used to avoid searching the same word again
        var alreadyProcessedWords = [];

        for (var i = 0; i < sentenceInformation.words.length; ++i) {

          var sentenceword = sentenceInformation.words[i];

          //data-pos attribute tells us if the word is a verb or a noun, etc.
          //Can be used later to direct the next searches, adding a #<type> on the query
          var datapos = select(sentenceword, '@data-pos');

          //valid words contain data-pos
          if (datapos.length > 0) {

            //toString or else it won't identify repeated values
            var word = select(sentenceword, './/a/text()').toString();

            //include it in the breakdown text even if it repeats
            words += `[${word}] `;

            //checking if word already was processed
            if (alreadyProcessedWords.indexOf(word) >= 0) {
              //it was, so we don't jisho search for it
              continue;
            }

            //adding to array to not be processed again
            alreadyProcessedWords.push(word);

            var isParticle = false;

            //verifying if data-pos is a particle
            if (datapos[0].value == 'Particle') {
              isParticle = true;
            }

            //encapsulating all this into a function so the jisho search calls keep the word value of this iteration
            //particle needs a specific search or else it's confused with simple kanjis
            (function(currentWord, particle){

              //adding all separate word calls to an array to be called later
              calls.push(function(callback){

                var wordInfoResult = '';

                var jishoCallbackFunction = function(error, wordInformation) {

                  if (error) {
                    callback(error, '');
                    return;
                  }

                  if (wordInformation.meanings.length > 0) {
                    if (typeof wordInformation.inflection != 'undefined' && currentWord !== wordInformation.inflection) {
                      wordInfoResult += `\n${currentWord} looks like an inflection of ${wordInformation.inflection}. Its meanings are:`;
                    } else {
                      wordInfoResult += `\n${currentWord}\'s meanings are:`;
                    }

                    wordInfoResult += '\n```';

                    for (var i = 0; i < wordInformation.meanings.length; ++i) {
                      wordInfoResult += `${i + 1}. ${wordInformation.meanings[i]}\n`;
                    }

                    wordInfoResult += '```';

                  }
                  callback(null, wordInfoResult);
                };

                //searching the word/particle
                if (particle) {
                  jisho.getParticleInformation(currentWord, jishoCallbackFunction);
                } else {
                  jisho.getWordInformation(currentWord, jishoCallbackFunction);
                }

              });
            })(word, isParticle);
          }
        }

        words += '\n';

        async.parallel(calls, function(error, result) {
          //if there was an error in any of the async requests
          if (error){
            callback(`What\'s the meaning of ${sentence}? I don\'t know it either!`);
            return;
          }

          for (var i = 0; i < result.length; i++){
            words += result[i];
            words += '\n';
          }

          callback(words);
        });

      } else {
        callback(`What\'s the meaning of ${sentence}? I don\'t know it either!`);
      }
    });
  }

  module.exports = {
    pattern: /^sentence (.*)$/,
    handler: sentence,
    description: '*senseibot sentence &lt;sentence&gt;* : returns the meaning of each word in the sentence'
  };

}());
