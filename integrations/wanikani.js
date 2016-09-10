(function() {

  var fs = require('fs');
  var request = require('request');

  function performAction(username, action, callback) {
    var variables = require('../variables.js');
    var apiKey = variables.WANIKANI_KEYS[username];

    if (!apiKey) {
      callback(new Error('Username ' + username + ' not in the database'), undefined);
      return;
    }

    request('https://www.wanikani.com/api/user/' + apiKey + '/' + action, function(error, response, dataString) {
      if (error) {
        callback(error, undefined);
        return;
      }

      var data = JSON.parse(dataString);
      if (data.error) {
        callback(new Error(data.error.message), undefined);
        return;
      }

      callback(null, data);
    });
  }

  function getProgression(username, callback) {
    performAction(username, 'level-progression', callback);
  }

  function getStatus(username, callback) {
    performAction(username, 'study-queue', callback);
  }

  module.exports = {
    getProgression: getProgression,
    getStatus: getStatus
  };

})();
