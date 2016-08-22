(function() {

  var request = require('request');
  var select = require('xpath.js');
  var DOMParser = require('xmldom').DOMParser;

  function getKanjiInformation(kanji, callback) {
    request('http://jisho.org/search/' + encodeURI(kanji) + '%20%23kanji', function(error, response, data) {
      if (error) {
        callback(error, undefined);
        return;
      }

      var kanjiInformation = {
        meanings: [],
        readings: {
          kunYomi: [],
          onYomi: []
        }
      };

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(data);
      var meaningNodes = select(doc, '//div[@class="kanji-details__main-meanings"]');
      var readingNodes = select(doc, '//div[@class="kanji-details__main-readings"]');

      if (meaningNodes.length > 0) {
        var meaningNodes = select(meaningNodes[0], './text()');

        for (var i = 0; i < meaningNodes.length; ++i) {
          var meaningNode = meaningNodes[i];
          kanjiInformation.meanings.push(meaningNode.data.replace(/\s+/g, ' ').trim());
        }
      }

      if (readingNodes.length > 0) {
        var kunYomiNodes = select(readingNodes[0], './/*[contains(@class, "kun_yomi")]//a/text()');
        var onYomiNodes = select(readingNodes[0], './/*[contains(@class, "on_yomi")]//a/text()');

        for (var i = 0; i < kunYomiNodes.length; ++i) {
          var kunYomiNode = kunYomiNodes[i];
          kanjiInformation.readings.kunYomi.push(kunYomiNode.data.replace(/\s+/g, ' ').trim());
        }

        for (var i = 0; i < onYomiNodes.length; ++i) {
          var onYomiNode = onYomiNodes[i];
          kanjiInformation.readings.onYomi.push(onYomiNode.data.replace(/\s+/g, ' ').trim());
        }
      }

      callback(null, kanjiInformation);
    });
  }

  function getParticleInformation(particle, callback) {
    request('http://jisho.org/search/' + encodeURI(particle) + '%20%23particle', function(error, response, data) {
      if (error) {
        callback(error, undefined);
        return;
      }

      var particleInformation = {
        meanings: []
      };

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(data);
      var conceptNodes = select(doc, '//div[@class="concept_light clearfix"]');

      if (conceptNodes.length > 0) {
        var meaningNodes = select(conceptNodes[0], './/span[@class="meaning-meaning"]/text()');

        for (var i = 0; i < meaningNodes.length; ++i) {
          var meaningNode = meaningNodes[i];
          particleInformation.meanings.push(meaningNode);
        }
      }

      callback(null, particleInformation);
    });
  }

  function getWordInformation(word, callback) {
    request('http://jisho.org/search/' + encodeURI(word), function(error, response, data) {
      if (error) {
        callback(error, undefined);
        return;
      }

      var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(data);
      var detailsLink = select(doc, '//a[@class="light-details_link"]/@href[1]')[0].value;

      request(detailsLink, function(error, response, data) {
        if (error) {
          callback(error, undefined);
          return;
        }

        var wordInformation = {
          meanings: [],
          reading: '',
          inflection: ''
        }

        var doc = new DOMParser({errorHandler: {warning: null}}).parseFromString(data);
        var meaningNodes = select(doc, '//span[@class="meaning-meaning"][not(span)]/text()');
        var conceptNodes = select(doc, '//div[contains(@class, "concept_light-representation")][1]');

        for (var i = 0; i < meaningNodes.length; ++i) {
          var meaningNode = meaningNodes[i];
          wordInformation.meanings.push(meaningNode.toString().replace(/\s+/g, ' ').trim());
        }

        if (conceptNodes.length > 0) {
          var furiganaNodes = [];
          if (furiganaNodes.length == 0) {
            furiganaNodes = select(conceptNodes[0], './/span[@class="furigana"]/ruby[@class="furigana-justify"]/rt').reduce(function(furiganaNodes, furiganaNode) {
              return furiganaNodes.concat(furiganaNode.firstChild.data.split(''));
            }, []);
          }
          if (furiganaNodes.length == 0) {
            furiganaNodes = select(conceptNodes[0], './/span[@class="furigana"]/span').map(function(furiganaNode) {
              if (furiganaNode.firstChild) {
                return furiganaNode.firstChild.data;
              } else {
                return '';
              }
            });
          }

          var textNodes = select(conceptNodes[0], './/span[@class="text"]/node()').filter(function(textNode) {
            return textNode.toString().trim().length != 0
          }).reduce(function(textNodes, textNode) {
            if (textNode.firstChild) {
              return textNodes.concat(textNode.firstChild.data.split(''));
            } else {
              return textNodes.concat(textNode.toString().trim().split(''));
            }
          }, []);

          for (var i = 0; i < textNodes.length; ++i) {
            var textNode = textNodes[i];
            var furiganaNode = furiganaNodes[i];

            if (furiganaNode.length == 0) {
              wordInformation.reading += textNode;
            } else {
              wordInformation.reading += '[' + textNode + ':' + furiganaNode + ']';
            }
          }

          for (var i = 0; i < textNodes.length; ++i) {
            var textNode = textNodes[i];

            if (textNode.firstChild) {
              wordInformation.inflection += textNode.firstChild.data;
            } else {
              wordInformation.inflection += textNode.toString().trim();
            }
          }
        }

        callback(null, wordInformation);
      });
    });
  }

  module.exports = {
    getKanjiInformation: getKanjiInformation,
    getParticleInformation: getParticleInformation,
    getWordInformation: getWordInformation
  };

})();
