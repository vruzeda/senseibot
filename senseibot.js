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
      var userCommand = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();
      parseCommand(function(response) {
        slackResponse.send('{"text": ' + JSON.stringify(response) + '}');
      }, userCommand);
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

  rtm.on(slack.RTM_EVENTS.MESSAGE, function(message) {

    if (message.type === 'message') {
      var text = (message.subtype === 'message_changed') ? message.message.text : message.text;
      if (text && text.indexOf(`<@${rtm.startData.self.id}>`) == 0) {
        var userCommand = text.substr(`<@${rtm.startData.self.id}>`.length).replace(/\s+/g, ' ').trim();
        parseCommand(function(response) {
          rtm.sendMessage(response, message.channel);
        }, userCommand);
      }
    }
  });

  // HERE FOR DEBUG PURPOSES:

  rtm.on(slack.CLIENT_EVENTS.WEB.RATE_LIMITED, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.CONNECTING, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.WS_OPENING, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.WS_OPENED, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.DISCONNECT, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.WS_CLOSE, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.WS_ERROR, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, function() {
    // Do nothing!
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.RAW_MESSAGE, function() {
    // Do nothing!
  });

  rtm.start();

}());
