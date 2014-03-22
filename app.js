#!/usr/bin/env node
/*jshint node:true, indent:2, laxcomma:true, eqnull:true, unused:true, undef:true */

/**
 * Module dependencies.
 */

var cipolla = require('cipolla')
  , coolog = require('coolog')
  , logger
  ;

cipolla.coolog.addChannel({ name: 'cipolla', level: 'debug', appenders: ['console'] });
coolog.addChannel({ name: 'root', level: 'debug', appenders: ['console'] });
logger = coolog.logger('app.js', 'root');


if (process.env.NODE_ENV === 'production' && !process.env.CIPOLLA_FOREVER) {
  // If we are in a production env the app will be handled by
  // forever-monitor, watching for changes and restarting on app crash
  cipolla.forever('app.js', __dirname);
  
} else {
  // Instantiate the cipolla router
  var router = new cipolla.Dispatcher(__dirname);
  
  cipolla({
    name: 'cipolla',
    port: process.env.PORT || 3000,
    cwd: __dirname,
    dispatcher: router
  });
  
  router.route('/', { get: 'api.index' });
  router.route('/play', { get: 'api.play' });
}
