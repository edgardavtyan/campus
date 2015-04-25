var Response = function(res) {
   var self = this;
   var baseResponse = res;

   self.send = function(code, type, content) {
      baseResponse.writeHead(200, { 'Content-Type': type });
      baseResponse.write(content);
      baseResponse.end();
   };
};

module.exports = Response;
