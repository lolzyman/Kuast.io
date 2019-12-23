let canvas = document.getElementById("myCanvas");
let ctx = canvas.getContext("2d");
let xCenter = 210;
let yCenter = 210;
let characterOrientation = 0;
ctx.fillStyle = "white";
ctx.fillRect(0,0,420,420);

ctx.beginPath();
ctx.fillStyle = "red";
ctx.arc(xCenter, yCenter, 10, 0, 2* Math.PI);
ctx.fill();
ctx.closePath();

function drawRectWithShadow(rectObject){
  drawBlackOut(rectObject);

  ctx.beginPath();
  ctx.fillStyle = "grey";
  ctx.rect(rectObject.x, rectObject.y, rectObject.size, rectObject.size);
  ctx.fill();
  ctx.closePath();
}

function drawBlackOut(rectObject){
  var rectPoint1 = {x:rectObject.x,y:rectObject.y};
  var rectPoint2 = {x:rectObject.x + rectObject.size,y:rectObject.y};
  var rectPoint3 = {x:rectObject.x + rectObject.size,y:rectObject.y + rectObject.size};
  var rectPoint4 = {x:rectObject.x,y:rectObject.y + rectObject.size};
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
    point2 = rectPoint4;
  }
  //draws Blackout
  ctx.beginPath();
  addPointLine(point1);
  addPointLine(point2,true);
  ctx.closePath();
  ctx.fillStyle = "black";
  ctx.fill();
  
}
function addPointLine(point, inverse = false){
  var targetRadius = Math.SQRT2 * 210;
  var pointRadius = Math.sqrt(Math.pow(point.x-xCenter,2)+Math.pow(point.y-yCenter,2));
  var pointRadiusK = targetRadius / pointRadius;
  var newPoint = {x:(point.x - xCenter) * pointRadiusK + xCenter, y:(point.y - yCenter) * pointRadiusK + yCenter};
  if(inverse){
    ctx.lineTo(point.x, point.y);
    ctx.lineTo(newPoint.x, newPoint.y);
  }else{
    ctx.lineTo(newPoint.x, newPoint.y);
    ctx.lineTo(point.x, point.y);
  }
}
function calculateAngle(point){
  var orientation = Math.atan((point.y - yCenter)/(point.x - xCenter));
  if(point.x - xCenter < 0){
    orientation = Math.PI + orientation;
  }
  if(orientation < 0){
    orientation += Math.PI * 2
  }
  return orientation;
}

//Bottom Right
var rectObject = {x:xCenter + 50, y:yCenter + 50, size: 20};
drawRectWithShadow(rectObject);
//Bottom Left
var rectObject = {x:xCenter - 50, y:yCenter + 50, size: 20};
drawRectWithShadow(rectObject);
//Top Left
var rectObject = {x:xCenter - 50, y:yCenter - 50, size: 20};
drawRectWithShadow(rectObject);
//Top Right
var rectObject = {x:xCenter + 20, y:yCenter - 50, size: 20};
drawRectWithShadow(rectObject);