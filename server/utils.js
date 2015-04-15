var path = require('path');
var fs = require('fs');

var headers = {
  "access-control-allow-origin": "*",
  "access-control-allow-methods": "GET, POST, PUT, DELETE, OPTIONS",
  "access-control-allow-headers": "content-type, accept",
  "access-control-max-age": 10, // Seconds.
  'Content-Type': "application/json"
};

exports.sendResponse = function(response, data, statusCode){
  statusCode = statusCode || 200;
  response.writeHead(statusCode, headers);
  response.end(JSON.stringify(data));
};

exports.collectData = function(request, callback){
    var data = "";
    request.on('data',function(chunk){
      data += chunk;
    });

    request.on('end',function(){
      callback(JSON.parse(data));
    });
};

exports.retrieveFile = function(request, response){

  headers['Content-Type'] = 'text/html';



  var fileName = path.basename(request.url) || 'index.html';
  var localFolder = "client/";
  var filePath = localFolder + fileName;

  fs.exists(filePath, function(exists){
    if(exists){
      fs.readFile(filePath, function(err,contents){
        if(!err){
          console.log("Found and read " + filePath);
          //console.log(contents.toString());
          statusCode = 200;
          response.writeHead(statusCode, headers);
          response.end(contents);
        } else {
          console.log("Failed to read " + filePath);
          exports.sendResponse(response, "Failed to read", 500);
        }
      });
    } else {
      console.log(filePath+ " does not exist");
      exports.sendResponse(response, "Not Found", 404);
    }
  });
}
