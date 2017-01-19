(function() {

  var bodyParser = require('body-parser');
  var express = require('express');
  var slack = require('@slack/client');

  var variables = require('./variables.js');
  var parseCommand = require('./commands/parseCommand.js');

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function(slackRequest, slackResponse) {
    if (slackRequest.body.token === variables.SLACK_TOKEN) {
      var message = {
        userName: slackRequest.body.user_name,
        userText: slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim()
      };

      parseCommand(message, function(response) {
        if (!response) {
          slackResponse.status(404).send();
          return;
        }

        slackResponse.send(`{"text": ${JSON.stringify(response)}}`);
      });
    }
  });

  app.listen(7001, function() {
    console.log('senseibot app listening on port 7001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

  var rtm = new slack.RtmClient(variables.SLACK_API_TOKEN);

  rtm.on(slack.CLIENT_EVENTS.RTM.AUTHENTICATED, function(rtmStartData) {
    rtm.startData = rtmStartData;
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
  });

  rtm.on(slack.RTM_EVENTS.MESSAGE, function(slackMessage) {
    if (slackMessage.type === 'message') {
      if (slackMessage.subtype === 'message_changed') {
        slackMessage.text = slackMessage.text || slackMessage.message.text;
        slackMessage.user = slackMessage.user || slackMessage.message.user;
      }

      var text = slackMessage.text;
      if (text && text.indexOf(`<@${rtm.startData.self.id}>`) == 0) {
        var message = {
          userName: this.dataStore.getUserById(slackMessage.user).name,
          userText: text.substr(`<@${rtm.startData.self.id}>`.length).replace(/\s+/g, ' ').trim()
        };

        parseCommand(message, function(response) {
          if (!response) {
            return;
          }

          rtm.sendMessage(response, slackMessage.channel);
        });
      }
    }
  });

  rtm.start();

}());
