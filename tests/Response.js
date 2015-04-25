var http = require('http');
var expect = require('expect.js');
var Response = require('../core/Response');

var requestOptions = {};

var startServer = function(callback) {
   http.createServer(function(req, res) {
      var response = new Response(res);
      callback(response);
      this.close();
   }).listen(1000);
};

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

describe('Response', function() {
   beforeEach(function() {
      requestOptions = {
         host: 'localhost',
         port: '1000',
         path: '/',
         method: 'GET'
      };
   });

   describe('#send', function() {
      it('should send response', function(done) {
         startServer(function(response) {
            response.send(200, 'text/plain', 'test text');
         });

         makeRequest(function(res, data) {
            expect(res.statusCode).to.be(200);
            expect(data).to.be('test text');
            done();
         });
      });
   });
});
