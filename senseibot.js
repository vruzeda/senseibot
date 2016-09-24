(function() {

  var bodyParser = require('body-parser');
  var express = require('express');

  var variables = require('./variables.js');

  var help = require('./commands/help.js');
  var kanjiInformation = require('./commands/kanjiInformation.js');
  var kanjiMeaning = require('./commands/kanjiMeaning.js');
  var kanjiReading = require('./commands/kanjiReading.js');
  var particle = require('./commands/particle.js');
  var sentence = require('./commands/sentence.js');
  var wanikaniProgression = require('./commands/wanikaniProgression.js');
  var wanikaniStatus = require('./commands/wanikaniStatus.js');
  var wordInformation = require('./commands/wordInformation.js');
  var wordMeaning = require('./commands/wordMeaning.js');
  var wordReading = require('./commands/wordReading.js');
  var utils = require('./commands/utils.js');

  var app = express();

  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(bodyParser.text());

  app.post('/trigger', function (slackRequest, slackResponse) {

    if (slackRequest.body.token === variables.SLACK_TOKEN) {
      var command = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();

      var parsed = false;
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^kanji info(?:rmation)? (.)$/, kanjiInformation);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^kanji meaning (.)$/, kanjiMeaning);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^kanji reading (.)$/, kanjiReading);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^particle (.*)$/, particle);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^sentence (.*)$/, sentence);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^wanikani progression(?: (.*))?$/, wanikaniProgression);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^wanikani status(?: (.*))?$/, wanikaniStatus);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^word info(?:rmation)? (.*)$/, wordInformation);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^word meaning (.*)$/, wordMeaning);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^word reading (.*)$/, wordReading);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^help$/, help);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^(.*)$/, help);
    }
  });

  app.listen(7001, function () {
    console.log('senseibot app listening on port 7001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

}());
