var request = require('../../lib/request')
  , response = require('../../lib/response')
  , http = require('http')
  , should = require('should');

describe('response', function() {
  var app = null;
  var req = null;
  beforeEach(function() {
    app = {get: 'fake'};
    req = request.create();
  });
  it ('doesnt break http response', function(done) {
    var server = http.createServer(function(req, res) {
      res.end('hello');
    });
    server.listen(3000, 'localhost', function() {
      http.request({host: 'localhost', port: 3000}, function(res) {
        var body = '';
        res.setEncoding('utf8');
        res.on('data', function(chunk) {
          body += chunk;
        });
        res.on('end', function() {
          body.should.equal('hello');
          done();
        });
      }).end();
    });
  });
  describe('createResponse', function() {
    it ('sets the app field', function() {
      response.create(req, app).app.should.equal(app);
    });
    it ('sets the req field', function() {
      response.create(req, app).req.should.equal(req);
    });
  });
  describe('response#end()', function() {
    it ('sets the body field', function() {
      var res = response.create(req, app);
      res.end('new body');
      res.body.should.equal('new body');
    });
  });
});
