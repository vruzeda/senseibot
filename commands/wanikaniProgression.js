(function() {

  var wanikani = require('../integrations/wanikani');

  function wanikaniProgression(message, callback, username) {
    wanikani.getProgression(username || message.userName, function (error, progression) {
      if (error) {
        callback('Uh-oh! Something went wrong: ' + error.message);
        return;
      }

      var progressionPost = 'User ' + progression.user_information.username + '\'s progression at level ' + progression.user_information.level + ' is:\n';
      progressionPost += 'Radicals: ' + progression.requested_information.radicals_progress + '/' + progression.requested_information.radicals_total + '\n';
      progressionPost += 'Kanjis: ' + progression.requested_information.kanji_progress + '/' + progression.requested_information.kanji_total + '\n';

      callback(progressionPost);
    });
  }

  module.exports = {
    pattern: /^wanikani progression(?: (.*))?$/,
    handler: wanikaniProgression,
    description: '*senseibot wanikani progression [&lt;username&gt;]* : returns the wanikani level of the user and the % of completion on radicals and kanjis'
  };

})();
