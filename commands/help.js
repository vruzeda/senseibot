(function() {

	var utils = require('./utils.js');

	function help(slackRequest, slackResponse, command) {

		var help = 'Valid commands: \n';
	
		help += '>>>'; 
		help += '*senseibot kanji information &lt;kanji&gt;* : returns the meaning and the reading of the kanji \n';
		help += '*senseibot kanji meaning &lt;kanji&gt;* : returns only the meaning of the kanji \n';
		help += '*senseibot kanji reading &lt;kanji&gt;* : returns only the reading of the kanji \n';
		help += '*senseibot particle &lt;particle&gt;* : returns the meaning of the particle \n';
		help += '*senseibot sentence &lt;sentence&gt;* : returns the meaning of each word in the sentence \n';		
		help += '*senseibot wanikani progression [username]* : returns the wanikani level of the user and the % of completion on radicals and kanjis \n';
		help += '*senseibot wanikani status [username]* : returns the wanikani level of the user and the number of available lessons/reviews \n';		
		help += '*senseibot word information &lt;word&gt;* : returns the meaning and reading of the word \n';
		help += '*senseibot word reading &lt;word&gt;* : returns only the reading of the word \n';	
		help += '*senseibot word meaning &lt;word&gt;* : returns only the meaning of the word \n';			
		help += '*senseibot help* : shows a list of valid commands \n';			
		
		utils.postToSlack(slackResponse, help);
	}

	module.exports = help;

})();
