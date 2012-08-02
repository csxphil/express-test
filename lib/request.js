var express = require('express')
  , parseUrl = require('url').parse
  , sinon = require('sinon')
  , createResponse = require('./response')
  , methods = ['get', 'post', 'put', 'delete', 'head'];

module.exports = request = function(app) {
  return new Request(app);
};

express.HTTPServer.prototype.request = function() {
  return request(this);
};

function Request(app) {
  this.app = app;
  this.header = {};
  this.protocol = 'http:';
  this.host = 'localhost';
  this.path = '/';
  this.search = '';
  this.params = {};
  this.query = {};
  this.body = {};
  this.__defineGetter__('url', function() {
    return this.protocol + '//' + this.host + this.path + this.search;
  });
}

methods.forEach(function(method) {
  Request.prototype[method] = function(url) {
    return this.request(method, url);
  };
});

Request.prototype.set = function(field, val) {
  this.header[field] = val;
  return this;
};

Request.prototype.write = function(body) {
  this.body = body;
  return this;
};

Request.prototype.request = function(method, url) {
  this.method = method;
  var parsed = parseUrl(url, true, true);
  this.protocol = parsed.protocol || this. protocol;
  this.host = parsed.host || this.host;
  this.path = parsed.pathname;
  this.search = parsed.search || this.search;
  return this;
};

Request.prototype.end = function(fn) {
  this.res = createResponse(this);
  this.resMock = sinon.mock(this.res);
  if (fn) {
    fn(this.resMock);
  }
  this.app.router(this, this.res);
  return this;
};

Request.prototype.verify = function(fn) {
  this.resMock.verify();
  if (fn) {
    fn(this.res);
  }
  return this;
};
