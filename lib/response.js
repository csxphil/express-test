var http = require('http')
  , mime = require('mime');

module.exports = function() {
  return new Response();
};

function Response() {
  this.statusCode = 200;
  this.header = {};
}

Response.prototype.status = function(code) {
  this.statusCode = code;
  return this;
};

Response.prototype.set = function(field, val) {
  if (2 == arguments.length) {
    this.header[field] = val;
  } else {
    for (var key in field) {
      this.header[key] = field[key];
    }
  }
  return this;
};

Response.prototype.get = function(field) {
  return this.header[field];
};

// from express
Response.prototype.send = function(body) {
  if (2 == arguments.length) {
    if ('number' != typeof body && 'number' == typeof arguments[1]) {
      this.statusCode = arguments[1];
    } else {
      this.statusCode = body;
      body = arguments[1]
    }
  }
  
  // convert string objects to primitives
  if (body instanceof String) body = body.toString();

  switch (typeof body) {
    // response status
    case 'number':
      this.get('Content-Type') || this.type('txt');
      this.statusCode = body;
      body = http.STATUS_CODES[body];
      break;
    // string defaulting to html
    case 'string':
      if (!this.get('Content-Type')) {
        this.charset = this.charset || 'utf-8';
        this.type('html');
      }
      break;
    case 'boolean':
    case 'object':
      if (null == body) {
        body = '';
      } else if (Buffer.isBuffer(body)) {
        this.get('Content-Type') || this.type('bin');
      } else {
        return this.json(body);
      }
      break;
  }

  // populate Content-Length
  if (undefined !== body && !this.get('Content-Length')) {
    var len;
    this.set('Content-Length', len = Buffer.isBuffer(body)
      ? body.length
      : Buffer.byteLength(body));
  }

  this.body = body;
  return this;
};

Response.prototype.json = function(obj) {
  // allow status / body
  if (2 == arguments.length) {
    // res.json(body, status) backwards compat
    if ('number' == typeof arguments[1]) {
      this.statusCode = arguments[1];
    } else {
      this.statusCode = obj;
      obj = arguments[1];
    }
  }

  // content-type
  this.set('Content-Type', 'application/json');
  var body = JSON.stringify(obj);
  
  return this.send(body);
};

Response.prototype.type = function(type) {
  return this.set('Content-Type', ~type.indexOf('/')
    ? type
    : mime.lookup(type));
};
