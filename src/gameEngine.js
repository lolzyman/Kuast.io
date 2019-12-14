const CollisionEngine = require("./CollisionEngine.js");
const Player = require("./GameEntities/PlayerCharacter.js");
const Wall = require("./GameEntities/Wall.js");
const Enemy = require("./GameEntities/Enemy.js");
const Zombie = require("./GameEntities/Enemies/Zombie.js");
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
    this.generateMap();
  }
  gameLoop(){
    this.players.forEach(element => {
      element.update();
    });
  }
  addPlayer(){
    var newPlayer = new Player(
      39*gridSize,
      7*gridSize,
      gridSize,
      this.collisionEngine,
      this.gameEntities
    );
    newPlayer.uniquePlayerID = this.uniquePlayerID;
    console.log(this.uniquePlayerID);
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
            this.collisionEngine,
            this.gameEntities);
          this.walls.push(entityToBeAdded);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        case "9":
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize,
            mapInformation[index][1] * gridSize,
            gridSize,
            this.collisionEngine,
            this.gameEntities);
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
    var addedEntities = 0;
    for(var index = 0; index < mapInformation.length; index++){
      switch(mapInformation[index][0]){
        case "0":
          entityToBeAdded = new Wall(
            mapInformation[index][2] * gridSize,
            mapInformation[index][1] * gridSize,
            gridSize,
            this.collisionEngine,
            this.gameEntities);
          this.walls.push(entityToBeAdded);
          this.collisionEngine.addObject(entityToBeAdded);
          break;
        case "9":
          entityToBeAdded = new Enemy(
            mapInformation[index][2] * gridSize,
            mapInformation[index][1] * gridSize,
            gridSize,
            this.collisionEngine,
            this.gameEntities);
          this.collisionEngine.addObject(entityToBeAdded);
      }
      addedEntities++;
    }
  }
  //#endregion
  //#endregion
}