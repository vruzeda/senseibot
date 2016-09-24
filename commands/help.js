(function() {

  var utils = require('./utils.js');

  function help(slackRequest, slackResponse, invalidCommand) {
    var help;

    if (invalidCommand) {
      help = 'ごめん, I don\'t understand this: [' + invalidCommand + ']. Valid commands:\n>>>';
    } else {
      help = 'Valid commands:\n>>>';
    }

    var commands = require('./commands.js');
    for (var i = 0; i < commands.length; ++i) {
      help += commands[i].description + '\n';
    }

    utils.postToSlack(slackResponse, help);
  }

  module.exports = {
    pattern: /^help$/,
    handler: help,
    description: '*senseibot help* : shows a list of valid commands'
  };

})();
