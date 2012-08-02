var createRequest = require('../../lib/request')
  , createResponse = require('../../lib/response')
  , should = require('should');

describe('response', function() {
  var app = null;
  var req = null;
  beforeEach(function() {
    app = {get: 'fake'};
    req = createRequest();
  });
  describe('createResponse', function() {
    it ('sets the app field', function() {
      createResponse(req, app).app.should.equal(app);
    });
    it ('sets the req field', function() {
      createResponse(req, app).req.should.equal(req);
    });
  });
  describe('response#end()', function() {
    it ('sets the body field', function() {
      var res = createResponse(req, app);
      res.end('new body');
      res.body.should.equal('new body');
    });
  });
});
