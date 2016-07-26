(function() {

  var request = require('request');
  var select = require('xpath.js');
  var DOMParser = require('xmldom').DOMParser;

  var utils = require('./utils.js');

  function kanjiReading(slackRequest, slackResponse, kanji) {
    request('http://jisho.org/search/' + encodeURI(kanji) + '%20%23kanji', function(error, jishoResponse, jishoData) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + kanji + '? I don\'t know it either!');
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);
      var readingNodes = select(doc, '//div[@class="kanji-details__main-readings"]');
      var kunYomiNodes = select(readingNodes[0], './/*[contains(@class, "kun_yomi")]//a/text()');
      var onYomiNodes = select(readingNodes[0], './/*[contains(@class, "on_yomi")]//a/text()');

      if (kunYomiNodes.length > 0 || onYomiNodes.length > 0) {
        var readings = kanji + ' readings:\n';

        if (kunYomiNodes.length > 0) {
          readings += '- Kun-yomi: ' + kunYomiNodes.join(', ').replace(/\s+/g, ' ').trim() + '\n';
        }

        if (onYomiNodes.length > 0) {
          readings += '- On-yomi: ' + onYomiNodes.join(', ').replace(/\s+/g, ' ').trim();
        }

        utils.postToSlack(slackResponse, readings);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the reading of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  module.exports = kanjiReading;

}());
