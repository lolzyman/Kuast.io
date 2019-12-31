module.exports =  class VisionEngine{
  constructor(maxRenderDistance){
    this.maxRenderDistance = 210 * Math.SQRT2;
    this.oneOffSample = true;
    this.renderLines = [];
  }
  selectVisibleEntitiesClosest(arrayOfEntities, arrayOfSelectedEntities, blockingEntitiesArray){

  }
  selectBlockingWalls(arrayOfWalls, arrayOfSelectedWalls){
    arrayOfWalls.sort(this.closestWallSorter);
    for(var index = 0; index < arrayOfWalls.length; index++){
      arrayOfSelectedWalls.push(arrayOfWalls[index]);
    }
  }
  selectVisibleEntities(arrayOfEntities, arrayOfSelectedEntities, blockingEntitiesArray){
    this.renderLines = [];
    arrayOfEntities.sort(this.furthestWallSorter);
    for(var index = 0; index < arrayOfEntities.length; index++){
      if(this.checkVisible(arrayOfEntities[index], blockingEntitiesArray) === true){
        arrayOfSelectedEntities.push(arrayOfEntities[index]);
      }
    }
  }
  calculateDistance(point1, point2){
    return Math.sqrt(Math.pow(point1.x - point2.x,2) + Math.pow(point1.y-point2.y,2));
  }
  lineSegmentsIntersection(lineSegment1, lineSegment2){
    if(this.lineLinesegmentIntersection(this.lineSegmentToParametric(lineSegment1), lineSegment2) && this.lineLinesegmentIntersection(this.lineSegmentToParametric(lineSegment2), lineSegment1)){
      return true;
    }
    return false;
  }
  covertWorldPointToScreenPoint(point){
    return {x:point.x - this.xCenter, y:point.y - this.yCenter};
  }
  covertWorldPointsToScreenPoints(pointsArray){
    var convertedPointsArray = [];
    for(var index = 0; index < pointsArray.length; index++){
      convertedPointsArray.push(this.covertWorldPointToScreenPoint(pointsArray[index]));
    }
    return convertedPointsArray;
  }
  lineLinesegmentIntersection(lineObjectParameteric, lineSegment){
    var point0 = lineObjectParameteric.point;
    var vector1 = lineObjectParameteric.vector;
    var point1 = lineSegment.point1;
    var point2 = lineSegment.point2;
    var vector2 = this.pointsToVector(point0, point1);
    var vector3 = this.pointsToVector(point0, point2);
    var point1Value = this.crossProduct(vector1, vector2);
    var point2Value = this.crossProduct(vector1, vector3);
    var intersectionConstant = point1Value * point2Value;
    if(intersectionConstant > 0){
      return false;
    }else{
      return true;
    }
  }
  lineSegmentToParametric(lineSegment){
    return {point: lineSegment.point1, vector:this.pointsToVector(lineSegment.point1, lineSegment.point2)};
  }
  furthestWallSorter(a,b){
    return objectPriority(b) - objectPriority(a);
  }
  closestWallSorter(a,b){
    return objectPriority(a) - objectPriority(b);
  }
  objectPriority(object){
    return this.calculateDistance(object, {x:this.xCenter, y:this.yCenter});
  }
  pointsToVector(point1, point2){
    return {x:point2.x - point1.x, y:point2.y - point1.y};
  }
  crossProduct(vector1, vector2){
    return vector1.x*vector2.y-vector1.y*vector2.x;
  }
  checkVisible(targetWall, arrayOfWall){
    if(this.oneOffSample){

    }
    var cornersAreBlocked = [false, false, false, false];
    for(var index = 0; index < arrayOfWall.length;index++){
      if(arrayOfWall[index] !== targetWall){
        if(calculateDistance({x:0, y:0}, {x:targetWall.getBoundingBox().x - this.xCenter, y:targetWall.getBoundingBox().y - this.yCenter}) < this.maxRenderDistance){
          var rectObject1 = targetWall.getBoundingBox();
          var rectObject2 = arrayOfWall[index].getBoundingBox();
          var rectObject1Points = this.covertWorldPointsToScreenPoints(this.generateRectObjectPoints(rectObject1));
          for(var i = 0; i < rectObject1Points.length; i++){
            var visionLineSegment = this.pointsToLineSegment(this.covertWorldPointToScreenPoint(rectObject1Points[i]), {x:0, y:0});
            visionLineSegment.lineStyle = 1;
            this.renderLines.push(visionLineSegment);
            if(this.oneOffSample){
              //console.log(visionLineSegment.point1);
              //console.log(rectObject2);
            }
            if(this.trueLineRectCollision(visionLineSegment, rectObject2) === true){
              cornersAreBlocked[i] = true;
              break;
            }
            if(cornersAreBlocked.reduce(function(total, num){return total+num}) == 4){
              return false;
            }
          }
        }
      }
    }
    this.oneOffSample = false;
    return true;
  }
  setTargetEyes(eyesX, eyesY){
    this.xCenter = eyesX;
    this.yCenter = eyesY;
  }
  generateRectObjectPoints(rectObject){
    var northWestPoint = {x:rectObject.x, y:rectObject.y};
    var northEastPoint = {x:rectObject.x + rectObject.size.x, y:rectObject.y};
    var southEastPoint = {x:rectObject.x + rectObject.size.x, y:rectObject.y + rectObject.size.y};
    var southWestPoint = {x:rectObject.x, y:rectObject.y + rectObject.size.y};
    return [northWestPoint, northEastPoint, southEastPoint, southWestPoint];
  }
  pointsToLineSegment(point1, point2){
    return {point1:point1, point2:point2};
  }
  trueLineRectCollision(lineSegment0, rectObject){
    var rectObjectPoints = this.generateRectObjectPoints(rectObject);
    var lineSegment1 = this.pointsToLineSegment(this.covertWorldPointToScreenPoint(rectObjectPoints[0]),this.covertWorldPointToScreenPoint(rectObjectPoints[1]));
    var lineSegment2 = this.pointsToLineSegment(this.covertWorldPointToScreenPoint(rectObjectPoints[1]),this.covertWorldPointToScreenPoint(rectObjectPoints[2]));
    var lineSegment3 = this.pointsToLineSegment(this.covertWorldPointToScreenPoint(rectObjectPoints[2]),this.covertWorldPointToScreenPoint(rectObjectPoints[3]));
    var lineSegment4 = this.pointsToLineSegment(this.covertWorldPointToScreenPoint(rectObjectPoints[0]),this.covertWorldPointToScreenPoint(rectObjectPoints[3]));
    if(this.oneOffSample){
      console.log(lineSegment0);
      console.log(lineSegment1);
      console.log(lineSegment2);
      console.log(lineSegment3);
      console.log(lineSegment4);
    }
    if(this.lineSegmentsIntersection(lineSegment0, lineSegment1)=== true){
      return true;
    }
    if(this.lineSegmentsIntersection(lineSegment0, lineSegment2) === true){
      return true;
    }
    if(this.lineSegmentsIntersection(lineSegment0, lineSegment3) === true){
      return true;
    }
    if(this.lineSegmentsIntersection(lineSegment0, lineSegment4) === true){
      return true;
    }
    return false;
  }
}

function objectPriority(object){
  return calculateDistance(object, {x:this.xCenter, y:this.yCenter});
}

function calculateDistance(point1, point2){
  return Math.sqrt(Math.pow(point1.x - point2.x,2) + Math.pow(point1.y-point2.y,2));
}
