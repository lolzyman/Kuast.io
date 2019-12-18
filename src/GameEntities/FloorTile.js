const gameEntity = require("../gameEntity.js");

module.exports = class FloorTile extends gameEntity {
  constructor(
    xPosition,
    yPosition,
    size,
    parentCollisionEngine
    ){
      super(
        xPosition,
        yPosition,
        size,
        parentCollisionEngine
      );
    }
}