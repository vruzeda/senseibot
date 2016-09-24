(function() {

  var utils = require('./utils.js');
  var wanikani = require('../integrations/wanikani.js');

  function wanikaniProgression(slackRequest, slackResponse, username) {
    wanikani.getProgression(username || slackRequest.body.user_name, function (error, progression) {
      if (error) {
        utils.postToSlack(slackResponse, 'Uh-oh! Something went wrong: ' + error.message);
        return;
      }

      var progressionPost = 'User ' + progression.user_information.username + '\'s progression at level ' + progression.user_information.level + ' is:\n';
      progressionPost += 'Radicals: ' + progression.requested_information.radicals_progress + '/' + progression.requested_information.radicals_total + '\n';
      progressionPost += 'Kanjis: ' + progression.requested_information.kanji_progress + '/' + progression.requested_information.kanji_total + '\n';

      utils.postToSlack(slackResponse, progressionPost);
    });
  }

  module.exports = {
    pattern: /^wanikani progression(?: (.*))?$/,
    handler: wanikaniProgression,
    description: '*senseibot wanikani progression [username]* : returns the wanikani level of the user and the % of completion on radicals and kanjis'
  };

})();
