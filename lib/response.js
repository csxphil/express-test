var http = require('http')
  , res = http.ServerResponse.prototype
  , httpEnd = http.ServerResponse.prototype.end;


module.exports.create = function(req, app) {
  var res = new http.ServerResponse(req);
  res.req = req;
  res.app = app;
  res.expressTest = true;
  return res;
};

res.end = function(body) {
  if (this.expressTest) {
    this.body = body;
  } else {
    httpEnd.call(this, body);
  }
};
