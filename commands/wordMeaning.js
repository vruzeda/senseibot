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
      var detailsLink = select(doc, '//a[@class="light-details_link"]/@href[1]')[0].value;

      request(detailsLink, function(error, jishoResponse, jishoData) {
        if (error) {
          utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
          return;
        }

        var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);
        var textNodes = select(doc, '//div[@class="concept_light-representation"]//span[@class="text"]/node()').filter(function(node) { return node.toString().trim().length != 0 });
        var meanings = select(doc, '//span[@class="meaning-meaning"]/text()').map(function(node) { return node.toString(); });

        if (meanings.length > 0) {
          var meaning = '';

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
            meaning += word + ' looks like an inflection of ' + inflection + '\nIts meanings are:\n';
          } else {
            meaning += word + '\'s meanings are:\n';
          }

          for (var i = 0; i < meanings.length; ++i) {
            if (i > 0) {
              meaning += '\n';
            }

            meaning += (i + 1) + '. ' + meanings[i];
          }

          utils.postToSlack(slackResponse, meaning);
        } else {
          utils.postToSlack(slackResponse, 'What\'s the meaning of ' + word + '? I don\'t know it either!');
        }
      });
    });
  }

  module.exports = wordMeaning;

}());
