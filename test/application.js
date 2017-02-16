'use strict';

const request = require('supertest');
const assert = require('assert');
const Mandy = require('..');

describe('app', () => {
  it('should inherit from event emitter', function (done) {
    const app = new Mandy();
    app.on('foo', done);
    app.emit('foo');
  });

  it('should be object', function () {
    const app = new Mandy();
    assert.equal(typeof app, 'object');
  });

  it('should 404 without middlewares', function (done) {
    const app = new Mandy();
    const server = app.listen();
    request(server)
      .get('/')
      .expect(404, done);
  });


  it('should work when using listen', function (done) {
    const app = new Mandy();

    app.use(function (req, res) {
      res.end('hello, world!');
    });

    const server = app.listen();

    request(server)
      .get('/')
      .expect(200, 'hello, world!', done);
  });
});
