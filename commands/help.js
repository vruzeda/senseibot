(function() {

  function help(callback, invalidCommand) {
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

    callback(help);
  }

  module.exports = {
    pattern: /^help$/,
    handler: help,
    description: '*senseibot help* : shows a list of valid commands'
  };

})();
