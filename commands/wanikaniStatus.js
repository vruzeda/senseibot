(function() {

  var wanikani = require('../integrations/wanikani.js');

  function wanikaniStatus(message, callback, username) {
    wanikani.getStatus(username || message.userName, function (error, status) {
      if (error) {
        callback('Uh-oh! Something went wrong: ' + error.message);
        return;
      }

      var statusPost = 'User ' + status.user_information.username + ', level ' + status.user_information.level + ', now has available ' + status.requested_information.lessons_available + ' lessons and ' + status.requested_information.reviews_available + ' reviews';

      callback(statusPost);
    });
  }

  module.exports = {
    pattern: /^wanikani status(?: (.*))?$/,
    handler: wanikaniStatus,
    description: '*senseibot wanikani status [&lt;username&gt;]* : returns the wanikani level of the user and the number of available lessons/reviews'
  };

}());
