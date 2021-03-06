const GameEngine = require("./src/gameEngine.js");

"use strict";// Optional. You will see this name in eg. 'ps' or 'top' command
process.title = 'node-chat';// Port where we'll run the websocket server
var webSocketsServerPort = 1337;// websocket and http servers
var webSocketServer = require('websocket').server;
var http = require('http');
var url = require('url');
var fs = require('fs');
var { Server } = require('ws');

var crypto = require('crypto');
let gameEngine = new GameEngine();

const options = {
  key: fs.readFileSync('keys/key.pem'),
  cert: fs.readFileSync('keys/cert.pem'),
  passphrase: "apples"
};

/**
 * Global variables
 */
// list of currently connected clients (users)
var clients = [ ];/**
 * Helper function for escaping input strings
 */
function htmlEntities(str) {
  return String(str)
      .replace(/&/g, '&amp;').replace(/</g, '&lt;')
      .replace(/>/g, '&gt;').replace(/"/g, '&quot;');
}
/**
 * HTTPs server
 
var server = http.createServer(function(request, response) {
  // Not important for us. We're writing WebSocket server,
  // not HTTP server
});
*/
var server = http.createServer(function (req, res) {
    // Gets the information that the user is requesting. Useful for handling what to send to the user
    console.log(url.origin);
    var q = url.parse(req.url, true);
    var fileName = "./" + q.pathname;
    var fileInfo = fileName.split(".");
    // Tries to collect the file that the user is looking for.
    // This applies for webpages looking for scripts.
    // Handles files that don't exist
    console.log("'"+fileName+"'");
    if(fileName === ".//reset"){
      resetServer();
    }
    if(fileName === ".//"){
      fileName = ".//game.html";
    }
    if(fileName === ".//portFinder.js"){
      res.writeHead(200, {'Content-Type': 'application/javascript'});
      if(process.env.PORT === undefined){
        res.write("var gameServerPort = 'ws://localhost:5000'");
      }else{
        res.write("var gameServerPort = 'ws://quast.herokuapp.com';");
        res.write("console.log(gameServerPort)");
        console.log("Step 1.5");
      }
      return res.end();
    }
    console.log("Step 2");
    fs.readFile(fileName, function(err, data) {
        
      if (err) {
        res.writeHead(404, {'Content-Type': 'text/html'});
        return res.end("404 Not Found");
      } 
      if(fileInfo[fileInfo.length-1] === "js"){
        res.writeHead(200, {'Content-Type': 'application/javascript'});
      }else{
        res.writeHead(200, {'Content-Type': 'text/html'});
      }
      
      res.write(data);
      return res.end();
    });
  }).listen(process.env.PORT || 5000);

console.log("Testing Log Files");
console.log(process.env.PORT);
//Tells the server to start listening on the specified port
//server.listen(webSocketsServerPort);
/**
 * WebSocket server
 */
// WebSocket server is tied to a HTTP server. WebSocket request is just an enhanced HTTP request. For more info http://tools.ietf.org/html/rfc6455#page-6
//*

var wsServer = new Server({server});
var oneOff = true;
console.log("upgrade should have worked");
// This callback function is called every time someone tries to connect to the WebSocket server
wsServer.on('connection', function(connection) {
  // accept connection - you should check 'request.origin' to make sure that client is connecting from your website (http://en.wikipedia.org/wiki/Same_origin_policy)
  // we need to know client index to remove them on 'close' event
  var assignedCharacterIndex = gameEngine.addPlayer();
  var index = clients.push([connection, assignedCharacterIndex]) - 1;
  console.log((new Date()) + ' Connection accepted.');
  connection.send(JSON.stringify(gameEngine.getClientInfo(assignedCharacterIndex)));
  oneOff = true;
  connection.on('message', function(message) {
    var json = JSON.parse(message);
    gameEngine.recievePlayerInput(json, assignedCharacterIndex);
  });  // user disconnected
  connection.on('close', function(connection) {
    console.log("Player Disconnected");
    gameEngine.removePlayer(assignedCharacterIndex);
    clients.splice(index, 1);
  });
});
wsServer.onopen = function(){
  var assignedCharacterIndex = gameEngine.addPlayer();
  var index = clients.push([connection, assignedCharacterIndex]) - 1;
  console.log((new Date()) + ' Connection accepted.');
  connection.send(JSON.stringify(gameEngine.getClientInfo(assignedCharacterIndex)));
}
//*/
setInterval(serverLoop, 20);
function serverLoop(){
  var start = Date.now();
  gameEngine.gameLoop();
  for(var i = 0; i < clients.length; i++){
    var targetConnection = clients[i][0];
    var playerID = clients[i][1];
    targetConnection.send(JSON.stringify(gameEngine.getClientInfo(playerID)));
  }
  var timeEllaspsed = (Date.now() - start)/1000;
  var expectedFPS = 1/timeEllaspsed;
  
  //Used for monitoring the Server Loop Time
  //Calculates the expected server fps
  if(oneOff){
    console.log("This loop ran at: " + expectedFPS + " FPS. The loop took " + timeEllaspsed + " seconds");
    oneOff = false;
  }
}

function resetServer(){
  //gameEngine = new GameEngine();
  gameEngine.reset();
}