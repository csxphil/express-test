var express = require('express')
  , parseUrl = require('url').parse
  , sinon = require('sinon')
  , response = require('./response')
  , methods = ['get', 'post', 'put', 'delete', 'head'];

module.exports.create = create = function(app) {
  return new Request(app);
};
module.exports.methods = methods;

express.HTTPServer.prototype.request = function() {
  return create(this);
};

function Request(app) {
  this.app = app;
  this.method = 'get';
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
  this.query = parsed.query && Object.keys(parsed.query).length > 0 ? parsed.query : this.query;
  return this;
};

Request.prototype.end = function(fn) {
  this.res = response.create(this, this.app);
  this.resMock = sinon.mock(this.res);
  if (fn) {
    fn(this.resMock);
  }
  this.route(this, this.res);
  return this;
};

Request.prototype.route = function(req, res) {
  this.app.router(req, res);
};

Request.prototype.verify = function(fn) {
  this.resMock.verify();
  if (fn) {
    fn(this.res);
  }
  return this;
};
