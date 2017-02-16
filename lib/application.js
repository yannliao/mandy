'use strict';

/**
 * Module dependencies.
 */

const debug = require('debug')('mandy:application');
const http = require('http');
const Emitter = require('events');
const finalhandler = require('finalhandler');

module.exports = class Application extends Emitter {
  constructor() {
    super();
    this.index = 0;
    this.middlewares = [];
    this.env = process.env.NODE_ENV || 'development';
  }
  listen() {
    debug('listening');
    const server = http.createServer(this.callback());
    return server.listen.apply(server, arguments);
  }

  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    debug('use %s', fn.name || '-');
    this.middlewares.push(fn);
    return this;
  }

  executor(req, res) {
    let index = this.index = 0;
    const middlewares = this.middlewares;
    const env = this.env;
    const onerror = this.onerror;
    // final function handler
    const done = finalhandler(req, res, {
      env: env,
      onerror: onerror
    });

    function next(err) {
      // next callback
      const fn = middlewares[index++];

      // all done
      if (!fn) {
        done(err);
        return;
      }
      // excute the middlewares
      debug('excute: %s', fn.name);

      try {
        if (!err) {
          // request-handling middleware
          fn(req, res, next);
          return;
        }
      } catch (err) {
        // continue
        next(err);
      }
      next(err);
    }
    next();
  }

  callback() {
    if (!this.listeners('error').length) this.on('error', this.onerror);
    return (req, res) => {
      this.executor(req, res);
    };
  }
  onerror(err) {
    assert(err instanceof Error, `non-error thrown: ${err}`);
    console.error(err.stack || err.toString());
  }
};
