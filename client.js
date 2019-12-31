// Link Server https://intense-reef-90904.herokuapp.com/
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
let wallMemory = [];
let wallIds = [];
let floorMemory = [];
let floorIds = [];
//#endregion
let mousePosition;
let xOffset = 0;
let yOffset = 0;
let xCenter = 410;
let yCenter = 410;
let xClear = 820;
let yClear = 820;
let characterOrientation = 0;
let singleSample = false;
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
          singleSample = newBoolean;
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

var targetGameServer;
//targetGameServer = 'ws://24.13.240.19:1337'; // Configuration for running the server at home
targetGameServer = 'ws://localhost:1337'; // Configuration for running development on the laptop

// Server that is used to determine things like login information, character class selection and other things that don't need a deticated websocket
var targetInfoServer;

// open connection
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
  ctx.fillStyle = "black";
  ctx.fillRect(0,0,xClear,yClear);
  //#region Draw Floors
  json.floors.forEach(element=>{
    ctx.beginPath();
    ctx.fillStyle = "brown";
    var screenPoint = covertWorldPointToScreenPoint(element);
    //ctx.rect(element.x - xOffset + xCenter, element.y  - yOffset + yCenter, playerSize, playerSize);
    ctx.rect(screenPoint.x, screenPoint.y, playerSize, playerSize);
    ctx.fill();
    ctx.closePath();
  });
  //#endregion
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
  //#region Draw Enemies
  json.enemies.forEach(element =>{
    var elementCenterx = element.x - xOffset + xCenter + playerSize / 2;
    var elementCentery = element.y - yOffset + xCenter + playerSize / 2;
    ctx.beginPath();
    ctx.fillStyle = "blue";
    ctx.arc(elementCenterx, elementCentery, playerSize /2, 0, Math.PI * 2);
    ctx.fill();
    ctx.closePath();
    //#region Draw Health Bar
    ctx.beginPath();
    ctx.fillStyle = "red";
    ctx.strokeStyle = "black";
    ctx.rect(elementCenterx - 20, elementCentery - 32, 40, 7);
    ctx.stroke();
    ctx.closePath();
    ctx.beginPath();
    ctx.rect(elementCenterx - 20, elementCentery - 32, 40 * element.health/100, 7);
    ctx.fill();
    ctx.closePath();
  //#endregion
  });
  //#endregion
  //#region Draws Projectiles
  json.projectiles.forEach(element=>{
    drawProjectile(element);
  });
  //#endregion
  //#region Draw Walls
    var wallDrawArray = json.walls;
    //json.walls.sort(furthestWallSorter);
    //selectSeenWalls(json.walls, wallDrawArray);
    wallDrawArray.forEach(element =>{
      if(calculateDistance({x:element.x - xOffset + xCenter, y:element.y-yOffset + yCenter}, {x:xCenter, y:yCenter}) < Math.SQRT2 * 250){
        drawBlackOut(element);
      }
    });
    wallDrawArray.forEach(element =>{
      if(calculateDistance({x:element.x - xOffset + xCenter, y:element.y-yOffset + yCenter}, {x:xCenter, y:yCenter}) < Math.SQRT2 * 250){
        drawWall(element);
      }
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
  //#region Draw Health Bar
  ctx.beginPath();
  ctx.fillStyle = "red";
  ctx.strokeStyle = "black";
  ctx.rect(xCenter - 20, yCenter - 32, 40, 7);
  ctx.stroke();
  ctx.closePath();
  ctx.beginPath();
  ctx.rect(xCenter - 20, yCenter - 32, 40 * json.player.health/100, 7);
  ctx.fill();
  ctx.closePath();
  //#endregion
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
function drawProjectile(projectile){
  var projectileLocation = covertWorldPointToScreenPoint(projectile);
  var projectileCenter = {x:projectileLocation.x + projectile.size.x/2,y:projectileLocation.y + projectile.size.y/2};
  ctx.beginPath();
  console.log(projectile.size.x/2);
  ctx.arc(projectileCenter.x ,projectileCenter.y, projectile.size.x/2,0, Math.PI * 2);
  ctx.fillStyle = "red";
  ctx.strokeStyle = "blue";
  ctx.closePath();
  ctx.stroke();
  ctx.fill();
}
function drawWall(wallObject){
  ctx.beginPath();
  ctx.fillStyle = "grey";
  ctx.strokeStyle = "red";
  ctx.rect(wallObject.x  - xOffset + xCenter, wallObject.y  - yOffset + yCenter, playerSize, playerSize);
  ctx.fill();
  if(wallObject.transparent != undefined){
    if(wallObject.transparent === false){
      ctx.stroke();
    }
  }
  ctx.closePath();
}
function selectSeenWalls(arrayOfWalls,wallDrawArray){
  for(var index = 0; index < arrayOfWalls.length; index++){
    if(calculateDistance({x:arrayOfWalls[index].x - xOffset + xCenter, y:arrayOfWalls[index].y-yOffset + yCenter}, {x:xCenter, y:yCenter}) < Math.SQRT2 * 250){
      if(checkVisionWallCollision(arrayOfWalls[index], arrayOfWalls,index) === false){
        arrayOfWalls[index].transparent = true;
      }else{
        wallDrawArray.push(arrayOfWalls[index]);
      }
    }
  }

}
function lineSegmentsIntersection(lineSegment1, lineSegment2){
  if(lineLinesegmentIntersection(lineSegmentToParametric(lineSegment1), lineSegment2) && lineLinesegmentIntersection(lineSegmentToParametric(lineSegment2), lineSegment1)){
    return true;
  }
}
function furthestWallSorter(a,b){
  return wallPriority(b) - wallPriority(a);
}
function closestWallSorter(a,b){
  return wallPriority(a) - wallPriority(b);
}
function lineLinesegmentIntersection(lineObjectParameteric, lineSegment){
  var point0 = lineObjectParameteric.point;
  var vector1 = lineObjectParameteric.vector;
  var point1 = lineSegment.point1;
  var point2 = lineSegment.point2;
  var vector2 = pointsToVector(point0, point1);
  var vector3 = pointsToVector(point0, point2);
  var point1Value = crossProduct(vector1, vector2);
  var point2Value = crossProduct(vector1, vector3);
  var intersectionConstant = point1Value * point2Value;
  if(intersectionConstant > 0){
    return false;
  }else{
    return true;
  }
}
function lineSegmentToParametric(lineSegment){
  return {point: lineSegment.point1, vector:pointsToVector(lineSegment.point1, lineSegment.point2)};
}
function covertWorldPointToScreenPoint(point){
  return {x:point.x - xOffset + xCenter, y:point.y - yOffset + yCenter};
}
function covertWorldPointsToScreenPoints(pointsArray){
  var convertedPointsArray = [];
  for(var index = 0; index < pointsArray.length; index++){
    convertedPointsArray.push(covertWorldPointToScreenPoint(pointsArray[index]));
  }
  return convertedPointsArray;
}
function drawLine(lineObject, lineStyle = 1){
  var point1 = lineObject.point1;
  var point2 = lineObject.point2;
  ctx.moveTo(point1.x - xOffset + xCenter, point1.y - yOffset + yCenter);
  ctx.lineTo(point2.x - xOffset + xCenter, point2.y - yOffset + yCenter);
  switch(lineObject.lineStyle){
    case 1:
      ctx.strokeStyle = "red";
      break;
    case 2:
      ctx.strokeStyle = "green";
      break;
    default:
      ctx.strokeStyle = "red";
      break;
  }
  ctx.stroke();
}
//This is a true Collision with collision hit box
function checkVisionWallCollision(targetWall, arrayOfWall, targetIndex){
  var cornersAreBlocked = [false, false, false, false];
  for(var index = targetIndex+1; index < arrayOfWall.length;index++){
    var rectObject1 = targetWall;
    var rectObject2 = arrayOfWall[index];
    var rectObject1Points = generateRectObjectPoints(rectObject1);
    for(var i = 0; i < rectObject1Points.length; i++){
      var visionLineSegment = pointsToLineSegment(covertWorldPointToScreenPoint(rectObject1Points[i]), {x:xCenter, y:yCenter});
      if(trueLineRectCollision(visionLineSegment, rectObject2) === true){
        cornersAreBlocked[i] = true;
      }else{
      }
    }
  }
  if(cornersAreBlocked.reduce(function(total, num){return total+num}) < 4){
    return true;
  }else{
    return false;
  }
}
function generateRectObjectPoints(rectObject){
  var northWestPoint = {x:rectObject.x, y:rectObject.y};
  var northEastPoint = {x:rectObject.x + playerSize, y:rectObject.y};
  var southEastPoint = {x:rectObject.x + playerSize, y:rectObject.y + playerSize};
  var southWestPoint = {x:rectObject.x, y:rectObject.y + playerSize};
  return [northWestPoint, northEastPoint, southEastPoint, southWestPoint];
}
function trueLineRectCollision(lineSegment0, rectObject){
  var rectObjectPoints = generateRectObjectPoints(rectObject);
  rectObjectPoints = covertWorldPointsToScreenPoints(rectObjectPoints);
  var lineSegment1 = pointsToLineSegment(rectObjectPoints[0],rectObjectPoints[1]);
  var lineSegment2 = pointsToLineSegment(rectObjectPoints[1],rectObjectPoints[2]);
  var lineSegment3 = pointsToLineSegment(rectObjectPoints[2],rectObjectPoints[3]);
  var lineSegment4 = pointsToLineSegment(rectObjectPoints[0],rectObjectPoints[3]);
  if(lineSegmentsIntersection(lineSegment0, lineSegment1)=== true){
    return true;
  }
  if(lineSegmentsIntersection(lineSegment0, lineSegment2) === true){
    return true;
  }
  if(lineSegmentsIntersection(lineSegment0, lineSegment3) === true){
    return true;
  }
  if(lineSegmentsIntersection(lineSegment0, lineSegment4) === true){
    return true;
  }
  return false;
}
function pointsToLineSegment(point1, point2){
  return {point1:point1, point2:point2};
}
function lineLinesegmentIntersection(lineObjectParameteric, lineSegment){
  var point0 = lineObjectParameteric.point;
  var vector1 = lineObjectParameteric.vector;
  var point1 = lineSegment.point1;
  var point2 = lineSegment.point2;
  var vector2 = pointsToVector(point0, point1);
  var vector3 = pointsToVector(point0, point2);
  var point1Value = crossProduct(vector1, vector2);
  var point2Value = crossProduct(vector1, vector3);
  var intersectionConstant = point1Value * point2Value;
  if(intersectionConstant > 0){
    return false;
  }else{
    return true;
  }
}
function pointsToVector(point1, point2){
  return {x:point2.x - point1.x, y:point2.y - point1.y};
}
function pointsToParametricLine(point1, point2){
  return {point:point1, vector:pointsToVector(point1, point2)};
}
function crossProduct(vector1, vector2){
  return vector1.x*vector2.y-vector1.y*vector2.x;
}
/**
* This method is optional. If the server wasn't able to
* respond to the in 3 seconds then show some error message 
* to notify the user that something is wrong.
*/
setInterval(function() {
  if (connection.readyState !== 1) {
    console.log("Server Isn't Connected");
    //connection = new WebSocket(targetGameServer);
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

//Needs Optimization
function drawBlackOut(rectObject){
  var rectPoint1 = {x:rectObject.x - xOffset,y:rectObject.y - yOffset};
  var rectPoint2 = {x:rectObject.x - xOffset+ playerSize,y:rectObject.y - yOffset};
  var rectPoint3 = {x:rectObject.x - xOffset+ playerSize,y:rectObject.y - yOffset + playerSize};
  var rectPoint4 = {x:rectObject.x - xOffset,y:rectObject.y - yOffset + playerSize};
  var point1 = 0;
  var point2 = 0;
  //checks point1
  var angle = calculateAngle(rectPoint1);
  if(angle % Math.PI > Math.PI/2){
    point1 = rectPoint1;
  }

  var angle = calculateAngle(rectPoint2);
  if(angle % Math.PI <= Math.PI/2){
    if(point1 === 0){
      point1 = rectPoint2;
    }else{
      point2 = rectPoint2;
    }
  }

  var angle = calculateAngle(rectPoint3);
  if(angle % Math.PI > Math.PI/2){
    if(point1 === 0){
      point1 = rectPoint3;
    }else{
      point2 = rectPoint3;
    }
  }
  
  var angle = calculateAngle(rectPoint4);
  if(angle % Math.PI <= Math.PI/2){
    if(point1 === 0){
      point1 = rectPoint4;
    }else{
      point2 = rectPoint4;
    }
  }
  //draws Blackout
  ctx.beginPath();
  addPointLine(point1);
  addPointLine(point2,true);
  ctx.closePath();
  ctx.fillStyle = "black";
  //ctx.stroke();
  ctx.fill();
  
}
function calculateDistance(point1, point2){
  return Math.sqrt(Math.pow(point1.x - point2.x,2) + Math.pow(point1.y-point2.y,2));
}
function wallPriority(wallObject){
  return calculateDistance(wallObject, {x:xOffset, y:yOffset});
}
function addPointLine(point, inverse = false){
  var targetRadius = Math.SQRT2 * 210;
  var pointRadius = Math.sqrt(Math.pow(point.x,2)+Math.pow(point.y,2));
  var pointRadiusK = targetRadius / pointRadius;
  var newPoint = {x:(point.x) * pointRadiusK, y:(point.y) * pointRadiusK};
  if(inverse){
    ctx.lineTo(point.x + xCenter, point.y + yCenter);
    ctx.lineTo(newPoint.x + xCenter, newPoint.y + yCenter);
  }else{
    ctx.lineTo(newPoint.x + xCenter, newPoint.y + yCenter);
    ctx.lineTo(point.x + xCenter, point.y + yCenter);
  }
}
function calculateAngle(point){
  var orientation = Math.atan((point.y)/(point.x));
  if(point.x - xCenter < 0){
    orientation = Math.PI + orientation;
  }
  if(orientation < 0){
    orientation += Math.PI * 2
  }
  return orientation;
}