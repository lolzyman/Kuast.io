// vscode-fold=1
const Player = require("./GameEntities/PlayerCharacter.js");
const Wall = require("./GameEntities/Wall.js");
const Enemy = require("./GameEntities/Enemy.js");
const Projectile = require("./GameEntities/Projectile.js");
const Floor = require("./GameEntities/FloorTile.js");
const Weapon = require("./Equippables/Weapon.js");
const VisionEngine = require("./visionEngine.js");

const quadrentSize = 10;
const gridSize = 40;
let xDim = 0;
let yDim = 0;
module.exports = class CollisionEngine {
  constructor(xSize, ySize) {
    //Default Definition where we determine the sizes of each of the quadrents. This is important
    this.collsionObjects = [];
    this.connectedPlayers = [];
    this.quadrents = [];
    this.spawnLocations = [];
    this.visionEngine = new VisionEngine(20);
    this.oneOff = true;
    //Creates the Quadrents
    xDim = xSize;
    yDim = ySize;
    for(var x = 0; x < Math.ceil(xSize / quadrentSize / gridSize); x++){
      var quadrentRows = [];
      for(var y = 0; y < Math.ceil(ySize / quadrentSize / gridSize); y++){
        var newQuadrent = new collisionQuadrentContainer({x:x*quadrentSize * gridSize, y:y*quadrentSize * gridSize},{x:(x+1)*quadrentSize * gridSize, y:(y+1)*quadrentSize * gridSize}, this);
        quadrentRows.push(newQuadrent);
      }
      this.quadrents.push(quadrentRows);
    }
   
    //lets the Quadrents see each other
    for(var x = 0; x < this.quadrents.length; x++){
      for(var y = 0; y < this.quadrents[x].length; y++){
        var quadrentInQuestion = this.quadrents[x][y];
        if(x != 0 && y != 0)
          quadrentInQuestion.setNorthWesternQuadrent(this.quadrents[x-1][y-1]);
        if(x != 0)
          quadrentInQuestion.setWesternQuadrent(this.quadrents[x-1][y]);
        if(x != 0 && y != this.quadrents[x].length - 1)
          quadrentInQuestion.setSouthWesternQuadrent(this.quadrents[x-1][y+1]);
        if(y != 0)
          quadrentInQuestion.setNorthernQuadrent(this.quadrents[x][y-1]);
        if(x != this.quadrents.length - 1)
          quadrentInQuestion.setNorthEasternQuadrent(this.quadrents[x+1][y-1]);
        if(x != this.quadrents.length - 1)
          quadrentInQuestion.setEasternQuadrent(this.quadrents[x+1][y]);
        if(y != this.quadrents[x].length - 1)
          quadrentInQuestion.setSothernQuadrent(this.quadrents[x][y+1]);
        if(y != this.quadrents[x].length - 1 && x != this.quadrents.length - 1)
          quadrentInQuestion.setSouthEasternQuadrent(this.quadrents[x+1][y+1]);
        quadrentInQuestion.updateAdjacentQuadrents();
      }
    }
    
  }
  clear(){
    this.quadrents = [];
    //Creates the Quadrents
    for(var x = 0; x < Math.ceil(xDim / quadrentSize / gridSize); x++){
      var quadrentRows = [];
      for(var y = 0; y < Math.ceil(yDim / quadrentSize / gridSize); y++){
        var newQuadrent = new collisionQuadrentContainer({x:x*quadrentSize * gridSize, y:y*quadrentSize * gridSize},{x:(x+1)*quadrentSize * gridSize, y:(y+1)*quadrentSize * gridSize}, this);
        quadrentRows.push(newQuadrent);
      }
      this.quadrents.push(quadrentRows);
    }
    //lets the Quadrents see each other
    for(var x = 0; x < this.quadrents.length; x++){
      for(var y = 0; y < this.quadrents[x].length; y++){
        var quadrentInQuestion = this.quadrents[x][y];
        if(x != 0 && y != 0)
          quadrentInQuestion.setNorthWesternQuadrent(this.quadrents[x-1][y-1]);
        if(x != 0)
          quadrentInQuestion.setWesternQuadrent(this.quadrents[x-1][y]);
        if(x != 0 && y != this.quadrents[x].length - 1)
          quadrentInQuestion.setSouthWesternQuadrent(this.quadrents[x-1][y+1]);
        if(y != 0)
          quadrentInQuestion.setNorthernQuadrent(this.quadrents[x][y-1]);
        if(x != this.quadrents.length - 1)
          quadrentInQuestion.setNorthEasternQuadrent(this.quadrents[x+1][y-1]);
        if(x != this.quadrents.length - 1)
          quadrentInQuestion.setEasternQuadrent(this.quadrents[x+1][y]);
        if(y != this.quadrents[x].length - 1)
          quadrentInQuestion.setSothernQuadrent(this.quadrents[x][y+1]);
        if(y != this.quadrents[x].length - 1 && x != this.quadrents.length - 1)
          quadrentInQuestion.setSouthEasternQuadrent(this.quadrents[x+1][y+1]);
        quadrentInQuestion.updateAdjacentQuadrents();
      }
    }
    this.connectedPlayers.forEach(element =>{
      element.location.x = this.spawnLocations[0].location.x;
      element.location.y = this.spawnLocations[0].location.y;
      this.assignObjectToQuadrent(element);
    })
  }
  getPlayerView(playerID){
    var containingQuadrent;
    var targetPlayer;
    var playerViewObject = {};
    var otherPlayers = [];
    var walls = [];
    var enemies = [];
    var floors = [];
    var projectiles = [];
    var playersObjectArray = [];
    var wallsObjectArray = [];
    var enemiesObjectArray = [];
    var floorObjectArray = [];
    var projectilObjectArray = [];
    var seenPlayers = [];
    var seenWalls = [];
    var seenEnemies = [];
    var seenFloors = [];
    var seenProjectiles = [];
    for(var x = 0; x < this.quadrents.length; x++){
      for(var y = 0; y < this.quadrents.length; y++){
        if(this.quadrents[x][y].containsPlayerID(playerID)){
          containingQuadrent = this.quadrents[x][y];
          targetPlayer = containingQuadrent.getPlayer(playerID);
        }
      }
    }
    if(containingQuadrent != undefined){
      this.visionEngine.setTargetEyes(targetPlayer.location.x + targetPlayer.size.x/2, targetPlayer.location.y + targetPlayer.size.y/2);
      if(this.oneOff){
        console.log(targetPlayer.location.x, targetPlayer.location.y);
      }
      containingQuadrent.getReleventPlayers(playersObjectArray);
      containingQuadrent.getReleventWalls(wallsObjectArray);
      containingQuadrent.getReleventEnemies(enemiesObjectArray);
      containingQuadrent.getReleventFloors(floorObjectArray);
      containingQuadrent.getReleventProjectiles(projectilObjectArray);
      //this.visionEngine.selectVisibleEntities(playersObjectArray, seenPlayers, wallsObjectArray);
      var start = Date.now();
      //this.visionEngine.selectVisibleEntities(wallsObjectArray, seenWalls, wallsObjectArray);
      this.visionEngine.selectBlockingWalls(wallsObjectArray, seenWalls);
      //playerViewObject.lines = this.visionEngine.renderLines;
      var timeEllaspsed = (Date.now() - start);

      if(this.oneOff){
        console.log("The vision system took " + timeEllaspsed + " milliseconds. " + seenWalls.length + " walls were found. :(");
        this.oneOff = false;
      }
      
      playersObjectArray.forEach(function(item, index, array){
        if(item.uniquePlayerID != playerID){
          otherPlayers.push({
            x: item.location.x,
            y: item.location.y,
            orientation: item.orientationAngle,
            health: item.getHealthPercentage(),
            transparent: item.transparent,
            weapon: {type: "sword", swingAngle: item.currentSwordAngle + item.orientationAngle}
          })
        }else{
          playerViewObject.player = {
            x: item.location.x,
            y: item.location.y,
            orientation: item.orientationAngle,
            health: item.getHealthPercentage(),
            transparent: item.transparent,
            weapon: {type:"sword", swingAngle: item.currentSwordAngle + item.orientationAngle}
          }
        }
      });
      seenWalls.forEach(element =>{
        walls.push({x:element.location.x,y:element.location.y,transparent:element.transparent});
      });
      /*
      wallsObjectArray.forEach(element =>{
        walls.push({x:element.location.x,y:element.location.y,transparent:element.transparent});
      });
      //*/
      enemiesObjectArray.forEach(element =>{
        enemies.push({x:element.location.x,y:element.location.y,health:element.getHealthPercentage(),transparent:element.transparent});
      });
      floorObjectArray.forEach(element=>{
        floors.push({x:element.location.x,y:element.location.y,transparent:element.transparent});
      });
      projectilObjectArray.forEach(element=>{
        projectiles.push({x:element.location.x,y:element.location.y,size:element.size,angle:element.orientation});
      })
    }else{
    }
    playerViewObject.walls = walls;
    playerViewObject.otherPlayers = otherPlayers;
    playerViewObject.enemies = enemies;
    playerViewObject.floors = floors;
    playerViewObject.projectiles = projectiles;
    return playerViewObject;
  }
  addObject(object) {
    if(object instanceof Player){
      this.connectedPlayers.push(object);
    }
    this.assignObjectToQuadrent(object);
  }
  assignObjectToQuadrent(object){
    for(var i = 0; i < this.quadrents.length; i++){
      for(var j = 0; j < this.quadrents[i].length; j++){
        if(this.quadrents[i][j].shouldEntityBeMine(object, true)){
          return;
        }
      }
    }
  }
  removeObject(object) {
    for(var i = 0; i < this.quadrents.length; i++){
      for(var j = 0; j < this.quadrents[i].length; j++){
        this.quadrents[i][j].removeEntity(object);
      }
    }
  }
  removePlayerByID(playerID){
    for(var index = 0; index < this.connectedPlayers.length; index ++){
      var element = this.connectedPlayers[index];
      if(element.uniquePlayerID === playerID){
        this.removeObject(element);
        this.connectedPlayers.splice(index, 1);
      }
    }
  }
  testCollisionRect(firstRectObject, secondRectObject) {
    if (firstRectObject === secondRectObject) {
      return false;
    } else if (
      -1 * firstRectObject.size.x <
        firstRectObject.location.x - secondRectObject.location.x &&
      firstRectObject.location.x - secondRectObject.location.x <
        secondRectObject.size.x &&
      -1 * firstRectObject.size.y <
        firstRectObject.location.y - secondRectObject.location.y &&
      firstRectObject.location.y - secondRectObject.location.y <
        secondRectObject.size.y
    ) {
      if (
        firstRectObject.collisionStyle === "Circle" &&
        secondRectObject.collisionStyle === "Circle"
      ) {
      } else if (firstRectObject.collisionStyle === "Circle") {
        if (this.testCollisionRectCircle(secondRectObject, firstRectObject)) {
          firstRectObject.collidedWith(secondRectObject);
          secondRectObject.collidedWith(firstRectObject);
          return true;
        } else {
          return false;
        }
      } else if (secondRectObject.collisionStyle === "Circle") {
        this.testCollisionRectCircle(firstRectObject, secondRectObject);
        firstRectObject.collidedWith(secondRectObject);
        secondRectObject.collidedWith(firstRectObject);
        return true;
      } else {
        firstRectObject.collidedWith(secondRectObject);
        secondRectObject.collidedWith(firstRectObject);
        return true;
      }
    } else {
      return false;
    }
  }
  testCollisionArcCircle(arcObject, circleObject) {}
  testCollisionCircle(firstCircleObject, secondCircleObject) {}
  doesMovementCauseCollision(movingObject) {
    for (var i = 0; i < this.collsionObjects.length; i++) {
      if (this.testCollisionRect(movingObject, this.collsionObjects[i])) {
        return true;
      }
    }
    return false;
  }
  resetPlayerToSpawn(player){
    player.location.x = this.spawnLocations[0].location.x;
    player.location.y = this.spawnLocations[0].location.y;
    player.quadrent.removeEntity(player);
    this.assignObjectToQuadrent(player);
  }
}

class collisionQuadrentContainer{
  //This is a container for handling optimized rendering in the map.
  //Each player is going to render only the adjacent quadrents
  constructor(corner1, corner2, parentCollisionEngine){
    this.northernQuadrent;
    this.southernQuadrent;
    this.easternQuadrent;
    this.westernQuadrent;
    this.northWesternQuadrent;
    this.northEasternQuadrent;
    this.southWesternQuadrent;
    this.southEasternQuadrent;
    this.containedWalls = [];
    this.containedPlayers = [];
    this.containedEnemies = [];
    this.containedProjectiles = [];
    this.containedFloor = [];
    this.corner1 = corner1;
    this.corner2 = corner2;
    this.parentCollisionEngine = parentCollisionEngine;
  }
  respawn(playerToRespawn){
    this.parentCollisionEngine.resetPlayerToSpawn(playerToRespawn);
  }
  updateAdjacentQuadrents(){
    this.adjacentQuadrents = []
    if(this.northWesternQuadrent != undefined){
      this.adjacentQuadrents.push(this.northWesternQuadrent);
    }
    if(this.northernQuadrent != undefined){
      this.adjacentQuadrents.push(this.northernQuadrent);
    }
    if(this.northEasternQuadrent != undefined){
      this.adjacentQuadrents.push(this.northEasternQuadrent);
    }
    if(this.westernQuadrent != undefined){
      this.adjacentQuadrents.push(this.westernQuadrent);
    }
    if(this.easternQuadrent != undefined){
      this.adjacentQuadrents.push(this.easternQuadrent);
    }
    if(this.southWesternQuadrent != undefined){
      this.adjacentQuadrents.push(this.southWesternQuadrent);
    }
    if(this.southernQuadrent != undefined){
      this.adjacentQuadrents.push(this.southernQuadrent);
    }
    if(this.southEasternQuadrent != undefined){
      this.adjacentQuadrents.push(this.southEasternQuadrent);
    }
  }
  getPlayer(playerID){
    for(var index = 0; index < this.containedPlayers.length; index++){
      if(this.containedPlayers[index].uniquePlayerID === playerID){
        return this.containedPlayers[index];
      }
    }
  }
  //#region Collision Test Methods
  testMovement(movingObject, ImActuallyMoving){
      if(this.doesThisBumpAWall(movingObject, ImActuallyMoving)){
        //Object hits the wall and can't move there
        return false;
      }
      if(this.doesThisHitAPlayer(movingObject, ImActuallyMoving)){
        //Player hits the wall and can't move there
        return false;
      }
      if(this.doesThisHitAnEnemy(movingObject, ImActuallyMoving)){
        //Player hits the wall and can't move there
        return false;
      }
      //*
      for(var index = 0; index < this.adjacentQuadrents.length; index++){
        if(this.adjacentQuadrents[index].doesThisBumpAWall(movingObject, ImActuallyMoving)){
          //Player hits the wall and can't move there
          return false;
        }
        if(this.adjacentQuadrents[index].doesThisHitAPlayer(movingObject, ImActuallyMoving)){
          //Player hits the wall and can't move there
          return false;
        }
        if(this.adjacentQuadrents[index].doesThisHitAnEnemy(movingObject, ImActuallyMoving)){
          //Player hits the wall and can't move there
          return false;
        }
      }
    return true;
  }
  doesThisBumpAWall(objectDoingTheBumping, ImActuallyMoving){
    if(objectDoingTheBumping instanceof Projectile){
      if(this.testCollisionRectArrayCircle(this.containedWalls,objectDoingTheBumping,ImActuallyMoving)){
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Player){
      if(this.testCollisionRectArrayCircle(this.containedWalls,objectDoingTheBumping,ImActuallyMoving)){
        //You should test to see if the wall is a false wall;
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Weapon){
      if(this.testCollisionRectArrayLine(this.containedWalls, objectDoingTheBumping, ImActuallyMoving)){
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Enemy){
      if(this.testCollisionRectArrayCircle(this.containedWalls,objectDoingTheBumping,ImActuallyMoving)){
        return true;
      }else{
        return false;
      }
    }
    console.log("There was a collision test condition that wasn't found");
    return false;
  }
  doesThisHitAPlayer(objectDoingTheBumping, ImActuallyMoving){
    var otherObject;
    if(objectDoingTheBumping instanceof Projectile){
      if(otherObject = this.testCollisionCircleArrayCircle(this.containedPlayers,objectDoingTheBumping,ImActuallyMoving)){
        //Handle being shot by projectiles
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Player){
      if(otherObject = this.testCollisionCircleArrayCircle(this.containedPlayers,objectDoingTheBumping,ImActuallyMoving)){
        //Players bumping into each other
        //console.log("Here I think there is self collision");
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Weapon){
      if(otherObject = this.testCollisionCircleArrayLine(this.containedPlayers, objectDoingTheBumping, ImActuallyMoving)){
        //Handles Players hitting each other
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Enemy){
      if(otherObject = this.testCollisionCircleArrayCircle(this.containedPlayers,objectDoingTheBumping,ImActuallyMoving)){
        //Handles Enemies hitting players
        otherObject.attackedBy("blunt", 10, this.angleBetweenPoints(otherObject.getCenter(), objectDoingTheBumping.getCenter()));
        return true;
      }else{
        return false;
      }
    }
    console.log("There was a collision test condition that wasn't found");
    return false;
  }
  doesThisHitAnEnemy(objectDoingTheBumping, ImActuallyMoving){
    var otherObject;
    if(objectDoingTheBumping instanceof Projectile){
      if(otherObject = this.testCollisionCircleArrayCircle(this.containedEnemies,objectDoingTheBumping,ImActuallyMoving)){
        //Handle being shot by projectiles
        //otherObject.attackedBy("blunt", 1, this.angleBetweenPoints(otherObject.getCenter(), objectDoingTheBumping.point2));
        //otherObject.attackedBy("blunt", 1, 0, 0);
        console.log("I got hit by a projectile!");
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Player){
      if(otherObject = this.testCollisionCircleArrayCircle(this.containedEnemies,objectDoingTheBumping,ImActuallyMoving)){
        //Players bumping into each other
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Weapon){
      if(otherObject = this.testCollisionCircleArrayLine(this.containedEnemies, objectDoingTheBumping, ImActuallyMoving)){
        //Handles Players hitting each other
        otherObject.attackedBy("blunt", 1, this.angleBetweenPoints(otherObject.getCenter(), objectDoingTheBumping.point2));
        return true;
      }else{
        return false;
      }
    }
    if(objectDoingTheBumping instanceof Enemy){
      if(otherObject = this.testCollisionCircleArrayCircle(this.containedEnemies,objectDoingTheBumping,ImActuallyMoving)){
        //Handles Enemies hitting players
        return true;
      }else{
        return false;
      }
    }
    console.log("There was a collision test condition that wasn't found");
    return false;
  }
  testCollisionRectArrayCircle(rectArray, objectToTest, ImActuallyMoving){
    for(var index = 0; index < rectArray.length; index++){
      if(this.testCollisionRectCircle(rectArray[index], objectToTest)){
        if(ImActuallyMoving){
          rectArray[index].collidedWith(objectToTest);
        }
        return rectArray[index];
      }
    }
    return false;
  }
  testCollisionRectArrayLine(rectArray, objectToTest, ImActuallyMoving){
    for(var index = 0; index < rectArray.length; index++){
      if(this.testCollisionLineRect(objectToTest,rectArray[index])){
        if(ImActuallyMoving){
          rectArray[index].collidedWith(objectToTest);
        }
        return rectArray[index];
      }
    }
    return false;
  }
  testCollisionCircleArrayCircle(circleArray, objectToTest, ImActuallyMoving){
    for(var index = 0; index < circleArray.length; index++){
      if(circleArray[index] !== objectToTest){
        if(this.testCollisionCircleCircle(circleArray[index], objectToTest)){
          if(ImActuallyMoving){
            circleArray[index].collidedWith(objectToTest);
          }
          return circleArray[index];
        }
      }
    }
    return false;
  }
  testCollisionCircleArrayLine(circleArray, objectToTest, ImActuallyMoving){
    for(var index = 0; index < circleArray.length; index++){
      if(this.testCollisionLineCircle(objectToTest, circleArray[index])){
        if(ImActuallyMoving){
          circleArray[index].collidedWith(objectToTest);
        }
        return circleArray[index];
      }
    }
    return false;
  }
  testCollisionRectCircle(rectObject, circleObject) {
    if (
      (-1 * rectObject.size.x + circleObject.size.x / 2 <
        rectObject.location.x - circleObject.location.x &&
        rectObject.location.x - circleObject.location.x <
          circleObject.size.x / 2 &&
        -1 * rectObject.size.y <
          rectObject.location.y - circleObject.location.y &&
        rectObject.location.y - circleObject.location.y <
          circleObject.size.y) ||
      (-1 * rectObject.size.x <
        rectObject.location.x - circleObject.location.x &&
        rectObject.location.x - circleObject.location.x < circleObject.size.x &&
        -1 * rectObject.size.y + circleObject.size.y / 2 <
          rectObject.location.y - circleObject.location.y &&
        rectObject.location.y - circleObject.location.y <
          circleObject.size.y / 2)
    ) {
      //collision with the edge of the rect and the corner of the circle
      return true;
    } else if (
      Math.pow(
        Math.abs(
          rectObject.location.x +
            rectObject.size.x / 2 -
            circleObject.location.x -
            circleObject.size.x / 2
        ) -
          rectObject.size.x / 2,
        2
      ) +
        Math.pow(
          Math.abs(
            rectObject.location.y +
              rectObject.size.y / 2 -
              circleObject.location.y -
              circleObject.size.y / 2
          ) -
            rectObject.size.y / 2,
          2
        ) <
      Math.pow(circleObject.size.x / 2, 2)
    ) {
      //Collision with the corner of the rect and the edge of the circle
      return true;
    } else {
      //Empty Space where the rect would collide but the circle doesn't
      return false;
    }
  }
  testCollisionLineRect(lineObject,rectObject){
    var point1 = lineObject.point1;
    var point2 = lineObject.point2;
    var midpoint = {x:(point1.x + point2.x)/2, y:(point1.y + point2.y)/2};
    //*
    //#region Collision Scheme 1 (Just Tests EndPoints)
    if(this.pointContainedInRect(rectObject, point1)){
      return true;
    }
    if(this.pointContainedInRect(rectObject, point2)){
      return true;
    }
    //#endregion
    //*/
    /*
    //#region Collision Scheme 2 (Includes Midpoint Test)
    if(this.pointContainedInRect(rectObject, midpoint)){
      return true;
    }
    //#endregion
    //*/
    //*
    //Not Configure because it is assumed to be more CPU Intensive, more complex, and harder to debug
    //Will be configured to work to if there is complaints with the lower collision schemes
    //#region Collision Scheme 3 (True Collision)
    //http://www.cs.swan.ac.uk/~cssimon/line_intersection.html
    //#endregion
    //*/
    return false;
  }
  testCollisionCircleCircle(circleObjectOne, circleObjectTwo){
    var point1 = {x: circleObjectOne.location.x + circleObjectOne.size.x/2, y: circleObjectOne.location.y + circleObjectOne.size.y/2};
    var point2 = {x: circleObjectTwo.location.x + circleObjectTwo.size.x/2, y: circleObjectTwo.location.y + circleObjectTwo.size.y/2};
    if(this.distanceBetweenPoints(point1, point2) < circleObjectOne.size.x/2 + circleObjectTwo.size.x/2){
      return true;
    }
    return false;
  }
  testCollisionLineCircle(lineObject, circleObject){
    var point1 = lineObject.point1;
    var point2 = lineObject.point2;
    var circleCenter = {x: circleObject.location.x + circleObject.size.x/2, y: circleObject.location.y + circleObject.size.y/2};
    var midpoint = {x:(point1.x + point2.x)/2, y:(point1.y + point2.y)/2};
    if(lineObject.owner !== circleObject){
      //console.log(point1, point2, circleCenter, this.distanceBetweenPoints(circleCenter, point2));
      //*
      //#region Collision Scheme 1 (Just Tests EndPoints)
      //console.log(this.distanceBetweenPoints(point1, circleCenter),this.distanceBetweenPoints(point2, circleCenter))
      if(this.distanceBetweenPoints(point1, circleCenter) < circleObject.size.x/2){
        return true;
      }
      if(this.distanceBetweenPoints(point2, circleCenter) < circleObject.size.x/2){
        return true;
      }
      //#endregion
      //*/
      /*
      //#region Collision Scheme 2 (Includes Midpoint Test)
      if(this.distanceBetweenPoints(midpoint, circleCenter) < circleObject.size.x){
        return true;
      }
      //#endregion
      //*/
      //*
      //Not Configure because it is assumed to be more CPU Intensive, more complex, and harder to debug
      //Will be configured to work to if there is complaints with the lower collision schemes
      //#region Collision Scheme 3 (True Collision)
      //http://www.cs.swan.ac.uk/~cssimon/line_intersection.html
      //#endregion
      //*/
    }
    return false;
  }
  pointContainedInRect(rectObject, point){
    if(point.x > rectObject.location.x && point.x < rectObject.location.x + rectObject.size.x){
      //within X Bounds
      if(point.y > rectObject.location.y && point.y < rectObject.location.y + rectObject.size.y){
        //within Y Bounds
        return true;
      }
    }
    return false;
  }
  distanceBetweenPoints(point1, point2){
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    return Math.sqrt(dx*dx + dy*dy);
  }
  angleBetweenPoints(point1, point2){
    var dx = point1.x - point2.x;
    var dy = point1.y - point2.y;
    var orientation = Math.atan((dy)/(dx));
    if(dx < 0){
      orientation = Math.PI + orientation;
    }
    if(orientation < 0){
      orientation += Math.PI * 2;
    }
    return orientation;
  }
  //#endregion
  //#region Player View Methods
  getReleventPlayers(arrayForPlayers){
    this.containedPlayers.forEach(Element=>{
      arrayForPlayers.push(Element);
    });
    for(var index = 0; index < this.adjacentQuadrents.length; index++){
      for(var secondIndex = 0; secondIndex < this.adjacentQuadrents[index].containedPlayers.length; secondIndex++){
        arrayForPlayers.push(this.adjacentQuadrents[index].containedPlayers[secondIndex]);
      }
    }
  }
  getReleventWalls(arrayForWalls){
    this.containedWalls.forEach(Element=>{
      arrayForWalls.push(Element);
    });
    for(var index = 0; index < this.adjacentQuadrents.length; index++){
      for(var secondIndex = 0; secondIndex < this.adjacentQuadrents[index].containedWalls.length; secondIndex++){
        arrayForWalls.push(this.adjacentQuadrents[index].containedWalls[secondIndex]);
      }
    }
  }
  getReleventEnemies(arrayForEnemies){
    this.containedEnemies.forEach(Element=>{
      arrayForEnemies.push(Element);
    });
    for(var index = 0; index < this.adjacentQuadrents.length; index++){
      for(var secondIndex = 0; secondIndex < this.adjacentQuadrents[index].containedEnemies.length; secondIndex++){
        arrayForEnemies.push(this.adjacentQuadrents[index].containedEnemies[secondIndex]);
      }
    }
  }
  getReleventFloors(arrayForFloors){
    this.containedFloor.forEach(Element=>{
      arrayForFloors.push(Element);
    });
    for(var index = 0; index < this.adjacentQuadrents.length; index++){
      for(var secondIndex = 0; secondIndex < this.adjacentQuadrents[index].containedFloor.length; secondIndex++){
        arrayForFloors.push(this.adjacentQuadrents[index].containedFloor[secondIndex]);
      }
    }
  }
  getReleventProjectiles(arrayForProjectiles){
    this.containedProjectiles.forEach(element =>{
      arrayForProjectiles.push(element);
    });
    for(var index = 0; index < this.adjacentQuadrents.length; index++){
      for(var secondIndex = 0; secondIndex < this.adjacentQuadrents[index].containedProjectiles.length; secondIndex++){
        arrayForProjectiles.push(this.adjacentQuadrents[index].containedProjectiles[secondIndex]);
      }
    }
  }
  //#endregion
  //#region Entity Posession Methods
  containsPlayerID(playerID){
    for(var index = 0; index < this.containedPlayers.length; index++){
      if(this.containedPlayers[index].uniquePlayerID === playerID){
        return true;
      }
    }
  }
  shouldEntityBeMine(EntityInQuestion, objectBeingAdded){
    if(EntityInQuestion.location.x >= this.corner1.x && EntityInQuestion.location.x < this.corner2.x){
      if(EntityInQuestion.location.y >= this.corner1.y && EntityInQuestion.location.y < this.corner2.y){
        if(objectBeingAdded){
          this.addEntity(EntityInQuestion);
        }
        return true;
      }
    }
    return false;
  }
  checkEntityImmigration(EntityInQuestion){
    if(this.moveEntityToNewQuadrent(EntityInQuestion)){
      this.removeEntity(EntityInQuestion);
    }
  }
  removeEntity(EntityToRemove){
    if(EntityToRemove instanceof Player){
      this.containedPlayers.forEach(function(item, index, array){
        if(EntityToRemove === item){
          array.splice(index, 1);
        }
      });
      return;
    }
    
    if(EntityToRemove instanceof Projectile){
      this.containedProjectiles.forEach(function(item, index, array){
        if(EntityToRemove === item){
          array.splice(index, 1);
        }
      });
      return;
    }
    if(EntityToRemove instanceof Enemy){
      this.containedEnemies.forEach(function(item, index, array){
        if(EntityToRemove === item){
          array.splice(index, 1);
        }
      });
      return;
    }
    if(EntityToRemove instanceof Wall){
      this.containedWalls.forEach(function(item, index, array){
        if(EntityToRemove === item){
          array.splice(index, 1);
        }
      });
      return;
    }
    console.log("New Type of entity");
  }
  addEntity(EntityToAdd){
    EntityToAdd.setQuadrent(this);
    if(EntityToAdd instanceof Player){
      this.containedPlayers.push(EntityToAdd);
      return;
    }
    if(EntityToAdd instanceof Projectile){
      this.containedProjectiles.push(EntityToAdd);
      return;
    }
    if(EntityToAdd instanceof Enemy){
      this.containedEnemies.push(EntityToAdd);
      return;
    }
    if(EntityToAdd instanceof Wall){
      this.containedWalls.push(EntityToAdd);
      return;
    }
    if(EntityToAdd instanceof Floor){
      this.containedFloor.push(EntityToAdd);
      return;
    }
    console.log("New Type of entity");
  }
  //#endregion
  //#region Quadrent Setters
  moveEntityToNewQuadrent(EntityInQuestion){
    if(EntityInQuestion.location.x < this.corner1.x){
      if(EntityInQuestion.location.y < this.corner1.y){
        this.northWesternQuadrent.addEntity(EntityInQuestion);
        return true;
      }else if(EntityInQuestion.location.y >= this.corner2.y){
        this.southWesternQuadrent.addEntity(EntityInQuestion);
        return true;
      }else{
        this.westernQuadrent.addEntity(EntityInQuestion);
        return true;
      }
    }
    if(EntityInQuestion.location.x >= this.corner2.x){
      if(EntityInQuestion.location.y < this.corner1.y){
        this.northEasternQuadrent.addEntity(EntityInQuestion);
        return true;
      }else if(EntityInQuestion.location.y >= this.corner2.y){
        this.southEasternQuadrent.addEntity(EntityInQuestion);
        return true;
      }else{
        this.easternQuadrent.addEntity(EntityInQuestion);
        return true;
      }
    }
    if(EntityInQuestion.location.y < this.corner1.y){
      this.northernQuadrent.addEntity(EntityInQuestion);
      return true;
    }
    if(EntityInQuestion.location.y >= this.corner2.y){
      this.southernQuadrent.addEntity(EntityInQuestion);
      return true;
    }
    return false;
  }
  setNorthernQuadrent(newNorthernQuadrent){
    this.northernQuadrent = newNorthernQuadrent
  }
  setSothernQuadrent(newSouthernQuadrent){
    this.southernQuadrent = newSouthernQuadrent;
  }
  setEasternQuadrent(newEasternQuadrent){
    this.easternQuadrent = newEasternQuadrent;
  }
  setWesternQuadrent(newWesternQuadrent){
    this.westernQuadrent = newWesternQuadrent;
  }
  setNorthWesternQuadrent(newNorthWesternQuadrent){
    this.northWesternQuadrent = newNorthWesternQuadrent;
  }
  setNorthEasternQuadrent(newNorthEasternQuadrent){
    this.northEasternQuadrent = newNorthEasternQuadrent;
  }
  setSouthEasternQuadrent(newSouthEasternQuadrent){
    this.southEasternQuadrent = newSouthEasternQuadrent;
  }
  setSouthWesternQuadrent(newSouthWesternQuadrent){
    this.southWesternQuadrent = newSouthWesternQuadrent;
  }
  //#endregion
  //#region Quadrent Update Methods
  initialUpdate(){
    this.containedEnemies.forEach(element =>{
      element.update();
    });
    this.containedProjectiles.forEach(element =>{
      element.update();
    });
    this.adjacentQuadrents.forEach(element =>{
      element.secondaryUpdate();
    });
  }
  secondaryUpdate(){
    this.containedEnemies.forEach(element =>{
      element.update();
    });
    this.containedProjectiles.forEach(element =>{
      element.update();
    });
  }
  //#endregion
}