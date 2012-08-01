var express = require('express')
  , _ = require('underscore')
  , http = require('http')
  , app = require('./app')
  , methods = require('./methods');

module.exports = request = function(app) {
  return new Request(app);
};

express.HTTPServer.proto.request = function(options) {
  request(this, options);
};

function Request(app, options) {
  this.app = app;
  this.host = 'localhost';
  this.method = 'get';
  if (options) {
    this.host = options.host || this.host;
    this.method = options.method || this.method;
    this.path = options.path || this.path;
  }
  this.header = {};
  this.data = [];
  this.__defineGetter__('url', function() {
    return 'http://' + this.host + this.path;
  });
}

_.each(methods, function(method) {
  Request.prototype[method] = function(path) {
    return this.request(method, path);
  };
});

Request.prototype.set = function(field, val) {
  this.header[field] = val;
  return this;
};

Request.prototype.write = function(data) {
  this.data.push(data);
  return this;
};

Request.prototype.request = function(method, path) {
  this.method = method;
  this.path = path;
  return this;
};

Request.prototype.end = function(fn) {
  this.response = new http.ServerResponse(this);
  fn(this.response);
  route = this.app.router(this, this.response);
  return this;
};

Request.prototype.verify = function(fn) {
  fn(this.response);
  return this;
};
