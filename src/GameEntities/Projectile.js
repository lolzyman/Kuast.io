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
    this.velocity = {
      x: 0,
      y: 0
    };
  }
  update() {
    this.location.x += this.velocity.x;
    this.location.y += this.velocity.y;
    if (this.collisionEngine.doesMovementCauseCollision(this)) {
      this.destroy();
    }
  }
  draw(ctx) {
    this.update();
    ctx.beginPath();
    ctx.strokeStyle = this.baseColor;
    ctx.fillStyle = this.baseColor;
    ctx.arc(
      this.location.x + this.size.x / 2,
      this.location.y + this.size.y / 2,
      this.size.x / 2,
      0,
      2 * Math.PI
    );
    //ctx.stroke();
    ctx.fill();
    ctx.closePath();
  }
}
