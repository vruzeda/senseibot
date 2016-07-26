(function() {

  var request = require('request');
  var select = require('xpath.js');
  var DOMParser = require('xmldom').DOMParser;

  var utils = require('./utils.js');

  function wordMeaning(slackRequest, slackResponse, word) {
    request('http://jisho.org/search/' + encodeURI(word), function(error, jishoResponse, jishoData) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + word + '? I don\'t know it either!');
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);
      var detailsLink = select(doc, '//a[@class="light-details_link"]/@href[1]');

      request(detailsLink[0].value, function(error, jishoResponse, jishoData) {
        if (error) {
          utils.postToSlack(slackResponse, 'What\'s the reading of ' + word + '? I don\'t know it either!');
          return;
        }

        var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);
        var conceptNode = select(doc, '//div[contains(@class, "concept_light-representation")][1]')[0];
        var furiganaNodes = select(conceptNode, './/span[@class="furigana"]/node()').filter(function(node) { return node.toString().trim().length != 0 });
        var textNodes = select(conceptNode, './/span[@class="text"]/node()').filter(function(node) { return node.toString().trim().length != 0 });

        if (textNodes.length > 0) {
          var reading = '';

          var inflection = '';

          for (var i = 0; i < textNodes.length; ++i) {
            var textNode = textNodes[i];

            if (textNode.firstChild) {
              inflection += textNode.firstChild.data;
            } else {
              inflection += textNode.toString().trim();
            }
          }

          if (word !== inflection) {
            reading += word + ' looks like an inflection of ' + inflection + '\nIts reading is:\n';
          } else {
            reading += word + '\'s reading is:\n';
          }

          var furiganaIndex = 0;

          for (var i = 0; i < textNodes.length; ++i, ++furiganaIndex) {
            var textNode = textNodes[i];

            if (textNode.firstChild) {
              reading += textNode.firstChild.data;
            } else {
              var text = textNode.toString().trim();
              for (var j = 0; j < text.length; ++j, ++furiganaIndex) {
                var furiganaNode = furiganaNodes[furiganaIndex];
                reading += '[' + text.charAt(j) + ':' + furiganaNode.firstChild.data + ']';
              }
              --furiganaIndex;
            }
          }

          utils.postToSlack(slackResponse, reading);
        } else {
          utils.postToSlack(slackResponse, 'What\'s the reading of ' + word + '? I don\'t know it either!');
        }
      });
    });
  }

  module.exports = wordMeaning;

}());
