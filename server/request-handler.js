

var fs = require('fs');
var path = require('path');
var urlParser = require('url');
var utils = require('./utils');

var objectId = 1;
var responseContent = {results:[]};

var actions = {
  "GET": function (request, response){
    utils.sendResponse(response, responseContent)
  },

  "POST": function (request, response){
    utils.collectData(request, function(message){
      message.objectId = ++objectId;
      responseContent.results.push(message);
      utils.sendResponse(response, responseContent, 201)
    });
  },

  "OPTIONS": function (request, response){
    utils.sendResponse(response);
  }
};

module.exports.requestHandler = function(request, response) {

  var action = actions[request.method];
  if ( action ) {
    action(request, response);
  } else {
    utils.sendResponse(request, "Not Found", 404);
  }
};

