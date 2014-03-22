#!/usr/bin/env node
/*jshint node:true, indent:2, laxcomma:true, eqnull:true, unused:true, undef:true */

module.exports = function () {
  'use strict';

  var coolog = require('coolog')
    , peerflix = require('peerflix');

  var engine;
  var logger = coolog.logger('streamer.js', 'root');

  var start = function (opt) {
    engine = peerflix(opt.magnet, null);
    
    engine.on('hotswap', function () {
      //hotswaps++;
    });

    engine.on('uninterested', function () {
      engine.swarm.pause();
    });

    engine.on('interested', function () {
      engine.swarm.resume();
    });

    engine.server.on('listening', function () {
      logger.info('engine listening');
      opt.onready();
    });

    engine.server.once('error', function () {
      engine.server.listen(0);
    });

    engine.on('ready', function () {
      var port = opt.port || 8244;
      engine.server.listen(port);
      logger.info('Starting peerfix on port ' + port);

    });
  };

  var stop = function () {
    logger.info('server closed...maybe');
    engine.server.close();
  };

  return {
    'start': start,
    'stop': stop
  };
};