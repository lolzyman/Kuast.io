const gameEntity = require("../gameEntity.js");

module.exports =  class Projectile extends gameEntity {
  constructor(
    xPosition,
    yPosition,
    size,
    parentCollisionEngine
  ) {
    super(
      xPosition,
      yPosition,
      size,
      parentCollisionEngine
    );
    this.damage = 20;
    this.baseColor = "#888";
    this.collisionStyle = "Circle";
    this.direction = 0;
    this.velocity = {
      x: 0,
      y: 0
    };
  }
  testInstantCollision(){
    if (!this.quadrent.testMovement(this, false)) {
      console.log("Instant Destory");
      this.destroy();
    }
  }
  update() {
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
    if (!this.quadrent.testMovement(this, true)) {
      this.destroy();
    }else{
      this.quadrent.checkEntityImmigration(this);
    }
  }
}
