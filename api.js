/*jshint node:true, indent:2, laxcomma:true, eqnull:true, unused:true, undef:true */

require('sugar');


var coolog = require('coolog')
  , httboom = require('httboom')
  , streamer = require('./streamer.js')();

var VIDEO_SRC = 'http://localhost:8244/';
var isPlaying = false;

var logger = coolog.logger('api.js', 'root');


module.exports.index = function (req, res) {
  'use strict';
  res.render('index');
};


module.exports.fail = function (req, res, next) {
  'use strict';
  next(new httboom.AppError(500, 'E_SERVER_ERROR', 'Boom', 'Application error'));
};

module.exports.play = function (req, res) {
  'use strict';
  var magregex = /^(magnet:?[^&]+)/i;
  var onready = function() {
    res.render('play', {videosrc: VIDEO_SRC});
  };
 
  if (magregex.test(req.query.torrent)) {
    if (isPlaying) {
      streamer.stop();
      isPlaying = false;
    }
    var magnet = req.query.torrent.match(/^(magnet:?[^&]+)/i)[0];
    logger.info('magnet link', magnet);
    var opt = {
      magnet: magnet,
      onready: onready
    };
    streamer.start(opt);
    
  } else {
    logger.error('Magnet error');
  }
};