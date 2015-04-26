var http = require('http');
var expect = require('expect.js');
var mockfs = require('mock-fs');
var Response = require('../../core/response');
var HomeController = require('../../controllers/HomeController');

var requestOptions = {
   host: 'localhost',
   port: '1003',
   path: '/',
   method: 'GET'
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

var startServer = function(callback) {
   http.createServer(function(req, res) {
      this.close();
      callback(req, res);
   }).listen(1003);
};


describe('HomeController', function() {
   var homeController;

   beforeEach(function() {
      homeController = new HomeController();
      mockfs({
         './views/': {
            'index.html': '<p>Test Data</p>'
         }
      });
   });

   describe('#index', function() {
      it('should render home view', function(done) {
         startServer(function(req, res) {
            homeController.response = new Response(res);
            homeController.GET_index();
         });

         makeRequest(function(response, body) {
            expect(body).to.be('<p>Test Data</p>');
            done();
         });
      });
   });
});
