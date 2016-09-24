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
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, kanjiInformation.pattern, kanjiInformation.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, kanjiMeaning.pattern, kanjiMeaning.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, kanjiReading.pattern, kanjiReading.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, particle.pattern, particle.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, sentence.pattern, sentence.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, wanikaniProgression.pattern, wanikaniProgression.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, wanikaniStatus.pattern, wanikaniStatus.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, wordInformation.pattern, wordInformation.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, wordMeaning.pattern, wordMeaning.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, wordReading.pattern, wordReading.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, help.pattern, help.handler);
      parsed = parsed || utils.parseCommand(slackRequest, slackResponse, command, /^(.*)$/, help.handler);
    }
  });

  app.listen(7001, function () {
    console.log('senseibot app listening on port 7001!');
    console.log('variables: ' + JSON.stringify(variables));
  });

}());
