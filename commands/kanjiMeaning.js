(function() {

  var request = require('request');
  var select = require('xpath.js');
  var DOMParser = require('xmldom').DOMParser;

  var utils = require('./utils.js');

  function kanjiMeaning(slackRequest, slackResponse, kanji) {
    request('http://jisho.org/search/' + encodeURI(kanji) + '%20%23kanji', function(error, jishoResponse, jishoData) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + kanji + '? I don\'t know it either!');
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);
      var meaningNodes = select(doc, '//div[@class="kanji-details__main-meanings"]/text()');

      if (meaningNodes.length > 0) {
        utils.postToSlack(slackResponse, kanji + ' means ' + meaningNodes.join(', ').replace(/\s+/g, ' ').trim());
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  module.exports = kanjiMeaning;

}());
