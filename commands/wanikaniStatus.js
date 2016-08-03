(function() {

  var variables = require('../variables.js');

  var request = require('request');
  var select = require('xpath.js');
  var DOMParser = require('xmldom').DOMParser;

  var utils = require('./utils.js');

  function wanikaniStatus(slackRequest, slackResponse, user) {
	  
	  var apikey = variables.WANIKANI_KEYS[user];
	  
	  if (!apikey){
		  utils.postToSlack(slackResponse, 'Username ' + user + ' not in the database');
		  return;
	  }

	var action = 'study-queue';
	  
    request('https://www.wanikani.com/api/user/' + apikey + '/' + action, function(error, wanikaniResponse, wanikaniData) {
      if (error) {
        utils.postToSlack(slackResponse, 'Wanikani returned an error. '+ error);
        return;
      }
 
      var data = JSON.parse(wanikaniData);
	  var user = data.user_information;
	  var req = data.requested_information;
	  
	  var out = 'User ' + user.username + ', level '+user.level+', now has available '+req.lessons_available+' lessons and '+req.reviews_available+' reviews';
	  
	  utils.postToSlack(slackResponse, out);

    });
  }

  module.exports = wanikaniStatus;

}());
