(function() {

  var bodyParser = require('body-parser');
  var express = require('express');
  var http = require('http');
  var iconvlite = require('iconv-lite');

  var variables = require('./variables.js');

  function postToSlack(slackResponse, text) {
    slackResponse.send('{"text": ' + JSON.stringify(text) + '}');
  }

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function (slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.SLACK_TOKEN) {
      var command = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();
      postToSlack(slackResponse, '今日は、' + slackRequest.body.user_name + '！ You said: [' + command  + ']');
    }
  });

  app.listen(7001, function () {
    console.log('senseibot app listening on port 7001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

}())
