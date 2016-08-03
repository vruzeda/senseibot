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
        var meaning = particle + ' means:\n';

        for (var i = 0; i < particleInformation.meanings.length; ++i) {
          if (i > 0) {
            meaning += '\n';
          }

          meaning += (i + 1) + '. ' + particleInformation.meanings[i];
        }

        utils.postToSlack(slackResponse, meaning);
      } else {
        utils.postToSlack(slackResponse, 'What\'s the meaning of ' + particle + '? I don\'t know it either!');
      }
    });
  }

  module.exports = particle;

}());
