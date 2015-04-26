var expect = require('expect.js');
var http = require('http');
var Request = require('../core/Request');

var requestOptions = {};

var server = function(done, callback) {
   http.createServer(function(req, res) {
      res.end();
      var request = new Request(req);
      this.close();
      callback(request, res);
      done();
   }).listen(1000);
};

describe('Request', function() {
   beforeEach(function() {
      requestOptions = {
         host: 'localhost',
         port: '1000',
         path: '/controller/method/param1/param2?queryParam=value#hash',
         method: 'GET'
      };
   });

   describe('#pathname', function() {
      it('should return base request pathname', function(done) {
         server(done, function(request) {
            expect(request.pathname()).to.be('/controller/method/param1/param2');
         });

         http.request(requestOptions).end();
      });
   });

   describe('#url', function() {
      it('should return base request url', function(done) {
         server(done, function(request) {
            expect(request.url()).to.be('/controller/method/param1/param2?queryParam=value#hash');
         });

         http.request(requestOptions).end();
      });
   });

   describe('#controllerName', function() {
      it('should return first pathname item if it exists', function(done) {
         server(done, function(request) {
            expect(request.controllerName()).to.be('controller');
         });

         http.request(requestOptions).end();
      });

      it('should return default name if pathanme has no firts item', function(done) {
         server(done, function(request) {
            expect(request.controllerName()).to.be('home');
         });

         requestOptions.path = '/';
         http.request(requestOptions).end();
      });
   });

   describe('#controllerMethod', function() {
      it('should return second pathname item if it exists', function(done) {
         server(done, function(request) {
            expect(request.controllerMethod()).to.be('method');
         });

         http.request(requestOptions).end();
      });

      it('should return default method if pathname has no second item', function(done) {
         server(done, function(request) {
            expect(request.controllerMethod()).to.be('index');
         });

         requestOptions.path = '/home';
         http.request(requestOptions).end();
      });

      it('should return default method if pathname second item is "/"', function(done) {
         server(done, function(request) {
            expect(request.controllerMethod()).to.be('index');
         });

         requestOptions.path = '/home/';
         http.request(requestOptions).end();
      });
   });

   describe('#controllerParams', function() {
      it('should return third and rest pathname items if they exist', function(done) {
         server(done, function(request) {
            expect(request.controllerParams()).to.be.eql(['param1', 'param2']);
         });

         http.request(requestOptions).end();
      });

      it('should return empty array if pathname has no third and rest items', function(done) {
         server(done, function(request) {
            expect(request.controllerParams()).to.be.eql([]);
         });

         requestOptions.path = '/controller/index/';
         http.request(requestOptions).end();
      });
   });
});
