var fs = require('fs');
var mime = require('mime');
var path = require('path');
var qs = require('querystring');
var nunjucks = require('nunjucks');

/**
 * Represends a wrapper around node's http.ServerResponse
 *
 * @class
 * @param {http.ServerResponse} res Base response
 */
function Response(res) {
   var self = this;
   var baseResponse = res;

   /**
    * Sends response with given HTTP status code, content MIME type and
    * content itself
    *
    * @param  {Number} code    HTTP status code
    * @param  {String} type    Content MIME type
    * @param  {Any}    content Content
    *
    * @return {Undefined} Undefined
    */
   self.send = function(code, type, content) {
      var mimeType = mime.lookup(type);
      baseResponse.statusCode = code;
      baseResponse.setHeader('Content-Type', mimeType + ';charset=utf-8');
      baseResponse.write(content);
      baseResponse.end();
   };

   /**
    * Sends JSON resposne with given HTTP status code and JSON content
    *
    * @param  {Number}        code    HTTP status code
    * @param  {Object|String} content JSON content
    *
    * @return {Undefined} Undefined
    */
   self.sendJson = function(code, content) {
      if (typeof content === 'object') {
         content = qs.stringify(content);
      }

      self.send(code, 'json', content);
   };

   /**
    * Reads file at given path and sends it's content as response
    *
    * @param  {String} filePath The path to the file
    *
    * @return {Undefined} Undefined
    */
   self.sendFile = function(filePath) {
      var fixedFilePath = path.join(__dirname, '../', filePath);
      fs.readFile(fixedFilePath, function(err, fileContent) {
         if (err) {
            self.send(404, 'text/plain', 'File not found');
            return;
         }

         self.send(200, mime.lookup(fixedFilePath), fileContent);
      });
   };

   /**
    * Sends redirect response to given url
    *
    * @param  {String} redirectUrl Url to redirect to
    *
    * @return {Undefined} Undefined
    */
   self.redirect = function(redirectUrl) {
      baseResponse.writeHead(302, { 'Location': redirectUrl });
      baseResponse.end();
   };

   /**
    * Renders given view and sends it as reponse
    *
    * @param  {String} view     Name of the view
    * @param  {Object} viewData Data to send to view
    *
    * @return {Undefined} Undefined
    */
   self.render = function(view, viewData) {
      var html = nunjucks.render(view + '.html', viewData);
      self.send(200, 'text/html', html);
   };

   /**
    * Renders 404 page
    *
    * @param  {String} data Message to display
    *
    * @return {Undefined} Undefined
    */
   self.render404 = function(data) {
      if (data === undefined) {
         data = 'Page not found';
      }

      self.render('404', { body: data });
   };
}

module.exports = Response;
