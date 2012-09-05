[![build status](https://secure.travis-ci.org/3vr/express-test.png)](http://travis-ci.org/3vr/express-test)

# express-test

This package allows you to test express routes without opening http requests or going through app middleware. It makes it easy to build a request for your route and verify the response.

## example

```javascript
// routes/hello.js

module.exports = function(app) {
  app.get('/hello', function(req, res) {
    res.send('hello');
  });
};
```

```javascript
// test/routes/hello-test.js

// create server
var express = require('express'),
    should = require('should');
require('express-test');

var app = express.createServer();

// require the route your going to test
require('./routes/hello')(app);

app.request().get('/hello').end()
.verify(function(res) {
  res.body.should.equal('hello');
});
```
