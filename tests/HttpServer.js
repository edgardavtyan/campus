var expect = require('expect.js');
var http = require('http');
var HttpServer = require('../core/HttpServer');

describe('HttpServer', function() {
   var requestData = {};

   var httpServer = new HttpServer();
   httpServer.start();

   beforeEach(function() {
      requestData = {
         host: 'localhost',
         port: '8888',
         path: '/',
         method: 'GET'
      };
   });

   it('should respond with 404 by default', function(done) {
      http.request(requestData, function(response) {
         expect(response.statusCode).to.be(404);
         done();
      }).end();
   });
});
