var express = require('express')
  , parseUrl = require('url').parse
  , sinon = require('sinon')
  , createResponse = require('./response')
  , methods = ['get', 'post', 'put', 'delete', 'head'];

module.exports = request = function(app) {
  return new Request(app);
};

express.HTTPServer.prototype.request = function(options) {
  return request(this, options);
};

function Request(app, options) {
  this.app = app;
  this.protocol = 'http:';
  this.host = 'localhost';
  this.path = '/';
  this.search = '';
  this.header = {};
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
  this.response = createResponse();
  this.responseMock = sinon.mock(this.response);
  if (fn) {
    fn(this.responseMock);
  }
  this.app.router(this, this.response);
  return this;
};

Request.prototype.verify = function(fn) {
  this.responseMock.verify();
  if (fn) {
    fn(this.response);
  }
  return this;
};
