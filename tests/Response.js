var http = require('http');
var expect = require('expect.js');
var mockfs = require('mock-fs');
var util = require('./util');
var Response = require('../core/Response');


describe('Response', function() {
   var requestOptions = {};

   var startServer = function(callback) {
      http.createServer(function(req, res) {
         var response = new Response();
         response.load(res);
         this.close();
         callback(response);
      }).listen(1000);
   };


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

         util.makeRequest(requestOptions, function(res, data) {
            expect(res.statusCode).to.be(200);
            expect(data).to.be('test text');
            done();
         });
      });
   });


   describe('#sendFile', function() {
      before(function() {
         mockfs({
            'TestDir': {
               'TestFile.json': '{ key: value }'
            }
         });
      });

      after(function() {
         mockfs.restore();
      });

      it('should send existing file', function(done) {
         startServer(function(response) {
            response.sendFile('TestDir/TestFile.json');
         });

         util.makeRequest(requestOptions, function(response, data) {
            expect(data).to.be('{ key: value }');
            done();
         });
      });

      it('should send 404 error given non-existing file', function(done) {
         startServer(function(response) {
            response.sendFile('TestDir/not-exists.json');
         });

         util.makeRequest(requestOptions, function(response) {
            expect(response.statusCode).to.be(404);
            done();
         });
      });
   });


   describe('#render', function() {
      it('should send rendered contents of the template file', function(done) {
         var testHtmlString = '<p>Test HTML</p>';

         startServer(function(response) {
            response.viewCompiler.compile = function() {
               return testHtmlString;
            };

            response.render('template');
         });

         util.makeRequest(requestOptions, function(response, data) {
            expect(data).to.be(testHtmlString);
            done();
         });
      });
   });
});
