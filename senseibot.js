(function() {

  var bodyParser = require('body-parser');
  var express = require('express');
  var request = require('request');
  var xpath = require('xpath');
  var DOMParser = require('xmldom').DOMParser;

  var variables = require('./variables.js');

  function parseCommand(slackRequest, slackResponse, command, regex, commandFunction) {
    var match = command.match(regex);
    if (match) {
      commandFunction.apply(this, [slackRequest, slackResponse].concat(match.slice(1)));
    }
    return !!match;
  }

  function postToSlack(slackResponse, text) {
    slackResponse.send('{"text": ' + JSON.stringify(text) + '}');
  }

  function kanjiMeaning(slackRequest, slackResponse, kanji) {
    request('http://jisho.org/search/' + encodeURI(kanji) + '%20%23kanji', function(error, jishoResponse, jishoData) {
      if (error) {
        postToSlack(slackResponse, 'What\'s the meaning of ' + kanji + '? I don\'t know it either!');
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);
      var meaningNodes = xpath.select('//div[@class="kanji-details__main-meanings"]/text()', doc);

      if (meaningNodes.length > 0) {
        postToSlack(slackResponse, kanji + ' means ' + meaningNodes.join(', ').replace(/\s+/g, ' ').trim());
      } else {
        postToSlack(slackResponse, 'What\'s the meaning of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  function kanjiReading(slackRequest, slackResponse, kanji) {
    request('http://jisho.org/search/' + encodeURI(kanji) + '%20%23kanji', function(error, jishoResponse, jishoData) {
      if (error) {
        postToSlack(slackResponse, 'What\'s the reading of ' + kanji + '? I don\'t know it either!');
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(jishoData);
      var kunYomiNodes = xpath.select('//div[@class="kanji-details__main-readings"]//*[contains(@class, "kun_yomi")]//a/text()', doc);
      var onYomiNodes = xpath.select('//div[@class="kanji-details__main-readings"]//*[contains(@class, "on_yomi")]//a/text()', doc);

      if (kunYomiNodes.length > 0 || onYomiNodes.length > 0) {
        var readings = kanji + ' readings:\n';

        if (kunYomiNodes.length > 0) {
          readings += '- Kun-yomi: ' + kunYomiNodes.join(', ').replace(/\s+/g, ' ').trim() + '\n';
        }

        if (onYomiNodes.length > 0) {
          readings += '- On-yomi: ' + onYomiNodes.join(', ').replace(/\s+/g, ' ').trim();
        }

        postToSlack(slackResponse, readings);
      } else {
        postToSlack(slackResponse, 'What\'s the reading of ' + kanji + '? I don\'t know it either!');
      }
    });
  }

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function (slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.SLACK_TOKEN) {
      var command = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();
      var parsed = false;

      parsed = parsed || parseCommand(slackRequest, slackResponse, command, /^kanji meaning (.)$/, kanjiMeaning);
      parsed = parsed || parseCommand(slackRequest, slackResponse, command, /^kanji reading (.)$/, kanjiReading);

      if (!parsed) {
        postToSlack(slackResponse, '今日は、' + slackRequest.body.user_name + '！ You said: [' + command  + ']');
      }
    }
  });

  app.listen(7001, function () {
    console.log('senseibot app listening on port 7001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

}())
