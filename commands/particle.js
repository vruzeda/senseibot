(function() {

  var jisho = require('../integrations/jisho.js');
  var utils = require('./utils.js');

  function particle(slackRequest, slackResponse, particle) {
    jisho.getParticleInformation(particle, function(error, particleInformation) {
      if (error) {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + particle + '? I don\'t know it either!');
        return;
      }

      if (particleInformation.meanings.length > 0) {
        var meaning = particle + '\'s meanings are:';

        meaning += '\n```';
        for (var i = 0; i < particleInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + particleInformation.meanings[i];
        }
        meaning += '\n```';

        utils.postToSlack(slackResponse, meaning);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + particle + '? I don\'t know it either!');
      }
    });
  }

  module.exports = {
    pattern: /^particle (.*)$/,
    handler: particle,
    description: '*senseibot particle &lt;particle&gt;* : returns the meaning of the particle'
  };

}());
