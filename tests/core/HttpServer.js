var expect = require('expect.js');
var http = require('http');
var mockfs = require('mock-fs');
var HttpServer = require('../../core/HttpServer');

var requestOptions = {};
var makeRequest = function(onBodyRead) {
   http.request(requestOptions, function(res) {
      var body = '';
      res.on('data', function(chunk) {
         body += chunk;
      });

      res.on('end', function() {
         onBodyRead(res, body);
      });
   }).end();
};

var TestController = function() {
   var self = this;

   self.GET_index = function() {
      self.response.send(200, 'text/plain', 'Test Data');
   };

   self.GET_testMethod = function() {
      self.response.send(200, 'text/plain', 'Test Data');
   };
};

var httpServer = new HttpServer();
httpServer.controllers['Test'] = new TestController();

describe('HttpServer', function() {
   httpServer.start();

   beforeEach(function() {
      requestOptions = {
         host: 'localhost',
         port: '8888',
         path: '/',
         method: 'GET'
      };
   });

   it('should send file if file was requested', function(done) {
      mockfs({
         'path/to/': {'file.json': '{ testKey: testValue }' }
      });

      requestOptions.path = '/path/to/file.json';
      makeRequest(function(response, body) {
         expect(body).to.be('{ testKey: testValue }');
         mockfs.restore();
         done();
      });
   });

   it('should call index method of controller on request', function(done) {
      requestOptions.path = '/Test/';
      makeRequest(function(response, body) {
         expect(response.statusCode).to.be(200);
         expect(body).to.be('Test Data');
         done();
      });
   });

   it('should call non-index method of controller on request', function(done) {
      requestOptions.path = '/Test/testMethod/';
      makeRequest(function(response, body) {
         expect(response.statusCode).to.be(200);
         expect(body).to.be('Test Data');
         done();
      });
   });

   it('should send 404 error given non-existing controller', function(done) {
      requestOptions.path = '/not-exists/';
      makeRequest(function(response) {
         expect(response.statusCode).to.be(404);
         done();
      });
   });

   it('should send 404 error given non-existing method', function(done) {
      requestOptions.path = '/Test/not-exists/';
      makeRequest(function(response) {
         expect(response.statusCode).to.be(404);
         done();
      });
   });
});
