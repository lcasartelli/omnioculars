#!/usr/bin/env node
/*jshint node:true, indent:2, laxcomma:true, eqnull:true, unused:true, undef:true */


/**
 * Module dependencies.
 */

require('sugar');

var logger = require('koa-logger')
  , koa = require('koa')
  //, request = require('co-request')
  , route = require('koa-route')
  , statics = require('koa-static')
  , views = require('koa-render')
  , streamer = require('./streamer.js')();

var port = 3000;
var src = 'http://localhost:8244/';
var playing = false;


var app = koa();
app.use(logger());
app.use(views(__dirname + '/views', 'jade'));
app.use(statics(__dirname + '/public'));
app.use(route.get('/', index));
app.use(route.get('/play', play));
app.listen(port);

function *index() {
  'use strict';
  this.body = yield this.render('index', {});
}

function *play() {
  'use strict';
  var magnet = this.query.torrent || '';
  if (/^magnet:/.test(magnet)) {
    if (playing) {
      streamer.stop();
      playing = false;
    }
    streamer.start(magnet);
    this.body = yield this.render('play', {videosrc: src});
  } else {
    console.error('Magnet error');
  }
}

console.log('listening on port ' + port);