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
    console.log('slack.CLIENT_EVENTS.RTM.AUTHENTICATED', JSON.stringify(arguments));

    rtm.startData = rtmStartData;
    console.log(`Logged in as ${rtmStartData.self.name} of team ${rtmStartData.team.name}`);
  });

  rtm.on(slack.RTM_EVENTS.MESSAGE, function(message) {
    console.log('slack.RTM_EVENTS.MESSAGE', JSON.stringify(arguments));

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
    console.log('slack.CLIENT_EVENTS.WEB.RATE_LIMITED', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.CONNECTING, function() {
    console.log('slack.CLIENT_EVENTS.RTM.CONNECTING', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.WS_OPENING, function() {
    console.log('slack.CLIENT_EVENTS.RTM.WS_OPENING', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.WS_OPENED, function() {
    console.log('slack.CLIENT_EVENTS.RTM.WS_OPENED', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED, function() {
    console.log('slack.CLIENT_EVENTS.RTM.RTM_CONNECTION_OPENED', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.DISCONNECT, function() {
    console.log('slack.CLIENT_EVENTS.RTM.DISCONNECT', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START, function() {
    console.log('slack.CLIENT_EVENTS.RTM.UNABLE_TO_RTM_START', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.WS_CLOSE, function() {
    console.log('slack.CLIENT_EVENTS.RTM.WS_CLOSE', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.WS_ERROR, function() {
    console.log('slack.CLIENT_EVENTS.RTM.WS_ERROR', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT, function() {
    console.log('slack.CLIENT_EVENTS.RTM.ATTEMPTING_RECONNECT', JSON.stringify(arguments));
  });

  rtm.on(slack.CLIENT_EVENTS.RTM.RAW_MESSAGE, function() {
    console.log('slack.CLIENT_EVENTS.RTM.RAW_MESSAGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.ACCOUNTS_CHANGED, function() {
    console.log('slack.RTM_EVENTS.ACCOUNTS_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.BOT_ADDED, function() {
    console.log('slack.RTM_EVENTS.BOT_ADDED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.BOT_CHANGED, function() {
    console.log('slack.RTM_EVENTS.BOT_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_ARCHIVE, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_ARCHIVE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_CREATED, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_CREATED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_DELETED, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_DELETED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_HISTORY_CHANGED, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_HISTORY_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_JOINED, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_JOINED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_LEFT, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_LEFT', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_MARKED, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_MARKED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_RENAME, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_RENAME', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.CHANNEL_UNARCHIVE, function() {
    console.log('slack.RTM_EVENTS.CHANNEL_UNARCHIVE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.COMMANDS_CHANGED, function() {
    console.log('slack.RTM_EVENTS.COMMANDS_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.DND_UPDATED, function() {
    console.log('slack.RTM_EVENTS.DND_UPDATED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.DND_UPDATED_USER, function() {
    console.log('slack.RTM_EVENTS.DND_UPDATED_USER', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.EMAIL_DOMAIN_CHANGED, function() {
    console.log('slack.RTM_EVENTS.EMAIL_DOMAIN_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.EMOJI_CHANGED, function() {
    console.log('slack.RTM_EVENTS.EMOJI_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_CHANGE, function() {
    console.log('slack.RTM_EVENTS.FILE_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_COMMENT_ADDED, function() {
    console.log('slack.RTM_EVENTS.FILE_COMMENT_ADDED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_COMMENT_DELETED, function() {
    console.log('slack.RTM_EVENTS.FILE_COMMENT_DELETED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_COMMENT_EDITED, function() {
    console.log('slack.RTM_EVENTS.FILE_COMMENT_EDITED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_CREATED, function() {
    console.log('slack.RTM_EVENTS.FILE_CREATED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_DELETED, function() {
    console.log('slack.RTM_EVENTS.FILE_DELETED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_PRIVATE, function() {
    console.log('slack.RTM_EVENTS.FILE_PRIVATE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_PUBLIC, function() {
    console.log('slack.RTM_EVENTS.FILE_PUBLIC', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_SHARED, function() {
    console.log('slack.RTM_EVENTS.FILE_SHARED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.FILE_UNSHARED, function() {
    console.log('slack.RTM_EVENTS.FILE_UNSHARED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_ARCHIVE, function() {
    console.log('slack.RTM_EVENTS.GROUP_ARCHIVE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_CLOSE, function() {
    console.log('slack.RTM_EVENTS.GROUP_CLOSE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_HISTORY_CHANGED, function() {
    console.log('slack.RTM_EVENTS.GROUP_HISTORY_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_JOINED, function() {
    console.log('slack.RTM_EVENTS.GROUP_JOINED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_LEFT, function() {
    console.log('slack.RTM_EVENTS.GROUP_LEFT', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_MARKED, function() {
    console.log('slack.RTM_EVENTS.GROUP_MARKED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_OPEN, function() {
    console.log('slack.RTM_EVENTS.GROUP_OPEN', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_RENAME, function() {
    console.log('slack.RTM_EVENTS.GROUP_RENAME', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.GROUP_UNARCHIVE, function() {
    console.log('slack.RTM_EVENTS.GROUP_UNARCHIVE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.HELLO, function() {
    console.log('slack.RTM_EVENTS.HELLO', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.IM_CLOSE, function() {
    console.log('slack.RTM_EVENTS.IM_CLOSE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.IM_CREATED, function() {
    console.log('slack.RTM_EVENTS.IM_CREATED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.IM_HISTORY_CHANGED, function() {
    console.log('slack.RTM_EVENTS.IM_HISTORY_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.IM_MARKED, function() {
    console.log('slack.RTM_EVENTS.IM_MARKED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.IM_OPEN, function() {
    console.log('slack.RTM_EVENTS.IM_OPEN', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.MANUAL_PRESENCE_CHANGE, function() {
    console.log('slack.RTM_EVENTS.MANUAL_PRESENCE_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.MPIM_CLOSE, function() {
    console.log('slack.RTM_EVENTS.MPIM_CLOSE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.MPIM_HISTORY_CHANGED, function() {
    console.log('slack.RTM_EVENTS.MPIM_HISTORY_CHANGED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.MPIM_JOINED, function() {
    console.log('slack.RTM_EVENTS.MPIM_JOINED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.MPIM_OPEN, function() {
    console.log('slack.RTM_EVENTS.MPIM_OPEN', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.PIN_ADDED, function() {
    console.log('slack.RTM_EVENTS.PIN_ADDED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.PIN_REMOVED, function() {
    console.log('slack.RTM_EVENTS.PIN_REMOVED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.PREF_CHANGE, function() {
    console.log('slack.RTM_EVENTS.PREF_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.PRESENCE_CHANGE, function() {
    console.log('slack.RTM_EVENTS.PRESENCE_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.REACTION_ADDED, function() {
    console.log('slack.RTM_EVENTS.REACTION_ADDED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.REACTION_REMOVED, function() {
    console.log('slack.RTM_EVENTS.REACTION_REMOVED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.RECONNECT_URL, function() {
    console.log('slack.RTM_EVENTS.RECONNECT_URL', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.STAR_ADDED, function() {
    console.log('slack.RTM_EVENTS.STAR_ADDED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.STAR_REMOVED, function() {
    console.log('slack.RTM_EVENTS.STAR_REMOVED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.SUBTEAM_CREATED, function() {
    console.log('slack.RTM_EVENTS.SUBTEAM_CREATED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.SUBTEAM_SELF_ADDED, function() {
    console.log('slack.RTM_EVENTS.SUBTEAM_SELF_ADDED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.SUBTEAM_SELF_REMOVED, function() {
    console.log('slack.RTM_EVENTS.SUBTEAM_SELF_REMOVED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.SUBTEAM_UPDATED, function() {
    console.log('slack.RTM_EVENTS.SUBTEAM_UPDATED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_DOMAIN_CHANGE, function() {
    console.log('slack.RTM_EVENTS.TEAM_DOMAIN_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_JOIN, function() {
    console.log('slack.RTM_EVENTS.TEAM_JOIN', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_MIGRATION_STARTED, function() {
    console.log('slack.RTM_EVENTS.TEAM_MIGRATION_STARTED', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_PLAN_CHANGE, function() {
    console.log('slack.RTM_EVENTS.TEAM_PLAN_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_PREF_CHANGE, function() {
    console.log('slack.RTM_EVENTS.TEAM_PREF_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_PROFILE_CHANGE, function() {
    console.log('slack.RTM_EVENTS.TEAM_PROFILE_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_PROFILE_DELETE, function() {
    console.log('slack.RTM_EVENTS.TEAM_PROFILE_DELETE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_PROFILE_REORDER, function() {
    console.log('slack.RTM_EVENTS.TEAM_PROFILE_REORDER', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.TEAM_RENAME, function() {
    console.log('slack.RTM_EVENTS.TEAM_RENAME', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.USER_CHANGE, function() {
    console.log('slack.RTM_EVENTS.USER_CHANGE', JSON.stringify(arguments));
  });

  rtm.on(slack.RTM_EVENTS.USER_TYPING, function() {
    console.log('slack.RTM_EVENTS.USER_TYPING', JSON.stringify(arguments));
  });

  rtm.start();

}());
