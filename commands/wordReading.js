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
      var conceptNodes = select(doc, '//div[contains(@class, "concept_light-representation")][1]');
      var wordNodes = select(conceptNodes[0], './/span[@class="text"]//text()');
      var furiganaNodes = select(conceptNodes[0], './/span[@class="furigana"]/node()').filter(function(node) { return node.toString().trim().length != 0 });
      var textNodes = select(conceptNodes[0], './/span[@class="text"]/node()').filter(function(node) { return node.toString().trim().length != 0 });

      var reading = '';
      var furiganaIndex = 0;

      for (var i = 0; i < textNodes.length; ++i, ++furiganaIndex) {
        if (textNodes[i].firstChild) {
          reading += textNodes[i].firstChild.data;
        } else {
          var text = textNodes[i].toString().trim();
          for (var j = 0; j < text.length; ++j, ++furiganaIndex) {
            reading += '[' + text.charAt(j) + ':' + furiganaNodes[furiganaIndex].firstChild.data + ']';
          }
          --furiganaIndex;
        }
      }

      if (reading.length > 0) {
        utils.postToSlack(slackResponse, wordNodes.map(function(wordNode) { return wordNode.toString().trim(); }).join('') + '\'s reading is ' + reading);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
      }
    });
  }

  module.exports = wordMeaning;

}());
