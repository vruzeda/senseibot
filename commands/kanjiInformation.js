(function() {

  var jisho = require('../integrations/jisho.js');

  function kanjiInformation(callback, kanji) {
    jisho.getKanjiInformation(kanji, function(error, kanjiInformation) {
      if (error) {
        callback('Do you want information on ' + kanji + '? I don\'t know that either!');
        return;
      }

      if (kanjiInformation.meanings.length > 0 && (kanjiInformation.readings.kunYomi.length > 0 || kanjiInformation.readings.onYomi.length > 0)) {
        var meaning = 'Its meanings are:';

        meaning += '\n```';
        for (var i = 0; i < kanjiInformation.meanings.length; ++i) {
          meaning += '\n' + (i + 1) + '. ' + kanjiInformation.meanings[i];
        }
        meaning += '\n```';

        var readings = 'Its readings are:';

        readings += '\n```';
        if (kanjiInformation.readings.kunYomi.length > 0) {
          readings += '\n- Kun-yomi: ' + kanjiInformation.readings.kunYomi.join(', ');
        }
        if (kanjiInformation.readings.onYomi.length > 0) {
          readings += '\n- On-yomi: ' + kanjiInformation.readings.onYomi.join(', ');
        }
        readings += '\n```'
		
		var stroke = '';
		if (kanjiInformation.stroke != undefined) {
			stroke = ' (' + kanjiInformation.stroke + ' strokes)';
		}

        var information = 'Here\'s the information I got on ' + kanji + stroke +':\n';
        information += meaning + '\n\n';
        information += readings;

        callback(information);
      } else {
        callback('Do you want information on ' + kanji + '? I don\'t know that either!');
      }
    });
  }

  module.exports = {
    pattern: /^kanji info(?:rmation)? (.)$/,
    handler: kanjiInformation,
    description: '*senseibot kanji information &lt;kanji&gt;* : returns the stroke count, meaning and reading of the kanji'
  };

}());
