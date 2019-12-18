const CollisionEngine = require("./CollisionEngine.js");
const Player = require("./GameEntities/PlayerCharacter.js");
const Wall = require("./GameEntities/Wall.js");
const Enemy = require("./GameEntities/Enemy.js");
const Zombie = require("./GameEntities/Enemies/Zombie.js");
const Floor = require("./GameEntities/FloorTile.js");
const fs = require('fs');
const gridSize = 40;
module.exports = class GameEngine{
  constructor(){
    this.uniquePlayerID = 0;
    this.players = [];
    this.enemies = [];
    this.walls = [];
    this.collisionEngine = new CollisionEngine(120*gridSize, 120*gridSize);
    this.gameEntities = [];
    this.spawnLocations = [];
    this.collisionEngine.spawnLocations = this.spawnLocations;
    //this.generateMap();
    this.generateLevel001();
  }
  gameLoop(){
    this.players.forEach(element => {
      element.update();
    });
  }
  addPlayer(){
    var targetSpawnTile = this.spawnLocations[0];
    var newPlayer = new Player(
      targetSpawnTile.location.x,
      targetSpawnTile.location.y,
      gridSize,
      this.collisionEngine
    );
    newPlayer.uniquePlayerID = this.uniquePlayerID;
    this.players.push(newPlayer);
    this.uniquePlayerID++;
    this.collisionEngine.addObject(newPlayer)
    return newPlayer.uniquePlayerID;
  }
  removePlayer(playerID){
    this.players.forEach(function(element, index, array){
      if(element.uniquePlayerID === playerID){
        array.splice(index, 1);
      }
    });
    this.collisionEngine.removePlayerByID(playerID);
  }
  recievePlayerInput(playerJSon, playerIndex){
    this.players.forEach(element=>{
      if(element.uniquePlayerID == playerIndex){
        element.receiveAction(playerJSon);
      }
    });
  }

  getClientInfo(playerIndex){
    return this.collisionEngine.getPlayerView(playerIndex);
  }
  //#region Loads all the maps
  //#region Playground Map
  generateMap(){
    var mapInformation = [];
    var mapInformation = this.importStartMap();
    var entityToBeAdded;
    var addedEntities = 0;
    for(var index = 0; index < mapInformation.length; index++){
      switch(mapInformation[index][0]){
        case "0":
          entityToBeAdded = new Wall(
            mapInformation[index][2] * gridSize,
            mapInformation[index][1] * gridSize,
            gridSize,
            this.collisionEngine);
          this.walls.push(entityToBeAdded);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        case "9":
          entityToBeAdded = new Zombie(
            mapInformation[index][2] * gridSize,
            mapInformation[index][1] * gridSize,
            gridSize,
            this.collisionEngine,
            1);
          this.collisionEngine.addObject(entityToBeAdded);
      }
      addedEntities++;
    }
  }
  importStartMap(){
    var fileName = "./startMap.csv";
    var result = [];
    var csv = fs.readFileSync(fileName).toString();  
    var lines=csv.split("\n");
    for(var x=0;x<lines.length;x++){
      var rowdata = lines[x].split(",");
	    for(var y = 0; y < rowdata.length; y++){
        if(rowdata[y] !== "-1"){
          var assignmentArray = [rowdata[y], x, y];
          result.push(assignmentArray);
        }
      }
    }
    return result;
  }
  //#endregion
  //#region Level 1
  importLevel001(){
    var fileName = "./Level_src/Level001.csv";
    var result = [];
    var csv = fs.readFileSync(fileName).toString();  
    var lines=csv.split("\n");
    for(var x=0;x<lines.length;x++){
      var rowdata = lines[x].split(",");
	    for(var y = 0; y < rowdata.length; y++){
        if(rowdata[y] !== "-1"){
          var assignmentArray = [rowdata[y], x, y];
          result.push(assignmentArray);
        }
      }
    }
    return result;
  }
  generateLevel001(){
    var mapInformation = [];
    var mapInformation = this.importLevel001();
    var entityToBeAdded;
    for(var index = 0; index < mapInformation.length; index++){
      switch(mapInformation[index][0]){
        case "0":{//Wall
          entityToBeAdded = new Wall(
            mapInformation[index][2] * gridSize,
            mapInformation[index][1] * gridSize,
            gridSize,
            this.collisionEngine);
          this.walls.push(entityToBeAdded);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        }
        case "6":{//Small Slime
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize+1,
            mapInformation[index][1] * gridSize+1,
            gridSize-2,
            this.collisionEngine);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        }
        case "7":{//Large Slime
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize+1,
            mapInformation[index][1] * gridSize+1,
            gridSize-2,
            this.collisionEngine);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        }
        case "8":{//Skeleton
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize+1,
            mapInformation[index][1] * gridSize+1,
            gridSize-2,
            this.collisionEngine);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        }
        case "9":{//Zombie
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize+1,
            mapInformation[index][1] * gridSize+1,
            gridSize-2,
            this.collisionEngine);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        }
        case "12":{//Bat
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize+1,
            mapInformation[index][1] * gridSize+1,
            gridSize-2,
            this.collisionEngine);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        }
        case "14":{//Boss Zombie
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize+1,
            mapInformation[index][1] * gridSize+1,
            gridSize-2,
            this.collisionEngine);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        }
        case "18":{//Mimic
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize+1,
            mapInformation[index][1] * gridSize+1,
            gridSize-2,
            this.collisionEngine);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        }
        case "25":{//Spawn Tile
          entityToBeAdded = new Floor(
            mapInformation[index][2] * gridSize,
            mapInformation[index][1] * gridSize,
            gridSize,
            this.collisionEngine);
          this.collisionEngine.addObject(entityToBeAdded);
          this.spawnLocations.push(entityToBeAdded);
          break;
        }
      }
    }
  }
  //#endregion
  //#endregion
}