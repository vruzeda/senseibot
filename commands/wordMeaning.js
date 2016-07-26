(function() {

  var request = require('request');
  var select = require('xpath.js');
  var DOMParser = require('xmldom').DOMParser;

  var utils = require('./utils.js');

  function wordMeaning(slackRequest, slackResponse, word) {
    request('http://jisho.org/search/' + encodeURI(word), function(error, jishoResponse, jishoData) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);
      var inflectionNodes = select(doc, '//h6//a//text()');
      var wordNodes = select(doc, '//div[contains(@class, "concept_light-representation")][1]//span[@class="text"]//text()');
      var meaningNodes = select(doc, '//div[contains(@class, "concept_light")][1]//div[contains(@class, "concept_light-meanings")]//span[@class="meaning-meaning"]/text()');

      function postMeaningsToSlack(slackResponse, prefix, meaningNodes) {
        var meaning = '';
        for (var i = 0; i < meaningNodes.length; ++i) {
          if (i > 0) {
            meaning += '\n';
          }

          meaning += (i + 1) + '. ' + meaningNodes[i];
        }

        utils.postToSlack(slackResponse, prefix + meaning);
      }

      if (inflectionNodes.length > 0) {
        postMeaningsToSlack(slackResponse, word + ' looks like an inflection of ' + inflectionNodes[0] + '\nIts meanings are:\n', meaningNodes);
      } else if (meaningNodes.length > 0) {
        postMeaningsToSlack(slackResponse, wordNodes.map(function(wordNode) { return wordNode.toString().trim(); }).join('') + '\'s meanings are:\n', meaningNodes);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
      }
    });
  }

  module.exports = wordMeaning;

}());
