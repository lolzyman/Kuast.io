"use strict";  // for better performance - to avoid searching in DOM
let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
//#region Player Actions
let leftAction = false;
let rightAction = false;
let upAction = false;
let downAction = false;
let shiftAction = false;
let shootAction = false;
let swingAction = false;
let respawnAction = false;
//#endregion
let mousePosition;
let xOffset;
let yOffset;
let xCenter = 210;
let yCenter = 210;
let characterOrientation = 0;
const playerSize = 40;
//#region Key Information
let keyBindings=[ {
                    // Left Arrow key
                    keyCode: 37,
                    targetVariable: "leftAction"
                  },
                  {
                    // Up Arrow key
                    keyCode: 38,
                    targetVariable: "upAction"
                  },
                  {
                    // Right Arrow key
                    keyCode: 39,
                    targetVariable: "rightAction"
                  },
                  {
                    // Down Arrow key
                    keyCode: 40,
                    targetVariable: "downAction"
                  },
                  {
                    // A key
                    keyCode: 65,
                    targetVariable: "leftAction"
                  },
                  {
                    // W key
                    keyCode: 87,
                    targetVariable: "upAction"
                  },
                  {
                    // D key
                    keyCode: 68,
                    targetVariable: "rightAction"
                  },
                  {
                    // S key
                    keyCode: 83,
                    targetVariable: "downAction"
                  },
                  {
                    // Any Shift key
                    keyCode: 16,
                    targetVariable: "shiftAction"
                  },
                  {
                    // Q key
                    keyCode: 81,
                    targetVariable: "shootAction"
                  },
                  {
                    // E key
                    keyCode: 69,
                    targetVariable: "swingAction"
                  },
                  {
                    // R key
                    keyCode: 82,
                    targetVariable: "respawnAction"
                  }
                ]

document.addEventListener("keydown", event =>{
  changeKeyState(event, true);
});

document.addEventListener("keyup", event =>{
  changeKeyState(event, false);
});

function changeKeyState(keyEvent, newBoolean){
  keyBindings.forEach(element => {
    if(keyEvent.keyCode === element.keyCode){
      switch(element.targetVariable){
        case "leftAction":
          leftAction = newBoolean;
          return;
        case "rightAction":
          rightAction = newBoolean;
          return;
        case "upAction":
          upAction = newBoolean;
          return;
        case "downAction":
          downAction = newBoolean;
          return;
        case "shiftAction":
          shiftAction = newBoolean;
          return;
        case "shootAction":
          shootAction = newBoolean;
          return;
        case "swingAction":
          swingAction = newBoolean;
          return;
        case "respawnAction":
          respawnAction = newBoolean;
          return;
        default:
          return;
      }
    }
  });
}
//#endregion
window.WebSocket = window.WebSocket || window.MozWebSocket;

if (!window.WebSocket) {
  //If the browser doesn't support WebSockets
}  

// open connection
var targetGameServer;
//targetGameServer = 'ws://24.13.240.19:1337'; // Configuration for running the server at home
targetGameServer = 'ws://localhost:1337'; // Configuration for running development on the laptop

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

  xOffset = json.player.x + playerSize / 2;
  yOffset = json.player.y + playerSize / 2;
  ctx.clearRect(0,0,420,420);
  // NOTE: if you're not sure about the JSON structure check the server source code above first response from the server with user's color
  //console.log(json);
  //#region Draw Other Players
  json.otherPlayers.forEach(element => {
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.arc(element.x - xOffset + xCenter + playerSize / 2, element.y - yOffset + yCenter + playerSize / 2, playerSize /2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    ctx.beginPath();
    ctx.fillStyle = "yellow";
    ctx.strokeStyle = "black";
    ctx.arc(element.x - xOffset + xCenter + playerSize / 2 + Math.cos(element.orientation)*(playerSize / 2), element.y - yOffset + yCenter + playerSize / 2 + Math.sin(element.orientation)*(playerSize / 2), playerSize /6, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();
    ctx.closePath();
    drawSword(element.x - xOffset + xCenter + playerSize / 2, element.y - yOffset + yCenter + playerSize / 2, (1 + 0.5) * playerSize, element.weapon.swingAngle);
  });
  //#endregion
  //#region Draw Current Player
  //#region Draw Body
  ctx.beginPath();
  ctx.fillStyle = "green";
  ctx.arc(xCenter, yCenter, playerSize /2, 0, Math.PI * 2);
  ctx.fill();
  ctx.closePath();
  //#endregion
  //#region Draw Nose
  ctx.beginPath();
  ctx.fillStyle = "yellow";
  ctx.strokeStyle = "black";
  ctx.arc(xCenter + Math.cos(json.player.orientation)*(playerSize / 2), yCenter + Math.sin(json.player.orientation)*(playerSize / 2), playerSize /6, 0, Math.PI * 2);
  ctx.fill();
  ctx.stroke();
  ctx.closePath();
  //#endregion
  //#region Draw Sword
  drawSword(xCenter, yCenter, (1 + 0.5) * playerSize, json.player.weapon.swingAngle);
  //#endregion
  //#endregion
  //#region Draw Walls
  json.walls.forEach(element =>{
    ctx.beginPath();
    ctx.fillStyle = "black";
    ctx.rect(element.x  - xOffset + xCenter, element.y  - yOffset + yCenter, playerSize, playerSize);
    ctx.fill();
    ctx.closePath();
  });
  //#endregion
  //#region Draw Enemies
  json.enemies.forEach(element =>{
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(element.x - xOffset + xCenter + playerSize / 2, element.y - yOffset + yCenter + playerSize / 2, playerSize /2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
  });
  //#endregion
  //#region Send Response
  connection.send(JSON.stringify({ upAction: upAction,
                                    downAction: downAction,
                                    leftAction: leftAction,
                                    rightAction: rightAction,
                                    shiftAction: shiftAction,
                                    orientation: characterOrientation,
                                    shootAction: shootAction,
                                    swingAction: swingAction,
                                    respawnAction: respawnAction}));
    //#endregion
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
    characterOrientation = Math.atan((mousePosition.y - yCenter)/(mousePosition.x - xCenter));
    if(mousePosition.x - xCenter < 0){
      characterOrientation = Math.PI + characterOrientation;
    }
    if(characterOrientation < 0){
      characterOrientation += Math.PI * 2
    }
  }
);
function getMousePos(canvas, evt) {
  var rect = canvas.getBoundingClientRect();
  return {
    x: evt.clientX - rect.left,
    y: evt.clientY - rect.top
  };
}

function drawSword(xpos, ypos, swordLength, swordAngle){
  ctx.beginPath();
  ctx.moveTo(xpos + Math.cos(swordAngle)*playerSize/2, ypos + Math.sin(swordAngle)*playerSize/2);
  ctx.lineTo(xpos + Math.cos(swordAngle)*swordLength, ypos + Math.sin(swordAngle)*swordLength);
  ctx.stroke();
  ctx.closePath();
}