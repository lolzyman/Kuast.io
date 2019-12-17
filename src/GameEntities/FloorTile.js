const gameEntity = require("../gameEntity.js");

module.exports = class FloorTile extends gameEntity {
  constructor(
    xPosition,
    yPosition,
    size,
    parentCollisionEngine,
    objectsToDrawArray
    ){
      super(
        xPosition,
        yPosition,
        size,
        parentCollisionEngine,
        objectsToDrawArray
      );
      console.log("I got created!");
    }
}