"use strict";  // for better performance - to avoid searching in DOM
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let leftAction = false;
let rightAction = false;
let upAction = false;
let downAction = false;
let mousePosition;
let DisplayInfo = true;
let keyBindings=[ {
                    keyCode: 37,
                    targetVariable: "leftAction"
                  },
                  {
                    keyCode: 38,
                    targetVariable: "upAction"
                  },
                  {
                    keyCode: 39,
                    targetVariable: "rightAction"
                  },
                  {
                    keyCode: 40,
                    targetVariable: "downAction"
                  },
                  {
                    keyCode: 65,
                    targetVariable: "leftAction"
                  },
                  {
                    keyCode: 87,
                    targetVariable: "upAction"
                  },
                  {
                    keyCode: 68,
                    targetVariable: "rightAction"
                  },
                  {
                    keyCode: 83,
                    targetVariable: "downAction"
                  },
                  {
                    keyCode: 16,
                    targetVariable: "shiftAction"
                  }
                ]
const playerSize = 20;

document.addEventListener("keydown", event =>{
  keyBindings.forEach(element => {
    if(event.keyCode === element.keyCode){
      switch(element.targetVariable){
        case "leftAction":
          leftAction = true;
          break;
        case "rightAction":
          rightAction = true;
          break;
        case "upAction":
          upAction = true;
          break;
        case "downAction":
          downAction = true;
          break;
        case "shiftAction":
            shiftAction = true;
            break;
        default:
          break;
      }
    }
  });
});

document.addEventListener("keyup", event =>{
  keyBindings.forEach(element => {
    if(event.keyCode === element.keyCode){
      switch(element.targetVariable){
        case "leftAction":
          leftAction = false;
          break;
        case "rightAction":
          rightAction = false;
          break;
        case "upAction":
          upAction = false;
          break;
        case "downAction":
          downAction = false;
          break;
        case "shiftAction":
          shiftAction = false;
          break;
        default:
          break;
      }
    }
  });
});

window.WebSocket = window.WebSocket || window.MozWebSocket;

if (!window.WebSocket) {
  //If the browser doesn't support WebSockets
}  

// open connection
var targetGameServer;
targetGameServer = 'ws://24.13.240.19:1337'; // Configuration for running the server at home
//targetGameServer = 'ws://localhost:1337'; // Configuration for running development on the laptop

var connection = new WebSocket(targetGameServer);

//Connection Initialization
connection.onopen = function () {
  console.log("Connected!");
};  

// Connection doesn't work out
connection.onerror = function (error) {
  // just in there were some problems with connection...
  console.log("Something is going wrong!");
};  

// Connection sends message
connection.onmessage = function (message) {
  var json = null;
  try {
    json = JSON.parse(message.data);
  } catch (e) {
    console.log('Invalid JSON: ', message.data);
    return;
  }    
  if(DisplayInfo === true){
    console.log(json);
    DisplayInfo = false;
  }
  // NOTE: if you're not sure about the JSON structure check the server source code above first response from the server with user's color
  //console.log(json);
  if(json.player != undefined){
    ctx.clearRect(0,0,2400,2400);
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.arc(json.player.x + playerSize / 2, json.player.y + playerSize / 2, playerSize /2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  }else{
    console.log("Things Aren't Working");
  }
  json.otherPlayers.forEach(element => {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(element.x + playerSize / 2, element.y + playerSize / 2, playerSize /2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
  json.walls.forEach(element =>{
    ctx.beginPath();
    ctx.fillStyle = "green";
    ctx.rect(element.x, element.y, playerSize, playerSize);
    ctx.fill();
    ctx.closePath();
  });
  connection.send(JSON.stringify({ upAction: upAction,
                                      downAction: downAction,
                                      leftAction: leftAction,
                                      rightAction: rightAction}));
};
/**
* This method is optional. If the server wasn't able to
* respond to the in 3 seconds then show some error message 
* to notify the user that something is wrong.
*/
setInterval(function() {
  if (connection.readyState !== 1) {
    console.log("Server Isn't Connected");
  }
}, 3000);  /**
* Add message to the chat window
*/

document.addEventListener(
  "mousemove",
  event => {
    mousePosition = getMousePos(canvas, event);
    //console.log(mousePosition);
  }
);
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}