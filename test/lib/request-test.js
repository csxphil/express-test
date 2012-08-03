var request = require('../../lib/request')
  , response = require('../../lib/response')
  , express = require('express')
  , should = require('should')
  , sinon = require('sinon');

describe('request', function() {
  var app = null;
  var req = null;
  var mockReq = null;
  beforeEach(function() {
    app = express.createServer();
    req = request.create(app);
    mockReq = sinon.mock(req);
  });
  it('adds #request() to the express app', function() {
    (typeof app.request).should.equal('function');
  });
  describe('create', function() {
    it ('sets the app field', function() {
      req.app.should.equal(app);
    });
    describe('defaults', function() {
      it ('sets the header field to {}', function() {
        req.header.should.eql({});
      });
      it ('sets the protocol field to http:', function() {
        req.protocol.should.equal('http:');
      });
      it ('sets the host field to localhost', function() {
        req.host.should.equal('localhost');
      });
      it ('sets the path field to /', function() {
        req.path.should.equal('/');
      });
      it ('sets the search field to ""', function() {
        req.search.should.equal('');
      });
      it ('sets the param field to {}', function() {
        req.params.should.eql({});
      });
      it ('sets the query field to {}', function() {
        req.query.should.eql({});
      });
      it ('sets the body field to {}', function() {
        req.body.should.eql({});
      });
    });
  });
  describe('request#url', function() {
    it('creates the correct url', function() {
      req.search = '?field=val';
      req.url.should.equal('http://localhost/?field=val');
    });
  });
  describe('request method', function() {
    request.methods.forEach(function(method) {
      it(method + ' calls request#request(' + method + ', url)', function() {
        mockReq.expects('request').withArgs(method, '/theUrl').once();
        req[method]('/theUrl');
        mockReq.verify();
      });
    });
  });
  describe('request#set()', function() {
    it('adds a header field', function() {
      req.set('field', 'val').header['field'].should.equal('val');
    });
  });
  describe('request#write()', function() {
    it('sets the body', function() {
      req.write('new body').body.should.equal('new body');
    });
  });
  describe('request#request()', function() {
    it('sets the method', function() {
      req.request('post', '/theUrl').method.should.equal('post');
    });
    it('sets the protocol if the url contains one', function() {
      req.request('post', 'https://host/theUrl').protocol.should.equal('https:');
    });
    it('ignores the protocol if the url doesnt contain one', function() {
      req.request('post', '/theUrl').protocol.should.equal('http:');
    });
    it('sets the host if the url contains one', function() {
      req.request('post', 'https://host/theUrl').host.should.equal('host');
    });
    it('ignores the host if the url doesnt contain one', function() {
      req.request('post', '/theUrl').host.should.equal('localhost');
    });
    it('sets the path', function() {
      req.request('post', '/theUrl').path.should.equal('/theUrl');
      req.request('post', 'http://host/path-with-host').path.should.equal('/path-with-host');
    });
    it('sets the search if the url contains one', function() {
      req.request('post', '/theUrl?field=val').search.should.equal('?field=val');
    });
    it('ignores the search if the url doesnt contain one', function() {
      req.search = '?field=old'
      req.request('post', '/theUrl').search.should.equal('?field=old');
    });
  });
  describe('request#end()', function() {
    beforeEach(function() {
      app.get('/', function() { /* empty */ });
    });
    it('it calls back with the response mock', function(done) {
      req.end(function(res) {
        res.should.equal(req.resMock);
        done();
      });
    });
    it('routes the request', function() {
      var fakeRes = {res: 'fake'};
      var stub = sinon.stub(response, 'create').returns(fakeRes);
      mockReq.expects('route').withArgs(req, fakeRes).once();
      req.end();
      stub.restore();
      mockReq.verify();
    });
    // might be excessive
    it('creates a response', function() {
      var responseMock = sinon.mock(response);
      responseMock.expects('create').withArgs(req, req.app).once();
      req.end();
      responseMock.verify();
    });
    it('sets the response', function() {
      var fakeRes = {res: 'fake'};
      var stub = sinon.stub(response, 'create').returns(fakeRes);
      req.end();
      stub.restore();
      req.res.should.equal(fakeRes);
    });
    it('creates a mock response', function() {
      var fakeRes = {res: 'fake'};
      var stub = sinon.stub(response, 'create').returns(fakeRes);
      var sinonMock = sinon.mock(sinon);
      sinonMock.expects('mock').withArgs(fakeRes).once();
      req.end();
      stub.restore();
      sinonMock.verify();
    });
    it('sets the mock response', function() {
      var fakeResMock = {res: 'fake'};
      var stub = sinon.stub(sinon, 'mock').returns(fakeResMock);
      req.end();
      stub.restore();
      req.resMock.should.equal(fakeResMock);
    });
  });
  describe('request#verify()', function() {
    beforeEach(function() {
      app.get('/', function() { /* empty */ });
      req.end();
    });
    it('calls verify on resMock', function() {
      var reqMockMock = sinon.mock(req.resMock);
      reqMockMock.expects('verify').once();
      req.verify();
      reqMockMock.verify();
    });
    it('it calls back with the response object', function(done) {
      req.verify(function(res) {
        res.should.equal(req.res);
        done();
      });
    });
  });
  describe('express parsing', function() {
    // it('parses the parameters', function(done) {
    //   app.get('/test/:resource/:id', function(req, res) {
    //     param.resource.should.equal('foo');
    //     param.id.should.equal('bar');
    //     done();
    //   });
    //   req.get('/test/foo/bar').end();
    // });
  });
});
