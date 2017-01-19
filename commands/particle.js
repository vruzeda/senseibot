(function() {

  var jisho = require('../integrations/jisho');

  function particle(message, callback, particle) {
    jisho.getParticleInformation(particle, function(error, particleInformation) {
      if (error) {
        callback('What\'s the meaning of ' + particle + '? I don\'t know it either!');
        return;
      }

      if (particleInformation.meanings.length > 0) {
        var meaning = particle + '\'s meanings are:';

        meaning += '\n```';
        for (var i = 0; i < particleInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + particleInformation.meanings[i];
        }
        meaning += '\n```';

        callback(meaning);
      } else {
        callback('What\'s the meaning of ' + particle + '? I don\'t know it either!');
      }
    });
  }

  module.exports = {
    pattern: /^particle (.*)$/,
    handler: particle,
    description: '*senseibot particle &lt;particle&gt;* : returns the meaning of the particle'
  };

}());
