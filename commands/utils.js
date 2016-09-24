(function() {

  function postToSlack(slackResponse, text) {
    slackResponse.send('{"text": ' + JSON.stringify(text) + '}');
  }

  module.exports = {
    postToSlack: postToSlack
  };

}());
