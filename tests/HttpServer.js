var expect = require('expect.js');
var http = require('http');
var HttpServer = require('../core/HttpServer');

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

describe('HttpServer', function() {
   var httpServer = new HttpServer();
   httpServer.start();

   beforeEach(function() {
      requestOptions = {
         host: 'localhost',
         port: '8888',
         path: '/',
         method: 'GET'
      };
   });

   it('should call index method of controller on request', function(done) {
      var TestController = function() {
         var self = this;

         self.index = function() {
            self.response.send(200, 'text/plain', 'Test Data');
         };
      };

      httpServer.controllers['Test'] = new TestController();

      requestOptions.path = '/Test/';
      makeRequest(function(response, body) {
         expect(response.statusCode).to.be(200);
         expect(body).to.be('Test Data');
         done();
      });
   });

   it('should call non-index method of controller on request', function(done) {
      var TestController = function() {
         var self = this;

         self.testMethod = function() {
            self.response.send(200, 'text/plain', 'Test Data');
         };
      };

      httpServer.controllers['Test'] = new TestController();

      requestOptions.path = '/Test/testMethod/';
      makeRequest(function(response, body) {
         expect(response.statusCode).to.be(200);
         expect(body).to.be('Test Data');
         done();
      });
   });

   it('should send 404 error given non-existing controller', function(done) {
      httpServer.controllers = {};
      requestOptions.path = '/Test/testMethod/';
      makeRequest(function(response) {
         expect(response.statusCode).to.be(404);
         done();
      });
   });

   it('should send 404 error given non-existing method', function(done) {
      var TestController = function() {};
      httpServer.controllers['Test'] = new TestController();
      requestOptions.path = '/Test/testMethod/';
      makeRequest(function(response) {
         expect(response.statusCode).to.be(404);
         done();
      });
   });
});
