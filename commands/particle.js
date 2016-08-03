(function() {

  var request = require('request');
  var select = require('xpath.js');
  var DOMParser = require('xmldom').DOMParser;

  var utils = require('./utils.js');

  function particle(slackRequest, slackResponse, particle) {

    request('http://jisho.org/search/' + encodeURI(particle) + '%20%23particle', function(error, jishoResponse, jishoData) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + particle + '? I don\'t know it either!');
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);

      var wordNodes = select(doc, '//div[@class="concept_light clearfix"]');

      if (wordNodes.length > 0) {

        //first result only
        var meaningNodes = select(wordNodes[0], './/span[@class="meaning-meaning"]/text()');

        if (meaningNodes.length > 0) {

          var meaning = '';

          for (var i = 0; i < meaningNodes.length; ++i) {
            if (i > 0) {
              meaning += '\n';
            }
            meaning += (i + 1) + '. ' + meaningNodes[i];
          }

          utils.postToSlack(slackResponse, particle + ' means \n' + meaning);
        } else {
          utils.postToSlack(slackResponse, 'What\'s the meaning of ' + particle + '? I don\'t know it either!');
        }
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + particle + '? I don\'t know it either!');
      }
    });
  }

  module.exports = particle;

}());
