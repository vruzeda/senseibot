(function() {

  var bodyParser = require('body-parser');
  var express = require('express');

  var variables = require('./variables.js');

  var parseCommand = require('./commands/parseCommand.js');

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function (slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.SLACK_TOKEN) {
      parseCommand(slackRequest, slackResponse);
    }
  });

  app.listen(7001, function () {
    console.log('senseibot app listening on port 7001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

}());
