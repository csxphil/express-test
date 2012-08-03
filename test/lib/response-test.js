var request = require('../../lib/request')
  , response = require('../../lib/response')
  , should = require('should');

describe('response', function() {
  var app = null;
  var req = null;
  beforeEach(function() {
    app = {get: 'fake'};
    req = request.create();
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
