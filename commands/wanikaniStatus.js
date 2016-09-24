(function() {

  var utils = require('./utils.js');
  var wanikani = require('../integrations/wanikani.js');

  function wanikaniStatus(slackRequest, slackResponse, username) {
    wanikani.getStatus(username || slackRequest.body.user_name, function (error, status) {
      if (error) {
        utils.postToSlack(slackResponse, 'Uh-oh! Something went wrong: ' + error.message);
        return;
      }

      var statusPost = 'User ' + status.user_information.username + ', level ' + status.user_information.level + ', now has available ' + status.requested_information.lessons_available + ' lessons and ' + status.requested_information.reviews_available + ' reviews';

      utils.postToSlack(slackResponse, statusPost);
    });
  }

  module.exports = {
    pattern: /^wanikani status(?: (.*))?$/,
    handler: wanikaniStatus,
    description: '*senseibot wanikani status [username]* : returns the wanikani level of the user and the number of available lessons/reviews'
  };

}());
