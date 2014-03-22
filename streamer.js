#!/usr/bin/env node
/*jshint node:true, indent:2, laxcomma:true, eqnull:true, unused:true, undef:true */

module.exports = function () {
  'use strict';

  var peerflix = require('peerflix');
  var engine;

  var start = function (magnet, port) {
    engine = peerflix(magnet, null);
    
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
      console.log('engine listening');
    });

    engine.server.once('error', function () {
      engine.server.listen(0);
    });

    engine.on('ready', function () {
      console.log('engine ready');
      engine.server.listen(port || 8244);
    });
  };

  var stop = function () {
    console.log('server closed...maybe');
    engine.server.close();
  };

  return {
    'start': start,
    'stop': stop
  };
};