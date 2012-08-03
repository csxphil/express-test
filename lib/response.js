var http = require('http')
  , res = http.ServerResponse.prototype;

module.exports.create = function(req, app) {
  var res = new http.ServerResponse(req);
  res.req = req;
  res.app = app;
  return res;
};

res.end = function(body) {
  this.body = body;
};
