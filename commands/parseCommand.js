(function() {

  var help = require('./help.js');

  function parseCommand(slackRequest, slackResponse) {
    var input = slackRequest.body.text.substr(slackRequest.body.trigger_word.length).replace(/\s+/g, ' ').trim();
    var parsed = false;

    var commands = require('./commands.js');

    for (var i = 0; !parsed && i < commands.length; ++i) {
      var command = commands[i];

      var match = input.match(command.pattern);
      if (match) {
        command.handler.apply(this, [slackRequest, slackResponse].concat(match.slice(1)));
        parsed = true;
      }
    }

    if (!parsed) {
      help.handler(slackRequest, slackResponse, input);
    }
  }

  module.exports = parseCommand;

})();
